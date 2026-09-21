import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EstadoVacante, PrioridadVacante } from "@/types/vacante";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  createVacante: vi.fn(),
}));

import { createVacante } from "@/lib/api";
import VacanteCreatePage from "./vacante-create-page";

const createVacanteMock = vi.mocked(createVacante);

describe("VacanteCreatePage", () => {
  beforeEach(() => {
    createVacanteMock.mockReset();
  });

  it("submits the form payload and shows the success panel", async () => {
    const user = userEvent.setup();
    createVacanteMock.mockResolvedValue({
      id: "093053d7-b92f-457f-b835-9bcf7ccf749e",
      puesto: "Pasante Sistemas",
      requisitos: "",
      empresa: "Mercado Libre",
      modalidad: "Presencial",
      estado_vacante: EstadoVacante.PENDIENTE,
      prioridad_vacante: PrioridadVacante.MEDIA,
    });

    render(<VacanteCreatePage />);

    await user.type(screen.getByTestId("input-vacante-puesto"), "Pasante Sistemas");
    await user.type(screen.getByTestId("input-vacante-empresa"), "Mercado Libre");
    await user.click(screen.getByTestId("button-create-vacante"));

    await waitFor(() => {
      expect(createVacanteMock).toHaveBeenCalledWith({
        puesto: "Pasante Sistemas",
        empresa: "Mercado Libre",
        modalidad: "Presencial",
        requisitos: "",
        fecha_vto: undefined,
        estado: EstadoVacante.PENDIENTE,
        prioridad: PrioridadVacante.MEDIA,
      });
    });

    expect(
      await screen.findByText("Vacante creada correctamente"),
    ).toBeInTheDocument();
  });

  it("shows the API error when registration fails", async () => {
    const user = userEvent.setup();
    createVacanteMock.mockRejectedValue(
      new Error("Request failed, is the backend running?: 504 Gateway Timeout"),
    );

    render(<VacanteCreatePage />);

    await user.type(screen.getByTestId("input-vacante-puesto"), "Pasante Sistemas");
    await user.type(screen.getByTestId("input-vacante-empresa"), "Mercado Libre");
    await user.click(screen.getByTestId("button-create-vacante"));

    expect(await screen.findByText("No se pudo registrar")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Request failed, is the backend running?: 504 Gateway Timeout",
      ),
    ).toBeInTheDocument();
  });
});
