package com.build.vacante;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.build.vacante.support.LocalPostgresContainerConfig;
import com.build.vacante.support.SqlCaptureInspector;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(LocalPostgresContainerConfig.class)
class VacantePostgresIsolationTest {

    private static final String CREATE_PAYLOAD = """
        {
          "puesto": "Pasante Sistemas",
          "empresa": "Mercado Libre",
          "modalidad": "Presencial",
          "requisitos": "",
          "estado": "PENDIENTE",
          "prioridad": "MEDIA"
        }
        """;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DataSource dataSource;

    @Test
    void createAndListUseOnlyVacantesTableOnLocalPostgres() throws Exception {
        mockMvc.perform(post("/api/v1/vacantes")
                .contentType(APPLICATION_JSON)
                .content(CREATE_PAYLOAD))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.puesto").value("Pasante Sistemas"))
            .andExpect(jsonPath("$.id").exists());

        mockMvc.perform(get("/api/v1/vacantes").accept(APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].puesto").value("Pasante Sistemas"));

        List<String> publicTables = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement()) {
            try (ResultSet tables = statement.executeQuery(
                "select tablename from pg_tables where schemaname = 'public'")) {
                while (tables.next()) {
                    publicTables.add(tables.getString(1));
                }
            }
            try (ResultSet schemas = statement.executeQuery(
                "select nspname from pg_namespace where nspname = 'supabase_migrations'")) {
                assertFalse(
                    schemas.next(),
                    "El backend no debe crear el schema supabase_migrations");
            }
        }

        assertTrue(publicTables.contains("vacantes"), () -> "Tablas public: " + publicTables);
        assertFalse(publicTables.contains("schema_migrations"));

        List<String> sql = SqlCaptureInspector.STATEMENTS;
        assertFalse(sql.isEmpty(), "Hibernate debería haber ejecutado SQL contra Postgres local");
        assertTrue(
            sql.stream().map(statement -> statement.toLowerCase(Locale.ROOT))
                .anyMatch(statement -> statement.contains("vacantes")),
            () -> "SQL capturado: " + sql);
        assertFalse(
            sql.stream().map(statement -> statement.toLowerCase(Locale.ROOT))
                .anyMatch(statement -> statement.contains("supabase_migrations")),
            () -> "La app consultó supabase_migrations. SQL: " + sql);
    }
}
