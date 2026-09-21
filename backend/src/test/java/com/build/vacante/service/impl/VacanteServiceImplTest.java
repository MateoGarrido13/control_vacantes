package com.build.vacante.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.build.vacante.domain.entity.CreateVacanteRequest;
import com.build.vacante.domain.entity.EstadoVacante;
import com.build.vacante.domain.entity.PrioridadVacante;
import com.build.vacante.domain.entity.UpdateVacanteRequest;
import com.build.vacante.domain.entity.Vacante;
import com.build.vacante.exception.VacanteNotFoundException;
import com.build.vacante.repository.vacanteRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

@ExtendWith(MockitoExtension.class)
class VacanteServiceImplTest {

    @Mock
    private vacanteRepository vacanteRepository;

    @InjectMocks
    private VacanteServiceImpl vacanteService;

    @Test
    void createVacanteUsesDefaultRequisitosWhenNullAndSaves() {
        CreateVacanteRequest request = new CreateVacanteRequest(
            "Pasante Sistemas",
            null,
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);
        when(vacanteRepository.save(any(Vacante.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        Vacante saved = vacanteService.createVacante(request);

        ArgumentCaptor<Vacante> captor = ArgumentCaptor.forClass(Vacante.class);
        verify(vacanteRepository).save(captor.capture());
        assertEquals(" NO REQUISITOS", captor.getValue().getRequisitos());
        assertEquals("Pasante Sistemas", saved.getPuesto());
        assertEquals("Mercado Libre", saved.getEmpresa());
    }

    @Test
    void listVacantesDelegatesToRepositorySortedByCreatedAsc() {
        Vacante vacante = new Vacante(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);
        Sort expectedSort = Sort.by(Direction.ASC, "created");
        when(vacanteRepository.findAll(expectedSort)).thenReturn(List.of(vacante));

        List<Vacante> result = vacanteService.listVacantes();

        assertEquals(1, result.size());
        assertEquals("Pasante Sistemas", result.get(0).getPuesto());
        verify(vacanteRepository).findAll(expectedSort);
    }

    @Test
    void updateVacanteThrowsWhenMissing() {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        when(vacanteRepository.findById(id)).thenReturn(Optional.empty());

        UpdateVacanteRequest request = new UpdateVacanteRequest(
            "Backend",
            "Java",
            "Acme",
            "Remota",
            null,
            EstadoVacante.ENVIADA,
            PrioridadVacante.ALTA);

        assertThrows(VacanteNotFoundException.class, () -> vacanteService.updateVacante(id, request));
    }

    @Test
    void updateVacanteAppliesFieldsAndSaves() {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        Vacante existing = new Vacante(
            "Pasante Sistemas",
            "",
            "Mercado Libre",
            "Presencial",
            null,
            EstadoVacante.PENDIENTE,
            PrioridadVacante.MEDIA);
        when(vacanteRepository.findById(id)).thenReturn(Optional.of(existing));
        when(vacanteRepository.save(existing)).thenReturn(existing);

        UpdateVacanteRequest request = new UpdateVacanteRequest(
            "Backend",
            null,
            "Acme",
            "Remota",
            null,
            EstadoVacante.ENVIADA,
            PrioridadVacante.ALTA);

        Vacante updated = vacanteService.updateVacante(id, request);

        assertEquals("Backend", updated.getPuesto());
        assertEquals(" NO REQUISITOS", updated.getRequisitos());
        assertEquals("Acme", updated.getEmpresa());
        assertEquals("Remota", updated.getModalidad());
        assertEquals(EstadoVacante.ENVIADA, updated.getEstado());
        assertEquals(PrioridadVacante.ALTA, updated.getPrioridad());
        verify(vacanteRepository).save(existing);
    }

    @Test
    void deleteVacanteThrowsWhenMissing() {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        when(vacanteRepository.existsById(id)).thenReturn(false);

        assertThrows(VacanteNotFoundException.class, () -> vacanteService.deleteVacante(id));
    }

    @Test
    void deleteVacanteRemovesWhenPresent() {
        UUID id = UUID.fromString("093053d7-b92f-457f-b835-9bcf7ccf749e");
        when(vacanteRepository.existsById(id)).thenReturn(true);

        vacanteService.deleteVacante(id);

        verify(vacanteRepository).deleteById(id);
    }
}
