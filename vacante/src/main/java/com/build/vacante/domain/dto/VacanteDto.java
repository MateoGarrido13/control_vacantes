package com.build.vacante.domain.dto;
import java.util.UUID;
import com.build.vacante.domain.entity.EstadoVacante;
import com.build.vacante.domain.entity.PrioridadVacante;
import java.util.Date;
public record VacanteDto(
    UUID id,
    String puesto, 
    String requisitos, 
    String empresa, 
    String modalidad, 
    Date fecha_vto, 
    EstadoVacante estado,
    PrioridadVacante prioridad
    ) {
        
    }
