package com.build.vacante.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.build.vacante.domain.entity.Vacante;

@Repository
public interface vacanteRepository extends JpaRepository<Vacante, UUID> {

}
