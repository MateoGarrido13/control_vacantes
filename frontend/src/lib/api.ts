import { Vacante } from "@/types/vacante";
import {
  ApiErrorResponseDto,
  CreateVacanteRequestDto,
  TodoResponseDto,
  todoResponseDtoToTodo,
  UpdateVacanteRequestDto,
} from "./api.types";

/**
 * Create a new vacante.
 *
 * @param request The request to create a new task.
 * @returns The created task.
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
    let errorMessage: string | undefined;

    try {
      const errorResponse = (await response.json()) as ApiErrorResponseDto;
      errorMessage = errorResponse.error;
    } catch {
      errorMessage = `Request failed, is the backend running?: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return todoResponseDtoToTodo((await response.json()) as TodoResponseDto);
};

/**
 * List all tasks.
 *
 * @returns The list of tasks.
 */
export const listVacantes = async (): Promise<Vacante[]> => {
  const response = await fetch("/api/v1/vacantes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    try {
      const errorResponse = (await response.json()) as ApiErrorResponseDto;
      throw new Error(errorResponse.error);
    } catch {
      // If JSON parsing fails, use status text as fallback
      throw new Error(
        `Request failed, is the backend running?: ${response.status} ${response.statusText}`,
      );
    }
  }

  const dtos = (await response.json()) as TodoResponseDto[];
  return dtos.map((dto) => todoResponseDtoToTodo(dto));
};

/**
 * Update an existing task.
 *
 * @param todoId The ID of the task to update.
 * @param request The request to update the task.
 * @returns The updated task.
 */
export const updateVacante = async (
  todoId: string,
  request: UpdateVacanteRequestDto,
): Promise<Vacante> => {
  const response = await fetch(`/api/v1/vacantes/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    try {
      const errorResponse = (await response.json()) as ApiErrorResponseDto;
      throw new Error(errorResponse.error);
    } catch {
      // If JSON parsing fails, use status text as fallback
      throw new Error(
        `Request failed, is the backend running?: ${response.status} ${response.statusText}`,
      );
    }
  }

  return todoResponseDtoToTodo((await response.json()) as TodoResponseDto);
};

/**
 * Delete an existing vacante.
 *
 * @param todoId The ID of the vacante to delete.
 */
export const deleteVacante = async (todoId: string): Promise<void> => {
  const response = await fetch(`/api/v1/vacantes/${todoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage: string | undefined;
    try {
      const errorResponse = (await response.json()) as ApiErrorResponseDto;
      errorMessage = errorResponse.error;
    } catch {
      errorMessage = `Request failed, is the backend running?: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
};
