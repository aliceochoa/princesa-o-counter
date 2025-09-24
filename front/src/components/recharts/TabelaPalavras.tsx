import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import InfoTooltip from "./InfoTooltip";

interface DadosCapitulo {
  capitulo: number;
  princesa?: number;
  princeso?: number;
  data?: string;
}

interface Props {
  dados: DadosCapitulo[];
  mostrarPrincesa: boolean;
  mostrarPrinceso: boolean;
}

const TabelaPalavras: React.FC<Props> = ({
  dados,
  mostrarPrincesa,
  mostrarPrinceso,
}) => {
  const theme = useTheme();

  return (
    <Box mt={4} height={300} sx={{ ml: -3, mr: 3 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} barGap={4}>
          <XAxis
            dataKey="capitulo"
            tick={{ fontSize: 12 }} // Fonte menor no eixo X
          />
          <YAxis
            tick={{ fontSize: 14 }} // Fonte menor no eixo Y
            allowDecimals={false}
          />
          <Tooltip content={<InfoTooltip 
            mostrarPrincesa={mostrarPrincesa}
            mostrarPrinceso={mostrarPrinceso}
          />} />
          {/*<Legend />*/} 
          {mostrarPrinceso && (
            <Bar
              dataKey="princeso"
              stackId="sobreposicao"
              fill={theme.palette.primary.main}
              radius={
                !mostrarPrincesa ? [3, 3, 0, 0] : [0, 0, 0, 0] // Só arredonda se estiver no topo
              }
            />
          )}
          {mostrarPrincesa && (
            <Bar
              dataKey="princesa"
              stackId="sobreposicao"
              fill={theme.palette.secondary.main}
              radius={[3, 3, 0, 0]} // Sempre no topo da pilha (princesa sobre princeso)
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TabelaPalavras;
