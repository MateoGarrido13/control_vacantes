package com.build.vacante.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

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
