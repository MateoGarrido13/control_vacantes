package com.build.vacante.service.impl;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import java.time.Instant;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;
import com.build.vacante.exception.VacanteNotFoundException;
import com.build.vacante.repository.vacanteRepository;
import com.build.vacante.service.VacanteService;

@Service
public class VacanteServiceImpl implements VacanteService {

    private final vacanteRepository vacanteRepository;

    public VacanteServiceImpl(vacanteRepository vacanteRepository) {
        this.vacanteRepository = vacanteRepository;
    }

    @Override
    public Vacante createVacante(CreateVacanteRequest request) {
        Instant now = Instant.now();
        Vacante vacante = new Vacante(
            request.puesto(),
            request.requisitos() != null ? request.requisitos() : " NO REQUISITOS",
            request.empresa(),
            request.modalidad(),
            request.fecha_vto() != null ? request.fecha_vto() : null,
            request.estado(),
            request.prioridad()
        );
        return vacanteRepository.save(vacante);
    }

    @Override
    public List<Vacante> listVacantes() {
        return vacanteRepository.findAll(Sort.by(Direction.ASC, "created"));
    }

    @Override
    public Vacante updateVacante(UUID vacanteId, UpdateVacanteRequest request) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
            .orElseThrow(() -> new VacanteNotFoundException(vacanteId));
        vacante.setPuesto(request.puesto());
        vacante.setRequisitos(request.requisitos() != null ? request.requisitos() : " NO REQUISITOS");
        vacante.setEmpresa(request.empresa());
        vacante.setModalidad(request.modalidad());
        vacante.setFecha_vto(request.fecha_vto());
        vacante.setEstado(request.estado());
        vacante.setPrioridad(request.prioridad());
        vacante.setLast_updated(Instant.now());
        return vacanteRepository.save(vacante);
    }

    @Override
    public void deleteVacante(UUID vacanteId) {
        if (!vacanteRepository.existsById(vacanteId)) {
            throw new VacanteNotFoundException(vacanteId);
        }
        vacanteRepository.deleteById(vacanteId);
    }
}
