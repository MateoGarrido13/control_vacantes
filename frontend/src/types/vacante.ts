/** Estado de seguimiento de la vacante. */
export enum EstadoVacante {
  PENDIENTE = "PENDIENTE",
  ENVIADA = "ENVIADA",
  CADUCADA = "CADUCADA",
}

/** Prioridad de la vacante según el backend. */
export enum PrioridadVacante {
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAJA = "BAJA",
}

/** Modalidades admitidas en el formulario. */
export enum ModalidadVacante {
  PRESENCIAL = "Presencial",
  HIBRIDA = "Híbrida",
  REMOTA = "Remota",
}

/** Representación de una vacante en el frontend. */
export interface Vacante {
  id: string;
  puesto: string;
  requisitos: string;
  empresa: string;
  modalidad: string;
  fecha_vto?: Date;
  estado_vacante: EstadoVacante;
  prioridad_vacante: PrioridadVacante;
}
