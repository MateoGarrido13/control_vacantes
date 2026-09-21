import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EstadoVacante, PrioridadVacante, Vacante } from "@/types/vacante";
import { ThemeProvider } from "@/providers/theme-provider";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  listVacantes: vi.fn(),
  deleteVacante: vi.fn(),
}));

import { listVacantes } from "@/lib/api";
import VacanteDashboard from "./vacante-dashboard";

const listVacantesMock = vi.mocked(listVacantes);

const sampleVacante: Vacante = {
  id: "093053d7-b92f-457f-b835-9bcf7ccf749e",
  puesto: "Pasante Sistemas",
  requisitos: "",
  empresa: "Mercado Libre",
  modalidad: "Presencial",
  estado_vacante: EstadoVacante.PENDIENTE,
  prioridad_vacante: PrioridadVacante.MEDIA,
};

function renderDashboard() {
  return render(
    <ThemeProvider>
      <VacanteDashboard onCreateNew={vi.fn()} onEditVacante={vi.fn()} />
    </ThemeProvider>,
  );
}

describe("VacanteDashboard", () => {
  beforeEach(() => {
    listVacantesMock.mockReset();
  });

  it("loads vacantes on mount and renders the table", async () => {
    listVacantesMock.mockResolvedValue([sampleVacante]);

    renderDashboard();

    expect(listVacantesMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Pasante Sistemas")).toBeInTheDocument();
    expect(screen.getByText("Mercado Libre")).toBeInTheDocument();
    expect(screen.getByText("PENDIENTE")).toBeInTheDocument();
    expect(screen.getByText("MEDIA")).toBeInTheDocument();
  });

  it("shows the empty state when the API returns no vacantes", async () => {
    listVacantesMock.mockResolvedValue([]);

    renderDashboard();

    expect(
      await screen.findByText(
        "Todavía no hay vacantes. Registrá la primera para verla acá.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the API error when the list cannot be loaded", async () => {
    listVacantesMock.mockRejectedValue(
      new Error("Request failed, is the backend running?: 504 Gateway Timeout"),
    );

    renderDashboard();

    expect(
      await screen.findByText("No se pudo cargar el dashboard"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Request failed, is the backend running?: 504 Gateway Timeout",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Cargando vacantes…")).not.toBeInTheDocument();
    });
  });
});
