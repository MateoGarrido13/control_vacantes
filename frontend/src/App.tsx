import { useState } from "react";
import "./App.css";
import VacanteCreatePage from "./components/vacante-create-page";
import VacanteDashboard from "./components/vacante-dashboard";
import VacanteEditPage from "./components/vacante-edit-page";
import { Vacante } from "./types/vacante";

type AppView = "dashboard" | "create" | "edit";

function App() {
  const [view, setView] = useState<AppView>("dashboard");
  const [editingVacante, setEditingVacante] = useState<Vacante | undefined>();

  if (view === "create") {
    return (
      <VacanteCreatePage onBackToDashboard={() => setView("dashboard")} />
    );
  }

  if (view === "edit" && editingVacante) {
    return (
      <VacanteEditPage
        vacante={editingVacante}
        onBackToDashboard={() => {
          setEditingVacante(undefined);
          setView("dashboard");
        }}
        onUpdated={() => {
          setEditingVacante(undefined);
          setView("dashboard");
        }}
      />
    );
  }

  return (
    <VacanteDashboard
      onCreateNew={() => setView("create")}
      onEditVacante={(vacante) => {
        setEditingVacante(vacante);
        setView("edit");
      }}
    />
  );
}

export default App;
