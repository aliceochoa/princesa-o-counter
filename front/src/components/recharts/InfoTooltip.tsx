import React from "react";
import { Box } from "@mui/material";

interface InfoTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string | number;
  mostrarPrincesa: boolean;
  mostrarPrinceso: boolean;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  active,
  payload,
  label,
  mostrarPrincesa,
  mostrarPrinceso,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload || {};
  const capitulo = typeof label !== "undefined" ? label : item.capitulo;
  const princesa = item.princesa ?? 0;
  const princeso = item.princeso ?? 0;
  const data = item.data !== undefined && item.data !== null ? `[${item.data}]` : "Data não disponível";

  // Total apenas se as duas palavras estiverem visíveis
  const mostrarTotal = mostrarPrincesa && mostrarPrinceso;
  const total = princesa + princeso;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        p: 1.2,
        borderRadius: 1,
        minWidth: 180,
      }}
    >
      <strong>Capítulo {capitulo}</strong>
      <Box sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
        {data}
      </Box>

      {mostrarPrincesa && (
        <Box sx={{ fontSize: 14, color: "secondary.main" }}>Princesa: {princesa}</Box>
      )}
      {mostrarPrinceso && (
        <Box sx={{ fontSize: 14, color: "primary.main" }}>Princeso: {princeso}</Box>
      )}

      {mostrarTotal && (
        <Box sx={{ mt: 0.5, fontWeight: 600 }}>Total = {total}</Box>
      )}
    </Box>
  );
};

export default InfoTooltip;
