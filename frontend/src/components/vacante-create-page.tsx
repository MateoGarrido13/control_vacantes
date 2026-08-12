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
import { createVacante } from "@/lib/api";
import { CreateVacanteRequestDto } from "@/lib/api.types";
import {
  EstadoVacante,
  ModalidadVacante,
  PrioridadVacante,
  Vacante,
} from "@/types/vacante";
import VacantePreviewCard from "@/components/vacante-preview-card";
import VacanteSuccessPanel from "./vacante-success-panel";
import BottomBanner from "./bottom-banner";

const MAX_PUESTO = 255;
const MAX_EMPRESA = 255;
const MAX_REQUISITOS = 2000;

interface VacanteCreatePageProps {
  onBackToDashboard?: () => void;
}

function VacanteCreatePage({ onBackToDashboard }: VacanteCreatePageProps) {
  const [puesto, setPuesto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [modalidad, setModalidad] = useState<string>(ModalidadVacante.PRESENCIAL);
  const [fechaVto, setFechaVto] = useState<Date | undefined>(undefined);
  const [fechaOpen, setFechaOpen] = useState(false);
  const [estado, setEstado] = useState<EstadoVacante>(EstadoVacante.PENDIENTE);
  const [prioridad, setPrioridad] = useState<PrioridadVacante>(
    PrioridadVacante.MEDIA,
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [createdVacante, setCreatedVacante] = useState<Vacante | undefined>();
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

  const resetForm = () => {
    setPuesto("");
    setEmpresa("");
    setRequisitos("");
    setModalidad(ModalidadVacante.PRESENCIAL);
    setFechaVto(undefined);
    setFechaOpen(false);
    setEstado(EstadoVacante.PENDIENTE);
    setPrioridad(PrioridadVacante.MEDIA);
    setErrorMessage(undefined);
    setFieldErrors({});
    setCreatedVacante(undefined);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(undefined);

    if (!validate() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateVacanteRequestDto = {
        puesto: puesto.trim(),
        empresa: empresa.trim(),
        modalidad,
        requisitos: requisitos.trim(),
        fecha_vto: fechaVto,
        estado,
        prioridad,
      };

      const created = await createVacante(payload);
      setCreatedVacante(created);
      toast.success("Vacante registrada");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo crear la vacante. ¿Está el backend en ejecución?";
      setErrorMessage(message);
      toast.error("Error al registrar la vacante");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdVacante) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <p className="page-eyebrow">Control de vacantes</p>
          <h1 className="page-title">Mesa de seguimiento</h1>
        </header>
        <VacanteSuccessPanel
          vacante={createdVacante}
          onCreateAnother={resetForm}
          onViewDashboard={onBackToDashboard}
        />
        <BottomBanner />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        {onBackToDashboard && (
          <Button
            type="button"
            variant="ghost"
            className="mb-3 -ml-2"
            onClick={onBackToDashboard}
          >
            <ArrowLeft className="size-4" />
            Volver al listado
          </Button>
        )}
        <p className="page-eyebrow">Control de vacantes</p>
        <h1 className="page-title">Registrar una vacante</h1>
        <p className="page-lede">
          Completá los datos del puesto. La ficha de la derecha se actualiza
          mientras escribís, como una tarjeta de seguimiento sobre el escritorio.
        </p>
      </header>

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>No se pudo registrar</AlertTitle>
              <AlertDescription>
                <p>{errorMessage}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="form-grid">
            <div className="field">
              <Label htmlFor="puesto">Puesto *</Label>
              <Input
                id="puesto"
                name="puesto"
                value={puesto}
                maxLength={MAX_PUESTO}
                aria-invalid={!!fieldErrors.puesto}
                aria-describedby={fieldErrors.puesto ? "puesto-error" : undefined}
                placeholder="Ej. Desarrollador Backend"
                onChange={(e) => setPuesto(e.target.value)}
                data-testid="input-vacante-puesto"
              />
              {fieldErrors.puesto && (
                <p id="puesto-error" className="field-error" role="alert">
                  {fieldErrors.puesto}
                </p>
              )}
            </div>

            <div className="field">
              <Label htmlFor="empresa">Empresa *</Label>
              <Input
                id="empresa"
                name="empresa"
                value={empresa}
                maxLength={MAX_EMPRESA}
                aria-invalid={!!fieldErrors.empresa}
                aria-describedby={
                  fieldErrors.empresa ? "empresa-error" : undefined
                }
                placeholder="Ej. Acme Corp"
                onChange={(e) => setEmpresa(e.target.value)}
                data-testid="input-vacante-empresa"
              />
              {fieldErrors.empresa && (
                <p id="empresa-error" className="field-error" role="alert">
                  {fieldErrors.empresa}
                </p>
              )}
            </div>

            <div className="field field--full">
              <div className="field-label-row">
                <Label htmlFor="requisitos">Requisitos</Label>
                <span
                  className={`char-count ${requisitosCount > MAX_REQUISITOS ? "char-count--over" : ""}`}
                >
                  {requisitosCount}/{MAX_REQUISITOS}
                </span>
              </div>
              <Textarea
                id="requisitos"
                name="requisitos"
                value={requisitos}
                maxLength={MAX_REQUISITOS}
                rows={5}
                aria-invalid={!!fieldErrors.requisitos}
                aria-describedby={
                  fieldErrors.requisitos ? "requisitos-error" : undefined
                }
                placeholder="Experiencia, stack, idiomas…"
                onChange={(e) => setRequisitos(e.target.value)}
                data-testid="input-vacante-requisitos"
              />
              {fieldErrors.requisitos && (
                <p id="requisitos-error" className="field-error" role="alert">
                  {fieldErrors.requisitos}
                </p>
              )}
            </div>

            <div className="field">
              <Label htmlFor="modalidad">Modalidad *</Label>
              <Select value={modalidad} onValueChange={setModalidad}>
                <SelectTrigger id="modalidad" data-testid="select-modalidad">
                  <SelectValue placeholder="Elegí modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={ModalidadVacante.PRESENCIAL}>
                      Presencial
                    </SelectItem>
                    <SelectItem value={ModalidadVacante.HIBRIDA}>
                      Híbrida
                    </SelectItem>
                    <SelectItem value={ModalidadVacante.REMOTA}>
                      Remota
                    </SelectItem>
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
              <Label htmlFor="fecha_vto">Fecha de vencimiento</Label>
              <Popover open={fechaOpen} onOpenChange={setFechaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    id="fecha_vto"
                    className="w-full justify-between font-normal"
                    data-testid="button-open-fecha-vto"
                  >
                    {fechaVto
                      ? fechaVto.toLocaleDateString("es-AR")
                      : "Sin fecha"}
                    <ChevronDownIcon className="size-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaVto}
                    captionLayout="dropdown"
                    startMonth={new Date()}
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    onSelect={(date) => {
                      setFechaVto(date);
                      setFechaOpen(false);
                    }}
                    disabled={{ before: new Date() }}
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
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={estado}
                onValueChange={(value) => setEstado(value as EstadoVacante)}
              >
                <SelectTrigger id="estado" data-testid="select-estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={EstadoVacante.PENDIENTE}>
                      Pendiente
                    </SelectItem>
                    <SelectItem value={EstadoVacante.ENVIADA}>
                      Enviada
                    </SelectItem>
                    <SelectItem value={EstadoVacante.CADUCADA}>
                      Caducada
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="field">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(value) =>
                  setPrioridad(value as PrioridadVacante)
                }
              >
                <SelectTrigger id="prioridad" data-testid="select-prioridad">
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
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={submitting}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || submitting}
              data-testid="button-create-vacante"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Registrar vacante"
              )}
            </Button>
          </div>
        </form>

        <VacantePreviewCard
          vacante={createdVacante ?? { id: "", puesto: "", requisitos: "", empresa: "", modalidad: "", fecha_vto: undefined, estado_vacante: EstadoVacante.PENDIENTE, prioridad_vacante: PrioridadVacante.MEDIA }}
          onCreateAnother={() => {
            resetForm();
            setCreatedVacante({ id: "", puesto: "", requisitos: "", empresa: "", modalidad: "", fecha_vto: undefined, estado_vacante: EstadoVacante.PENDIENTE, prioridad_vacante: PrioridadVacante.MEDIA });
          }}
        />
      </div>

      <BottomBanner />
    </div>
  );
}

export default VacanteCreatePage;
