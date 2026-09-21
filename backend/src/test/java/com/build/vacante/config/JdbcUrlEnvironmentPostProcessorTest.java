package com.build.vacante.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.postgresql.Driver;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.core.io.support.SpringFactoriesLoader;

class JdbcUrlEnvironmentPostProcessorTest {

    @Test
    void isRegisteredInSpringFactories() {
        List<String> names = SpringFactoriesLoader.loadFactoryNames(
            EnvironmentPostProcessor.class,
            JdbcUrlEnvironmentPostProcessor.class.getClassLoader());
        assertTrue(
            names.contains(JdbcUrlEnvironmentPostProcessor.class.getName()),
            () -> "Processor missing from META-INF/spring.factories: " + names);
    }

    @Test
    void postgresDriverRejectsLibpqUriThatHikariReceivesOnRender() {
        assertFalse(
            new Driver()
                .acceptsURL(
                    "postgresql://postgres.abc:secret@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"));
    }

    @Test
    void convertsSupabaseUriIntoJdbcUrlAndCredentials() {
        Map<String, Object> overrides = new LinkedHashMap<>();

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(
            "postgresql://postgres.abc:p%40ss@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
            overrides);

        assertEquals(
            "jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
            overrides.get("spring.datasource.url"));
        assertEquals("postgres.abc", overrides.get("spring.datasource.username"));
        assertEquals("p@ss", overrides.get("spring.datasource.password"));
    }

    @Test
    void extractsCredentialsFromInvalidJdbcUrlWithUserInfo() {
        Map<String, Object> overrides = new LinkedHashMap<>();
        String renderSecret =
            "jdbc:postgresql://postgres.abc:SUPA_RENDER_VACANTE@aws-0-sa-east-1.pooler.supabase.com:5432/postgres";

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(renderSecret, overrides);

        String normalized = (String) overrides.get("spring.datasource.url");
        assertEquals(
            "jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require",
            normalized);
        assertEquals("postgres.abc", overrides.get("spring.datasource.username"));
        assertEquals("SUPA_RENDER_VACANTE", overrides.get("spring.datasource.password"));
        assertTrue(new Driver().acceptsURL(normalized));
        assertFalse(normalized.contains("SUPA_RENDER_VACANTE"));
        assertFalse(normalized.contains("@"));
    }

    @Test
    void stripsQuotesAndNewlinesFromSecretFiles() {
        Map<String, Object> overrides = new LinkedHashMap<>();

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(
            "\"postgresql://postgres.abc:secret@db.example.supabase.co:5432/postgres\"\n",
            overrides);

        assertEquals(
            "jdbc:postgresql://db.example.supabase.co:5432/postgres?sslmode=require",
            overrides.get("spring.datasource.url"));
        assertEquals("postgres.abc", overrides.get("spring.datasource.username"));
        assertEquals("secret", overrides.get("spring.datasource.password"));
    }

    @Test
    void keepsJdbcUrlAndAddsSslWhenMissing() {
        Map<String, Object> overrides = new LinkedHashMap<>();

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(
            "jdbc:postgresql://db.example.supabase.co:5432/postgres",
            overrides);

        assertEquals(
            "jdbc:postgresql://db.example.supabase.co:5432/postgres?sslmode=require",
            overrides.get("spring.datasource.url"));
        assertFalse(overrides.containsKey("spring.datasource.username"));
    }

    @Test
    void doesNotForceSslOnLoopbackJdbcUrl() {
        Map<String, Object> overrides = new LinkedHashMap<>();

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(
            "jdbc:postgresql://localhost:5433/vacantes",
            overrides);

        assertEquals(
            "jdbc:postgresql://localhost:5433/vacantes",
            overrides.get("spring.datasource.url"));
    }

    @Test
    void keepsExplicitDisableSslOnLocalUrl() {
        Map<String, Object> overrides = new LinkedHashMap<>();

        JdbcUrlEnvironmentPostProcessor.applyNormalizedUrl(
            "jdbc:postgresql://127.0.0.1:5433/vacantes?sslmode=disable",
            overrides);

        assertEquals(
            "jdbc:postgresql://127.0.0.1:5433/vacantes?sslmode=disable",
            overrides.get("spring.datasource.url"));
    }
}
