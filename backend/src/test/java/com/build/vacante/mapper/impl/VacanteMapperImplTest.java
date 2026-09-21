package com.build.vacante.mapper.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.dto.UpdateVacanteRequestDto;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.EstadoVacante;
import com.build.vacante.domain.entity.PrioridadVacante;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;
import java.util.Date;
import org.junit.jupiter.api.Test;

class VacanteMapperImplTest {

    private final VacanteMapperImpl mapper = new VacanteMapperImpl();

    @Test
    void fromCreateDtoCopiesFieldsIncludingNullFechaVto() {
        CreateVacanteRequestDto dto = new CreateVacanteRequestDto(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);

        CreateVacanteRequest request = mapper.fromDto(dto);

        assertEquals("Pasante Sistemas", request.puesto());
        assertEquals("", request.requisitos());
        assertEquals("Mercado Libre", request.empresa());
        assertEquals("Presencial", request.modalidad());
        assertNull(request.fecha_vto());
        assertEquals(EstadoVacante.PENDIENTE, request.estado());
        assertEquals(PrioridadVacante.MEDIA, request.prioridad());
    }

    @Test
    void fromUpdateDtoCopiesFechaVto() {
        Date fechaVto = new Date(1_766_448_000_000L);
        UpdateVacanteRequestDto dto = new UpdateVacanteRequestDto(
            "Backend",
            "Java",
            "Acme",
            "Remota",
            fechaVto,
            EstadoVacante.ENVIADA,
            PrioridadVacante.ALTA);

        UpdateVacanteRequest request = mapper.fromDto(dto);

        assertEquals("Backend", request.puesto());
        assertEquals("Java", request.requisitos());
        assertEquals(fechaVto, request.fecha_vto());
        assertEquals(EstadoVacante.ENVIADA, request.estado());
        assertEquals(PrioridadVacante.ALTA, request.prioridad());
    }

    @Test
    void toDtoMapsEntityFieldsAndAllowsNullIdAndFecha() {
        Vacante vacante = new Vacante(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);

        VacanteDto dto = mapper.toDto(vacante);

        assertNull(dto.id());
        assertEquals("Pasante Sistemas", dto.puesto());
        assertEquals("", dto.requisitos());
        assertEquals("Mercado Libre", dto.empresa());
        assertEquals("Presencial", dto.modalidad());
        assertNull(dto.fecha_vto());
        assertEquals(EstadoVacante.PENDIENTE, dto.estado());
        assertEquals(PrioridadVacante.MEDIA, dto.prioridad());
    }
}
