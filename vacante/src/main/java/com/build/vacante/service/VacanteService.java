package com.build.vacante.service;

import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;

public interface VacanteService{
    Vacante createVacante(CreateVacanteRequest request);
}
