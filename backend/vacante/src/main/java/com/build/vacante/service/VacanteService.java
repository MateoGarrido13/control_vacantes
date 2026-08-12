package com.build.vacante.service;

import java.util.List;
import java.util.UUID;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;

public interface VacanteService {
    Vacante createVacante(CreateVacanteRequest request);
    List<Vacante> listVacantes();
    Vacante updateVacante(UUID vacanteId, UpdateVacanteRequest request);
    void deleteVacante(UUID vacanteId);
}
