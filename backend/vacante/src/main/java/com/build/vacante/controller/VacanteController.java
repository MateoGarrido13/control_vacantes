package com.build.vacante.controller;

import com.build.vacante.mapper.VacanteMapper;
import com.build.vacante.service.VacanteService;
import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.dto.UpdateVacanteRequestDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.Vacante;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vacantes")
public class VacanteController {

    private final VacanteMapper vacanteMapper;
    private final VacanteService vacanteService;

    public VacanteController(VacanteMapper vacanteMapper, VacanteService vacanteService) {
        this.vacanteMapper = vacanteMapper;
        this.vacanteService = vacanteService;
    }

    @PostMapping
    public ResponseEntity<VacanteDto> createVacante(
            @RequestBody @Valid CreateVacanteRequestDto createVacanteRequestDto) {
        CreateVacanteRequest createVacanteRequest = vacanteMapper.fromDto(createVacanteRequestDto);
        Vacante vacante = vacanteService.createVacante(createVacanteRequest);
        VacanteDto vacanteDto = vacanteMapper.toDto(vacante);
        return new ResponseEntity<>(vacanteDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VacanteDto>> listVacantes() {
        List<Vacante> vacantes = vacanteService.listVacantes();
        List<VacanteDto> vacanteDtos = vacantes.stream().map(vacanteMapper::toDto).toList();
        return new ResponseEntity<>(vacanteDtos, HttpStatus.OK);
    }

    @PutMapping("/{vacanteId}")
    public ResponseEntity<VacanteDto> updateVacante(
            @PathVariable UUID vacanteId,
            @Valid @RequestBody UpdateVacanteRequestDto updateVacanteRequestDto) {
        UpdateVacanteRequest updateVacanteRequest = vacanteMapper.fromDto(updateVacanteRequestDto);
        Vacante vacante = vacanteService.updateVacante(vacanteId, updateVacanteRequest);
        VacanteDto vacanteDto = vacanteMapper.toDto(vacante);
        return ResponseEntity.ok(vacanteDto);
    }

    @DeleteMapping("/{vacanteId}")
    public ResponseEntity<Void> deleteVacante(@PathVariable UUID vacanteId) {
        vacanteService.deleteVacante(vacanteId);
        return ResponseEntity.noContent().build();
    }
}
