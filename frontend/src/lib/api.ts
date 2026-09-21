import { Vacante } from "@/types/vacante";
import {
  ApiErrorResponseDto,
  CreateVacanteRequestDto,
  VacanteResponseDto,
  vacanteResponseDtoToVacante,
  UpdateVacanteRequestDto,
} from "./api.types";

const backendUnreachableMessage = (response: Response) =>
  `Request failed, is the backend running?: ${response.status} ${response.statusText}`;

const readApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorResponse = (await response.json()) as ApiErrorResponseDto;
    if (typeof errorResponse?.error === "string" && errorResponse.error) {
      return errorResponse.error;
    }
  } catch {
    // Proxy/gateway bodies are often HTML or empty, not ErrorDto JSON.
  }
  return backendUnreachableMessage(response);
};

/**
 * Create a new vacante.
 *
 * @param request The request to create a new vacante.
 * @returns The created vacante.
 */
export const createVacante = async (
  request: CreateVacanteRequestDto,
): Promise<Vacante> => {
  const response = await fetch("/api/v1/vacantes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  return vacanteResponseDtoToVacante(
    (await response.json()) as VacanteResponseDto,
  );
};

/**
 * List all vacantes.
 *
 * @returns The list of vacantes.
 */
export const listVacantes = async (): Promise<Vacante[]> => {
  const response = await fetch("/api/v1/vacantes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  const dtos = (await response.json()) as VacanteResponseDto[];
  return dtos.map((dto) => vacanteResponseDtoToVacante(dto));
};

/**
 * Update an existing vacante.
 *
 * @param vacanteId The ID of the vacante to update.
 * @param request The request to update the vacante.
 * @returns The updated vacante.
 */
export const updateVacante = async (
  vacanteId: string,
  request: UpdateVacanteRequestDto,
): Promise<Vacante> => {
  const response = await fetch(`/api/v1/vacantes/${vacanteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  return vacanteResponseDtoToVacante(
    (await response.json()) as VacanteResponseDto,
  );
};

/**
 * Delete an existing vacante.
 *
 * @param vacanteId The ID of the vacante to delete.
 */
export const deleteVacante = async (vacanteId: string): Promise<void> => {
  const response = await fetch(`/api/v1/vacantes/${vacanteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }
};
