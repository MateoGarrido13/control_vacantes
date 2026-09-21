import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createVacante,
  deleteVacante,
  listVacantes,
  updateVacante,
} from "./api";
import {
  CreateVacanteRequestDto,
  VacanteResponseDto,
} from "./api.types";
import { EstadoVacante, PrioridadVacante } from "@/types/vacante";

const sampleDto: VacanteResponseDto = {
  id: "093053d7-b92f-457f-b835-9bcf7ccf749e",
  puesto: "Pasante Sistemas",
  requisitos: "",
  empresa: "Mercado Libre",
  modalidad: "Presencial",
  fecha_vto: undefined,
  estado: EstadoVacante.PENDIENTE,
  prioridad: PrioridadVacante.MEDIA,
};

const createPayload: CreateVacanteRequestDto = {
  puesto: "Pasante Sistemas",
  empresa: "Mercado Libre",
  modalidad: "Presencial",
  requisitos: "",
  estado: EstadoVacante.PENDIENTE,
  prioridad: PrioridadVacante.MEDIA,
};

function jsonResponse(
  body: unknown,
  init?: { status?: number; statusText?: string },
) {
  const status = init?.status ?? 200;
  return new Response(JSON.stringify(body), {
    status,
    statusText: init?.statusText ?? "",
    headers: { "Content-Type": "application/json" },
  });
}

function htmlResponse(status: number, statusText: string) {
  return new Response("<html>gateway timeout</html>", {
    status,
    statusText,
    headers: { "Content-Type": "text/html" },
  });
}

describe("api client", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("createVacante", () => {
    it("POSTs JSON to /api/v1/vacantes and maps the created vacante", async () => {
      fetchMock.mockResolvedValue(jsonResponse(sampleDto, { status: 201 }));

      const created = await createVacante(createPayload);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("/api/v1/vacantes");
      expect(init.method).toBe("POST");
      expect(init.headers).toEqual({ "Content-Type": "application/json" });
      expect(JSON.parse(String(init.body))).toEqual(createPayload);
      expect(created).toMatchObject({
        id: sampleDto.id,
        puesto: sampleDto.puesto,
        empresa: sampleDto.empresa,
        prioridad_vacante: PrioridadVacante.MEDIA,
        estado_vacante: EstadoVacante.PENDIENTE,
      });
    });

    it("serializes fecha_vto as an ISO string", async () => {
      const fecha_vto = new Date("2026-12-01T00:00:00.000Z");
      fetchMock.mockResolvedValue(jsonResponse(sampleDto, { status: 201 }));

      await createVacante({ ...createPayload, fecha_vto });

      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(String(init.body)).fecha_vto).toBe(
        fecha_vto.toISOString(),
      );
    });

    it("uses ErrorDto.error when the body is JSON", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { error: "MAXIMO 255 CARACTERES" },
          { status: 400, statusText: "Bad Request" },
        ),
      );

      await expect(createVacante(createPayload)).rejects.toThrow(
        "MAXIMO 255 CARACTERES",
      );
    });

    it("falls back when a 504 body is not JSON", async () => {
      fetchMock.mockResolvedValue(htmlResponse(504, "Gateway Timeout"));

      await expect(createVacante(createPayload)).rejects.toThrow(
        "Request failed, is the backend running?: 504 Gateway Timeout",
      );
    });
  });

  describe("listVacantes", () => {
    it("GETs /api/v1/vacantes and maps the array", async () => {
      fetchMock.mockResolvedValue(jsonResponse([sampleDto]));

      const listed = await listVacantes();

      expect(fetchMock).toHaveBeenCalledWith(
        "/api/v1/vacantes",
        expect.objectContaining({ method: "GET" }),
      );
      expect(listed).toHaveLength(1);
      expect(listed[0].prioridad_vacante).toBe(PrioridadVacante.MEDIA);
      expect(listed[0].estado_vacante).toBe(EstadoVacante.PENDIENTE);
    });

    it("uses ErrorDto.error instead of swallowing it in catch", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { error: "No se pudieron listar las vacantes" },
          { status: 500, statusText: "Internal Server Error" },
        ),
      );

      await expect(listVacantes()).rejects.toThrow(
        "No se pudieron listar las vacantes",
      );
    });

    it("falls back when a 504 body is not JSON", async () => {
      fetchMock.mockResolvedValue(htmlResponse(504, "Gateway Timeout"));

      await expect(listVacantes()).rejects.toThrow(
        "Request failed, is the backend running?: 504 Gateway Timeout",
      );
    });
  });

  describe("updateVacante", () => {
    it("uses ErrorDto.error on a JSON error body", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { error: "Vacante with id missing not found" },
          { status: 404, statusText: "Not Found" },
        ),
      );

      await expect(
        updateVacante(sampleDto.id, createPayload),
      ).rejects.toThrow("Vacante with id missing not found");
    });
  });

  describe("deleteVacante", () => {
    it("DELETEs the vacante id and resolves on 204", async () => {
      fetchMock.mockResolvedValue(
        new Response(null, { status: 204, statusText: "No Content" }),
      );

      await expect(deleteVacante(sampleDto.id)).resolves.toBeUndefined();
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/v1/vacantes/${sampleDto.id}`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });
});
