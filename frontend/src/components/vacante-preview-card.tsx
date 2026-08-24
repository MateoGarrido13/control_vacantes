import type { FC } from "react";

interface VacantePreviewCardProps {
  puesto: string;
  empresa: string;
  modalidad: string;
}

const VacantePreviewCard: FC<VacantePreviewCardProps> = ({
  puesto,
  empresa,
  modalidad,
}) => {
  const puestoLabel = puesto.trim();
  const empresaLabel = empresa.trim();

  return (
    <aside className="preview-card" aria-live="polite">
      <div className="preview-card__perforation" aria-hidden />
      <p className="preview-card__eyebrow">Vista previa</p>
      <h2 className="preview-card__title">
        <span className={puestoLabel ? undefined : "preview-card__placeholder"}>
          {puestoLabel || "Puesto"}
        </span>
        <span className="preview-card__separator"> — </span>
        <span className={empresaLabel ? undefined : "preview-card__placeholder"}>
          {empresaLabel || "Empresa"}
        </span>
      </h2>
      <div className="preview-card__meta">
        <span className="preview-card__chip">{modalidad || "Modalidad"}</span>
      </div>
    </aside>
  );
};

export default VacantePreviewCard;
