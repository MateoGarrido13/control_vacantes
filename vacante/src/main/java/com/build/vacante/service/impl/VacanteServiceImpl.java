package com.build.vacante.service.impl;

import org.springframework.stereotype.Service;
import java.time.Instant;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;
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
    
}
