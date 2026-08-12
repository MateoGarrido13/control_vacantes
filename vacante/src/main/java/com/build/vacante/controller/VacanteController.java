package com.build.vacante.controller;
import com.build.vacante.mapper.VacanteMapper;
import com.build.vacante.service.VacanteService;
import com.build.vacante.domain.dto.CreateVacanteRequestDto;
import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.dto.VacanteDto;
import com.build.vacante.domain.entity.Vacante;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VacanteController {
 
    private final VacanteMapper vacanteMapper;
    private final VacanteService vacanteService;

    public VacanteController(VacanteMapper vacanteMapper, VacanteService vacanteService) {
        this.vacanteMapper = vacanteMapper;
        this.vacanteService = vacanteService;
    }

    @PostMapping("/api/v1/vacantes")
    public ResponseEntity<VacanteDto> createVacante(@RequestBody @Valid CreateVacanteRequestDto createVacanteRequestDto) {
        CreateVacanteRequest createVacanteRequest = vacanteMapper.fromDto(createVacanteRequestDto);
        Vacante vacante = vacanteService.createVacante(createVacanteRequest);
        VacanteDto vacanteDto = vacanteMapper.toDto(vacante);
        return new ResponseEntity<>(vacanteDto, HttpStatus.CREATED);
    }
}
