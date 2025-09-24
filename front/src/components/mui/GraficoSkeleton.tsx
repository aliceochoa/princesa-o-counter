import { Box, Skeleton } from "@mui/material";

type Props = {
  /** Altura total do chart area (px) */
  height?: number;
  /** Largura de cada barra (px) */
  barWidth?: number;
  /** Espaço entre barras (px) */
  gap?: number;
  /** Alturas relativas das barras (0–100) */
  bars?: number[];
};

export default function GraficoSkeleton({
  height = 320,
  barWidth = 28,
  gap = 16,
  bars = [18, 42, 70, 55, 85, 33, 62],
}: Props) {
  // margem para eixos
  const innerPadX = 16;
  const innerPadY = 16;
  const usableHeight = Math.max(60, height - innerPadY * 2 - 24); // 24 ~ espaço do rótulo do eixo

  return (
    // área do gráfico com "eixos"
    <Box
      sx={{
        height: "100%",
        borderLeft: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        pl: `${innerPadX}px`,
        pb: `${innerPadY}px`,
        display: "flex",
        alignItems: "flex-end",
        gap: `${gap}px`,
      }}
    >
      {bars.map((v, i) => {
        const h = Math.max(10, (usableHeight * Math.min(100, Math.max(0, v))) / 100);
        return (
          <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Skeleton variant="rectangular" width={barWidth} height={h} />
            {/* “rótulo” fake no eixo x */}
            <Skeleton variant="text" sx={{ width: barWidth * 0.7, mt: 0.5 }} />
          </Box>
        );
      })}
    </Box>
  );
}
