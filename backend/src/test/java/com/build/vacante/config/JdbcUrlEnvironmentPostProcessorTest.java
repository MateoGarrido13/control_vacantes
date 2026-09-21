package com.build.vacante.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.postgresql.Driver;

class JdbcUrlEnvironmentPostProcessorTest {

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
}
