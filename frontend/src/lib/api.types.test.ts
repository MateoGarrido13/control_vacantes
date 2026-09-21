import { describe, expect, it } from "vitest";
import { vacanteResponseDtoToVacante, VacanteResponseDto } from "./api.types";
import { EstadoVacante, PrioridadVacante } from "@/types/vacante";

const baseDto: VacanteResponseDto = {
  id: "093053d7-b92f-457f-b835-9bcf7ccf749e",
  puesto: "Pasante Sistemas",
  requisitos: "Experiencia, stack, idiomas",
  empresa: "Mercado Libre",
  modalidad: "Presencial",
  estado: EstadoVacante.PENDIENTE,
  prioridad: PrioridadVacante.MEDIA,
};

describe("vacanteResponseDtoToVacante", () => {
  it("maps DTO prioridad/estado to UI prioridad_vacante/estado_vacante", () => {
    const vacante = vacanteResponseDtoToVacante(baseDto);

    expect(vacante).toEqual({
      id: baseDto.id,
      puesto: baseDto.puesto,
      requisitos: baseDto.requisitos,
      empresa: baseDto.empresa,
      modalidad: baseDto.modalidad,
      fecha_vto: undefined,
      prioridad_vacante: PrioridadVacante.MEDIA,
      estado_vacante: EstadoVacante.PENDIENTE,
    });
  });

  it("parses fecha_vto from an ISO string", () => {
    const vacante = vacanteResponseDtoToVacante({
      ...baseDto,
      fecha_vto: "2026-12-01T00:00:00.000Z",
    });

    expect(vacante.fecha_vto).toEqual(new Date("2026-12-01T00:00:00.000Z"));
  });

  it("parses fecha_vto from a numeric timestamp", () => {
    const epoch = Date.parse("2026-12-01T00:00:00.000Z");
    const vacante = vacanteResponseDtoToVacante({
      ...baseDto,
      fecha_vto: epoch as unknown as string,
    });

    expect(vacante.fecha_vto).toEqual(new Date(epoch));
  });

  it("leaves fecha_vto undefined for null or missing values", () => {
    expect(
      vacanteResponseDtoToVacante({
        ...baseDto,
        fecha_vto: undefined,
      }).fecha_vto,
    ).toBeUndefined();

    expect(
      vacanteResponseDtoToVacante({
        ...baseDto,
        fecha_vto: null as unknown as string,
      }).fecha_vto,
    ).toBeUndefined();
  });

  it("ignores extra backend fields such as created and last_updated", () => {
    const vacante = vacanteResponseDtoToVacante({
      ...baseDto,
      created: "2026-09-20T00:00:00.000Z",
      last_updated: "2026-09-20T00:00:00.000Z",
    } as VacanteResponseDto);

    expect(vacante).not.toHaveProperty("created");
    expect(vacante).not.toHaveProperty("last_updated");
    expect(vacante.puesto).toBe(baseDto.puesto);
  });
});
