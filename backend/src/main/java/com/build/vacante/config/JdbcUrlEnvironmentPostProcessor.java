package com.build.vacante.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Accepts the URI that Supabase shows in the dashboard ({@code postgresql://user:pass@host/db})
 * and turns it into a JDBC URL plus username/password that Spring Boot / Hikari understand.
 */
public class JdbcUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    static final String PROPERTY_SOURCE_NAME = "normalizedDatasource";

    @Override
    public void postProcessEnvironment(
            ConfigurableEnvironment environment, SpringApplication application) {
        String rawUrl = environment.getProperty("spring.datasource.url");
        if (rawUrl == null || rawUrl.isBlank() || rawUrl.contains("${")) {
            return;
        }

        Map<String, Object> overrides = new LinkedHashMap<>();
        applyNormalizedUrl(rawUrl, overrides);

        copyIfPresent(environment, overrides, "SUPABASE_DB_USERNAME", "spring.datasource.username");
        copyIfPresent(environment, overrides, "SUPABASE_DB_PASSWORD", "spring.datasource.password");

        if (!overrides.isEmpty()) {
            environment.getPropertySources()
                .addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, overrides));
        }
    }

    static void applyNormalizedUrl(String rawUrl, Map<String, Object> overrides) {
        String url = rawUrl.trim();

        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            URI uri = URI.create(url);
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

            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath() == null || uri.getPath().isBlank() ? "/postgres" : uri.getPath();
            String query = uri.getQuery();
            url = "jdbc:postgresql://" + uri.getHost() + ":" + port + path
                + (query == null || query.isBlank() ? "" : "?" + query);
        }

        overrides.put("spring.datasource.url", ensureSslMode(url));
    }

    private static void copyIfPresent(
            ConfigurableEnvironment environment,
            Map<String, Object> overrides,
            String envKey,
            String propertyKey) {
        String value = environment.getProperty(envKey);
        if (value != null && !value.isBlank()) {
            overrides.put(propertyKey, value);
        }
    }

    private static String ensureSslMode(String url) {
        if (!url.startsWith("jdbc:postgresql:")) {
            return url;
        }
        if (url.contains("sslmode=")) {
            return url;
        }
        return url + (url.contains("?") ? "&" : "?") + "sslmode=require";
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
