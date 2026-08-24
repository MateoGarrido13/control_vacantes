import type { FC } from "react";
import { Vacante } from "@/types/vacante";
import { Button } from "@/components/ui/button";


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
interface VacantePreviewCardProps {
    vacante: Vacante;
    onCreateAnother: () => void;
  }
  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Sin vencimiento";
  const VacantePreviewCard: FC<VacantePreviewCardProps> = ({ vacante, onCreateAnother }) => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{vacante.puesto}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{vacante.requisitos}</p>
                <p>{vacante.empresa}</p>
                <p>{vacante.modalidad}</p>
                <p>{formatDate(vacante.fecha_vto)}</p>
                <p>{vacante.estado_vacante}</p>
                <p>{vacante.prioridad_vacante}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={onCreateAnother}>Crear otra vacante</Button>
            </CardFooter>
        </Card>
    );
};

export default VacantePreviewCard;