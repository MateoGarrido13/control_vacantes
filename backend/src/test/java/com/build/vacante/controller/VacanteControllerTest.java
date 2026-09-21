package com.build.vacante.controller;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.EstadoVacante;
import com.build.vacante.domain.entity.PrioridadVacante;
import com.build.vacante.domain.entity.Vacante;
import com.build.vacante.mapper.VacanteMapper;
import com.build.vacante.service.VacanteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(VacanteController.class)
@Import(GlobalExceptionHandler.class)
class VacanteControllerTest {

    private static final String FRONTEND_CREATE_PAYLOAD = """
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

    @MockitoBean
    private VacanteService vacanteService;

    @MockitoBean
    private VacanteMapper vacanteMapper;

    @Test
    void createVacanteReturns201AndVacanteDtoShape() throws Exception {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        Vacante saved = new Vacante(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);
        VacanteDto dto = new VacanteDto(
            id,
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);

        when(vacanteMapper.fromDto(any(CreateVacanteRequestDto.class)))
            .thenReturn(new CreateVacanteRequest(
                "Pasante Sistemas",
                "",
                "Mercado Libre",
                "Presencial",
                null,
                EstadoVacante.PENDIENTE,
                PrioridadVacante.MEDIA));
        when(vacanteService.createVacante(any(CreateVacanteRequest.class))).thenReturn(saved);
        when(vacanteMapper.toDto(any(Vacante.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/vacantes")
                .contentType(APPLICATION_JSON)
                .content(FRONTEND_CREATE_PAYLOAD))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(id.toString()))
            .andExpect(jsonPath("$.puesto").value("Pasante Sistemas"))
            .andExpect(jsonPath("$.empresa").value("Mercado Libre"))
            .andExpect(jsonPath("$.modalidad").value("Presencial"))
            .andExpect(jsonPath("$.requisitos").value(""))
            .andExpect(jsonPath("$.estado").value("PENDIENTE"))
            .andExpect(jsonPath("$.prioridad").value("MEDIA"))
            .andExpect(jsonPath("$.fecha_vto").value(nullValue()));
    }

    @Test
    void listVacantesReturns200AndDtoArray() throws Exception {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        Vacante vacante = new Vacante(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);
        VacanteDto dto = new VacanteDto(
            id,
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);

        when(vacanteService.listVacantes()).thenReturn(List.of(vacante));
        when(vacanteMapper.toDto(any(Vacante.class))).thenReturn(dto);

        mockMvc.perform(get("/api/v1/vacantes").accept(APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(id.toString()))
            .andExpect(jsonPath("$[0].puesto").value("Pasante Sistemas"))
            .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
            .andExpect(jsonPath("$[0].prioridad").value("MEDIA"))
            .andExpect(jsonPath("$[0].fecha_vto").value(nullValue()));
    }

    @Test
    void createVacanteReturns400ErrorDtoWhenPuestoIsBlank() throws Exception {
        mockMvc.perform(post("/api/v1/vacantes")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                      "puesto": "",
                      "empresa": "Mercado Libre",
                      "modalidad": "Presencial",
                      "requisitos": "",
                      "estado": "PENDIENTE",
                      "prioridad": "MEDIA"
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").exists());
    }
}
