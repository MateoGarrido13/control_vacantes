package com.build.vacante.mapper;

import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.dto.UpdateVacanteRequestDto;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;

public interface VacanteMapper {
    CreateVacanteRequest fromDto(CreateVacanteRequestDto dto);
    UpdateVacanteRequest fromDto(UpdateVacanteRequestDto dto);
    VacanteDto toDto(Vacante vacante);
}
