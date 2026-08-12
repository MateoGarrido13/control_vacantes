package com.build.vacante.mapper.impl;

import com.build.vacante.mapper.VacanteMapper;
import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.dto.UpdateVacanteRequestDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.Vacante;
import org.springframework.stereotype.Component;

@Component
public class VacanteMapperImpl implements VacanteMapper {

    @Override
    public CreateVacanteRequest fromDto(CreateVacanteRequestDto dto) {
        return new CreateVacanteRequest(
            dto.puesto(),
            dto.requisitos(),
            dto.empresa(),
            dto.modalidad(),
            dto.fecha_vto(),
            dto.estado(),
            dto.prioridad()
        );
    }

    @Override
    public UpdateVacanteRequest fromDto(UpdateVacanteRequestDto dto) {
        return new UpdateVacanteRequest(
            dto.puesto(),
            dto.requisitos(),
            dto.empresa(),
            dto.modalidad(),
            dto.fecha_vto(),
            dto.estado(),
            dto.prioridad()
        );
    }

    @Override
    public VacanteDto toDto(Vacante vacante) {
        return new VacanteDto(
            vacante.getId(),
            vacante.getPuesto(),
            vacante.getRequisitos(),
            vacante.getEmpresa(),
            vacante.getModalidad(),
            vacante.getFecha_vto(),
            vacante.getEstado(),
            vacante.getPrioridad()
        );
    }
}
