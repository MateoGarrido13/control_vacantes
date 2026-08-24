import { FormEvent, useMemo, useState } from "react";
import { AlertCircleIcon, ChevronDownIcon, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateVacante } from "@/lib/api";
import { UpdateVacanteRequestDto } from "@/lib/api.types";
import {
  EstadoVacante,
  ModalidadVacante,
  PrioridadVacante,
  Vacante,
} from "@/types/vacante";
import BottomBanner from "./bottom-banner";

const MAX_PUESTO = 255;
const MAX_EMPRESA = 255;
const MAX_REQUISITOS = 2000;

interface VacanteEditPageProps {
  vacante: Vacante;
  onBackToDashboard: () => void;
  onUpdated: () => void;
}

function VacanteEditPage({
  vacante,
  onBackToDashboard,
  onUpdated,
}: VacanteEditPageProps) {
  const [puesto, setPuesto] = useState(vacante.puesto);
  const [empresa, setEmpresa] = useState(vacante.empresa);
  const [requisitos, setRequisitos] = useState(vacante.requisitos ?? "");
  const [modalidad, setModalidad] = useState(vacante.modalidad);
  const [fechaVto, setFechaVto] = useState<Date | undefined>(vacante.fecha_vto);
  const [fechaOpen, setFechaOpen] = useState(false);
  const [estado, setEstado] = useState<EstadoVacante>(vacante.estado_vacante);
  const [prioridad, setPrioridad] = useState<PrioridadVacante>(
    vacante.prioridad_vacante,
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const requisitosCount = requisitos.length;

  const isValid = useMemo(() => {
    return (
      puesto.trim().length > 0 &&
      puesto.trim().length <= MAX_PUESTO &&
      empresa.trim().length > 0 &&
      empresa.trim().length <= MAX_EMPRESA &&
      requisitos.length <= MAX_REQUISITOS &&
      modalidad.trim().length > 0
    );
  }, [puesto, empresa, requisitos, modalidad]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!puesto.trim()) {
      nextErrors.puesto = "El puesto es obligatorio";
    } else if (puesto.trim().length > MAX_PUESTO) {
      nextErrors.puesto = `Máximo ${MAX_PUESTO} caracteres`;
    }

    if (!empresa.trim()) {
      nextErrors.empresa = "La empresa es obligatoria";
    } else if (empresa.trim().length > MAX_EMPRESA) {
      nextErrors.empresa = `Máximo ${MAX_EMPRESA} caracteres`;
    }

    if (!modalidad.trim()) {
      nextErrors.modalidad = "La modalidad es obligatoria";
    }

    if (requisitos.length > MAX_REQUISITOS) {
      nextErrors.requisitos = `Máximo ${MAX_REQUISITOS} caracteres`;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(undefined);

    if (!validate() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const payload: UpdateVacanteRequestDto = {
        puesto: puesto.trim(),
        empresa: empresa.trim(),
        modalidad,
        requisitos: requisitos.trim(),
        fecha_vto: fechaVto,
        estado,
        prioridad,
      };

      await updateVacante(vacante.id, payload);
      toast.success("Vacante actualizada");
      onUpdated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la vacante. ¿Está el backend en ejecución?";
      setErrorMessage(message);
      toast.error("Error al modificar la vacante");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <Button
          type="button"
          variant="ghost"
          className="mb-3 -ml-2"
          onClick={onBackToDashboard}
        >
          <ArrowLeft className="size-4" />
          Volver al listado
        </Button>
        <p className="page-eyebrow">Control de vacantes</p>
        <h1 className="page-title">Modificar vacante</h1>
        <p className="page-lede">
          Editá los datos y guardá los cambios con un{" "}
          <code>PUT /api/v1/vacantes/{`{id}`}</code>.
        </p>
        <code className="dashboard-id">{vacante.id}</code>
      </header>

      <form className="create-form" onSubmit={handleSubmit} noValidate>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon />
            <AlertTitle>No se pudo actualizar</AlertTitle>
            <AlertDescription>
              <p>{errorMessage}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="form-grid">
          <div className="field">
            <Label htmlFor="edit-puesto">Puesto *</Label>
            <Input
              id="edit-puesto"
              name="puesto"
              value={puesto}
              maxLength={MAX_PUESTO}
              aria-invalid={!!fieldErrors.puesto}
              onChange={(e) => setPuesto(e.target.value)}
              data-testid="input-edit-puesto"
            />
            {fieldErrors.puesto && (
              <p className="field-error" role="alert">
                {fieldErrors.puesto}
              </p>
            )}
          </div>

          <div className="field">
            <Label htmlFor="edit-empresa">Empresa *</Label>
            <Input
              id="edit-empresa"
              name="empresa"
              value={empresa}
              maxLength={MAX_EMPRESA}
              aria-invalid={!!fieldErrors.empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              data-testid="input-edit-empresa"
            />
            {fieldErrors.empresa && (
              <p className="field-error" role="alert">
                {fieldErrors.empresa}
              </p>
            )}
          </div>

          <div className="field field--full">
            <div className="field-label-row">
              <Label htmlFor="edit-requisitos">Requisitos</Label>
              <span
                className={`char-count ${requisitosCount > MAX_REQUISITOS ? "char-count--over" : ""}`}
              >
                {requisitosCount}/{MAX_REQUISITOS}
              </span>
            </div>
            <Textarea
              id="edit-requisitos"
              name="requisitos"
              value={requisitos}
              maxLength={MAX_REQUISITOS}
              rows={5}
              onChange={(e) => setRequisitos(e.target.value)}
              data-testid="input-edit-requisitos"
            />
            {fieldErrors.requisitos && (
              <p className="field-error" role="alert">
                {fieldErrors.requisitos}
              </p>
            )}
          </div>

          <div className="field">
            <Label htmlFor="edit-modalidad">Modalidad *</Label>
            <Select value={modalidad} onValueChange={setModalidad}>
              <SelectTrigger id="edit-modalidad" data-testid="select-edit-modalidad">
                <SelectValue placeholder="Elegí modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ModalidadVacante.PRESENCIAL}>
                    Presencial
                  </SelectItem>
                  <SelectItem value={ModalidadVacante.HIBRIDA}>Híbrida</SelectItem>
                  <SelectItem value={ModalidadVacante.REMOTA}>Remota</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldErrors.modalidad && (
              <p className="field-error" role="alert">
                {fieldErrors.modalidad}
              </p>
            )}
          </div>

          <div className="field">
            <Label htmlFor="edit-fecha_vto">Fecha de vencimiento</Label>
            <Popover open={fechaOpen} onOpenChange={setFechaOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  id="edit-fecha_vto"
                  className="w-full justify-between font-normal"
                >
                  {fechaVto ? fechaVto.toLocaleDateString("es-AR") : "Sin fecha"}
                  <ChevronDownIcon className="size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaVto}
                  captionLayout="dropdown"
                  startMonth={new Date(new Date().getFullYear() - 1, 0)}
                  endMonth={new Date(new Date().getFullYear() + 10, 11)}
                  onSelect={(date) => {
                    setFechaVto(date);
                    setFechaOpen(false);
                  }}
                />
                {fechaVto && (
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setFechaVto(undefined);
                        setFechaOpen(false);
                      }}
                    >
                      Quitar fecha
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="field">
            <Label htmlFor="edit-estado">Estado</Label>
            <Select
              value={estado}
              onValueChange={(value) => setEstado(value as EstadoVacante)}
            >
              <SelectTrigger id="edit-estado" data-testid="select-edit-estado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={EstadoVacante.PENDIENTE}>Pendiente</SelectItem>
                  <SelectItem value={EstadoVacante.ENVIADA}>Enviada</SelectItem>
                  <SelectItem value={EstadoVacante.CADUCADA}>Caducada</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="field">
            <Label htmlFor="edit-prioridad">Prioridad</Label>
            <Select
              value={prioridad}
              onValueChange={(value) => setPrioridad(value as PrioridadVacante)}
            >
              <SelectTrigger id="edit-prioridad" data-testid="select-edit-prioridad">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={PrioridadVacante.ALTA}>Alta</SelectItem>
                  <SelectItem value={PrioridadVacante.MEDIA}>Media</SelectItem>
                  <SelectItem value={PrioridadVacante.BAJA}>Baja</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onBackToDashboard}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!isValid || submitting}
            data-testid="button-update-vacante"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </form>

      <BottomBanner />
    </div>
  );
}

export default VacanteEditPage;
