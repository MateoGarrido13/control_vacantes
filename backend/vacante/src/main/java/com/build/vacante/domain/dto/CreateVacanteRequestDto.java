package com.build.vacante.domain.dto;
import jakarta.validation.constraints.NotBlank;
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
    String empresa, String modalidad,
    @Nullable
    Date fecha_vto, 
    EstadoVacante estado,
     PrioridadVacante prioridad
    ) {
    private static final String ERROR_MSG_PUESTO= "MAXIMO 255 CARACTERES";
    private static final String ERROR_MSG_REQUISITOS= "MAXIMO 2000 CARACTERES";

}
