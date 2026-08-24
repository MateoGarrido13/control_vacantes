import { useCallback, useEffect, useState } from "react";
import {
  AlertCircleIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteVacante, listVacantes } from "@/lib/api";
import { Vacante } from "@/types/vacante";
import BottomBanner from "./bottom-banner";
import ThemeToggle from "./theme-toggle";

interface VacanteDashboardProps {
  onCreateNew: () => void;
  onEditVacante: (vacante: Vacante) => void;
}

const formatDate = (date?: Date) =>
  date
    ? date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Sin vencimiento";

function VacanteDashboard({ onCreateNew, onEditVacante }: VacanteDashboardProps) {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [vacanteToDelete, setVacanteToDelete] = useState<Vacante | undefined>();
  const [deleting, setDeleting] = useState(false);

  const loadVacantes = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const data = await listVacantes();
      setVacantes(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las vacantes.";
      setErrorMessage(message);
      toast.error("Error al cargar el listado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVacantes();
  }, [loadVacantes]);

  const handleConfirmDelete = async () => {
    if (!vacanteToDelete || deleting) {
      return;
    }

    setDeleting(true);
    try {
      await deleteVacante(vacanteToDelete.id);
      toast.success("Vacante eliminada");
      setVacanteToDelete(undefined);
      await loadVacantes();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la vacante.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-header page-header--row">
        <div>
          <p className="page-eyebrow">Control de vacantes</p>
          <h1 className="page-title">Mesa de seguimiento</h1>
          <p className="page-lede">
            Listado de vacantes registradas en el backend. Se actualiza con un
            GET a <code>/api/v1/vacantes</code>.
          </p>
        </div>
        <div className="dashboard-actions">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadVacantes()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Actualizar
          </Button>
          <Button type="button" onClick={onCreateNew}>
            <Plus className="size-4" />
            Nueva vacante
          </Button>
        </div>
      </header>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon />
          <AlertTitle>No se pudo cargar el dashboard</AlertTitle>
          <AlertDescription>
            <p>{errorMessage}</p>
          </AlertDescription>
        </Alert>
      )}

      <section className="dashboard-panel" aria-busy={loading}>
        {loading && vacantes.length === 0 ? (
          <p className="dashboard-empty">
            <Loader2 className="size-4 animate-spin" />
            Cargando vacantes…
          </p>
        ) : vacantes.length === 0 ? (
          <p className="dashboard-empty">
            Todavía no hay vacantes. Registrá la primera para verla acá.
          </p>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Puesto</th>
                  <th>Empresa</th>
                  <th>Modalidad</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vacantes.map((vacante) => (
                  <tr key={vacante.id}>
                    <td>
                      <div className="dashboard-puesto">{vacante.puesto}</div>
                      <code className="dashboard-id">{vacante.id}</code>
                    </td>
                    <td>{vacante.empresa}</td>
                    <td>{vacante.modalidad}</td>
                    <td>
                      <span className="preview-card__chip preview-card__chip--status">
                        {vacante.estado_vacante}
                      </span>
                    </td>
                    <td>
                      <span className="preview-card__chip preview-card__chip--priority">
                        {vacante.prioridad_vacante}
                      </span>
                    </td>
                    <td>{formatDate(vacante.fecha_vto)}</td>
                    <td>
                      <div className="dashboard-row-actions">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEditVacante(vacante)}
                          data-testid={`button-edit-${vacante.id}`}
                        >
                          <Pencil className="size-3.5" />
                          Modificar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVacanteToDelete(vacante)}
                          data-testid={`button-delete-${vacante.id}`}
                        >
                          <Trash2 className="size-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog
        open={!!vacanteToDelete}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setVacanteToDelete(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar vacante</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar{" "}
              <strong>{vacanteToDelete?.puesto}</strong> de{" "}
              <strong>{vacanteToDelete?.empresa}</strong>? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setVacanteToDelete(undefined)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
              disabled={deleting}
              data-testid="button-confirm-delete"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Eliminando…
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomBanner />
    </div>
  );
}

export default VacanteDashboard;
