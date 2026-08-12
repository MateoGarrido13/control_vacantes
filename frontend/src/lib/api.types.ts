import { Vacante, PrioridadVacante, EstadoVacante } from "@/types/vacante";

/** Standardized Error Response */
export interface ApiErrorResponseDto {
  error: string;
}

/** Response DTO from the Spring Boot API (VacanteDto). */
export interface TodoResponseDto {
  id: string;
  puesto: string;
  requisitos: string;
  empresa: string;
  modalidad: string;
  fecha_vto?: string;
  prioridad: PrioridadVacante;
  estado: EstadoVacante;
}

/**
 * Maps a TodoResponseDto to a Vacante.
 */
export const todoResponseDtoToTodo = (dto: TodoResponseDto): Vacante => {
  return {
    id: dto.id,
    puesto: dto.puesto,
    requisitos: dto.requisitos,
    empresa: dto.empresa,
    modalidad: dto.modalidad,
    fecha_vto: dto.fecha_vto ? new Date(dto.fecha_vto) : undefined,
    prioridad_vacante: dto.prioridad,
    estado_vacante: dto.estado,
  };
};

/** Request body matching CreateVacanteRequestDto on the backend. */
export interface CreateVacanteRequestDto {
  puesto: string;
  requisitos: string;
  empresa: string;
  modalidad: string;
  fecha_vto?: Date;
  prioridad: PrioridadVacante;
  estado: EstadoVacante;
}

export interface UpdateVacanteRequestDto {
  puesto: string;
  requisitos: string;
  empresa: string;
  modalidad: string;
  fecha_vto?: Date;
  prioridad: PrioridadVacante;
  estado: EstadoVacante;
}
