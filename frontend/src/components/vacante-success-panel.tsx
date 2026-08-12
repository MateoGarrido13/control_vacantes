import type { FC } from "react";
import { Vacante } from "@/types/vacante";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface VacanteSuccessPanelProps {
  vacante: Vacante;
  onCreateAnother: () => void;
  onViewDashboard?: () => void;
}

const formatDate = (date?: Date) =>
  date
    ? date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Sin vencimiento";

const VacanteSuccessPanel: FC<VacanteSuccessPanelProps> = ({
  vacante,
  onCreateAnother,
  onViewDashboard,
}) => {
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(vacante.id);
      toast.success("ID copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el ID");
    }
  };

  return (
    <section className="success-panel" aria-live="polite">
      <div className="success-panel__stamp">
        <CheckCircle2 className="size-5" aria-hidden />
        Registrada
      </div>

      <h2 className="success-panel__title">Vacante creada correctamente</h2>
      <p className="success-panel__subtitle">
        Ya quedó guardada en el backend. Podés copiar el ID o registrar otra.
      </p>

      <dl className="success-panel__grid">
        <div>
          <dt>ID</dt>
          <dd className="success-panel__id">
            <code>{vacante.id}</code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyId}
              aria-label="Copiar ID de la vacante"
            >
              <Copy className="size-3.5" />
              Copiar
            </Button>
          </dd>
        </div>
        <div>
          <dt>Puesto</dt>
          <dd>{vacante.puesto}</dd>
        </div>
        <div>
          <dt>Empresa</dt>
          <dd>{vacante.empresa}</dd>
        </div>
        <div>
          <dt>Modalidad</dt>
          <dd>{vacante.modalidad}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{vacante.estado_vacante}</dd>
        </div>
        <div>
          <dt>Prioridad</dt>
          <dd>{vacante.prioridad_vacante}</dd>
        </div>
        <div>
          <dt>Vencimiento</dt>
          <dd>{formatDate(vacante.fecha_vto)}</dd>
        </div>
        {vacante.requisitos && (
          <div className="success-panel__full">
            <dt>Requisitos</dt>
            <dd>{vacante.requisitos}</dd>
          </div>
        )}
      </dl>

      <div className="success-panel__actions">
        {onViewDashboard && (
          <Button type="button" variant="outline" onClick={onViewDashboard}>
            Ver listado
          </Button>
        )}
        <Button type="button" onClick={onCreateAnother}>
          <RotateCcw className="size-4" />
          Registrar otra vacante
        </Button>
      </div>
    </section>
  );
};

export default VacanteSuccessPanel;
