package com.build.vacante.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.logging.DeferredLogFactory;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.Profiles;
import org.springframework.util.PlaceholderResolutionException;

/**
 * Accepts the URI that Supabase shows in the dashboard ({@code postgresql://user:pass@host/db})
 * and the invalid JDBC form {@code jdbc:postgresql://user:pass@host/db}, and turns them into a
 * JDBC URL plus username/password that Spring Boot / Hikari understand.
 *
 * <p>Must be registered in {@code META-INF/spring.factories}. The {@code .imports} file is not
 * loaded for {@code EnvironmentPostProcessor} on Spring Boot 4.
 */
public class JdbcUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    static final String PROPERTY_SOURCE_NAME = "normalizedDatasource";

    private final Log log;

    public JdbcUrlEnvironmentPostProcessor(DeferredLogFactory logFactory) {
        this.log = logFactory.getLog(JdbcUrlEnvironmentPostProcessor.class);
    }

    @Override
    public int getOrder() {
        // After application.properties is loaded, then addFirst so Hikari sees the JDBC URL.
        return Ordered.LOWEST_PRECEDENCE;
    }

    @Override
    public void postProcessEnvironment(
            ConfigurableEnvironment environment, SpringApplication application) {
        if (environment.acceptsProfiles(Profiles.of("local", "test"))) {
            log.info("Skipping Supabase datasource normalization (profile local/test)");
            return;
        }

        String rawUrl;
        try {
            rawUrl = firstPresent(
                environment.getProperty("spring.datasource.url"),
                environment.getProperty("SUPABASE_DB_URL"));
        } catch (PlaceholderResolutionException ex) {
            log.warn("No SUPABASE_DB_URL / spring.datasource.url to normalize");
            return;
        }
        if (rawUrl == null || rawUrl.isBlank() || rawUrl.contains("${")) {
            log.warn("No SUPABASE_DB_URL / spring.datasource.url to normalize");
            return;
        }

        Map<String, Object> overrides = new LinkedHashMap<>();
        applyNormalizedUrl(rawUrl, overrides);

        copyIfPresent(environment, overrides, "SUPABASE_DB_USERNAME", "spring.datasource.username");
        copyIfPresent(environment, overrides, "SUPABASE_DB_PASSWORD", "spring.datasource.password");

        Object jdbcUrl = overrides.get("spring.datasource.url");
        if (jdbcUrl instanceof String jdbcUrlValue) {
            overrides.put("spring.datasource.hikari.jdbc-url", jdbcUrlValue);
        }

        if (!overrides.isEmpty()) {
            environment.getPropertySources()
                .addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, overrides));
            log.info("Normalized datasource URL to " + jdbcUrl);
        }
    }

    static void applyNormalizedUrl(String rawUrl, Map<String, Object> overrides) {
        String url = strip(rawUrl);
        String parseable = url.startsWith("jdbc:") ? url.substring("jdbc:".length()) : url;

        if (parseable.startsWith("postgres://") || parseable.startsWith("postgresql://")) {
            URI uri = URI.create(parseable);
            String userInfo = uri.getUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                int colon = userInfo.indexOf(':');
                if (colon >= 0) {
                    overrides.put(
                        "spring.datasource.username",
                        decode(userInfo.substring(0, colon)));
                    overrides.put(
                        "spring.datasource.password",
                        decode(userInfo.substring(colon + 1)));
                } else {
                    overrides.put("spring.datasource.username", decode(userInfo));
                }
            }

            if (uri.getHost() == null || uri.getHost().isBlank()) {
                throw new IllegalArgumentException(
                    "SUPABASE_DB_URL no tiene host. Usá postgresql://user:pass@host:port/postgres");
            }

            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath() == null || uri.getPath().isBlank() ? "/postgres" : uri.getPath();
            String query = uri.getQuery();
            url = "jdbc:postgresql://" + uri.getHost() + ":" + port + path
                + (query == null || query.isBlank() ? "" : "?" + query);
        }

        overrides.put("spring.datasource.url", ensureSslMode(url));
    }

    private static String firstPresent(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private static String strip(String rawUrl) {
        String url = rawUrl.trim();
        if ((url.startsWith("\"") && url.endsWith("\""))
            || (url.startsWith("'") && url.endsWith("'"))) {
            url = url.substring(1, url.length() - 1).trim();
        }
        return url;
    }

    private static void copyIfPresent(
            ConfigurableEnvironment environment,
            Map<String, Object> overrides,
            String envKey,
            String propertyKey) {
        String value = environment.getProperty(envKey);
        if (value != null && !value.isBlank()) {
            overrides.put(propertyKey, decode(strip(value)));
        }
    }

    private static String ensureSslMode(String url) {
        if (!url.startsWith("jdbc:postgresql:")) {
            return url;
        }
        if (url.contains("sslmode=")) {
            return url;
        }
        if (isLoopbackJdbcUrl(url)) {
            return url;
        }
        return url + (url.contains("?") ? "&" : "?") + "sslmode=require";
    }

    private static boolean isLoopbackJdbcUrl(String jdbcUrl) {
        try {
            URI uri = URI.create(jdbcUrl.substring("jdbc:".length()));
            String host = uri.getHost();
            if (host == null) {
                return false;
            }
            return "localhost".equalsIgnoreCase(host)
                || "127.0.0.1".equals(host)
                || "::1".equals(host)
                || "host.docker.internal".equalsIgnoreCase(host);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
