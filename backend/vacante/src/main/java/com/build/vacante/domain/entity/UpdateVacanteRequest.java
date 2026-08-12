package com.build.vacante.domain.entity;

import java.util.Date;

public record UpdateVacanteRequest(
    String puesto,
    String requisitos,
    String empresa,
    String modalidad,
    Date fecha_vto,
    EstadoVacante estado,
    PrioridadVacante prioridad
) {
}
