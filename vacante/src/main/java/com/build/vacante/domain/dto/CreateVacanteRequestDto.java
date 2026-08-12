package com.build.vacante.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import com.build.vacante.domain.entity.EstadoVacante;
import com.build.vacante.domain.entity.PrioridadVacante;
import org.hibernate.validator.constraints.Length;
import org.springframework.lang.Nullable;

public record CreateVacanteRequestDto(
    @NotBlank(message = ERROR_MSG_PUESTO)
    @Length(max = 255, message = ERROR_MSG_PUESTO)
    String puesto,

    @Length(max = 2000, message = ERROR_MSG_REQUISITOS)
    @Nullable
    String requisitos,

    @NotBlank(message = ERROR_MSG_EMPRESA)
    @Length(max = 255, message = ERROR_MSG_EMPRESA)
    String empresa,

    @NotBlank(message = ERROR_MSG_MODALIDAD)
    @Length(max = 100, message = ERROR_MSG_MODALIDAD)
    String modalidad,

    @Nullable
    Date fecha_vto,

    @NotNull(message = ERROR_MSG_ESTADO)
    EstadoVacante estado,

    @NotNull(message = ERROR_MSG_PRIORIDAD)
    PrioridadVacante prioridad
) {
    private static final String ERROR_MSG_PUESTO = "El puesto es obligatorio (máximo 255 caracteres)";
    private static final String ERROR_MSG_REQUISITOS = "Los requisitos no pueden superar 2000 caracteres";
    private static final String ERROR_MSG_EMPRESA = "La empresa es obligatoria (máximo 255 caracteres)";
    private static final String ERROR_MSG_MODALIDAD = "La modalidad es obligatoria";
    private static final String ERROR_MSG_ESTADO = "El estado es obligatorio";
    private static final String ERROR_MSG_PRIORIDAD = "La prioridad es obligatoria";
}
