import { Box, Skeleton } from "@mui/material";

type Par = { base: number; topo: number }; // base (série 1) + topo (série 2) empilhado

type Props = {
  /** Altura total do chart (px) */
  height?: number;
  /** Máximo do eixo Y (ex.: 20) para escalar alturas */
  yMax?: number;
  /** Número de colunas (ideal: igual ao número de capítulos/itens) */
  nCols?: number;
  /** Largura de cada coluna (px) */
  barWidth?: number;
  /** Espaço entre colunas (px) */
  gap?: number;
  /** Mostrar linhas de grid horizontais (yTicks + eixo) */
  mostrarGrid?: boolean;
  /** Quantidade de divisões do eixo Y (linhas) */
  yTicks?: number;
  /** Mostrar "marcas" no eixo X a cada N colunas */
  xTickEvery?: number;
  /** Dados fakes opcionais (se não fornecer, geramos um perfil plausível) */
  dados?: Par[];
};

export default function GraficoSkeleton({
  height = 360,
  yMax = 20,
  nCols = 100,
  barWidth = 6,
  gap = 3,
  mostrarGrid = true,
  yTicks = 5,
  xTickEvery = 4,
  dados,
}: Props) {
  // padding interno p/ eixos
  const padX = 24;
  const padY = 24;
  const eixoXLabel = 18; // espaço para rótulos fakes no eixo X
  const innerH = Math.max(60, height - padY * 2 - eixoXLabel);

  // Gera um perfil com ondas + picos (muito parecido com um chart real variado)
  const fake: Par[] =
    dados ||
    Array.from({ length: nCols }, (_, i) => {
      const waveA = Math.max(0, Math.sin(i / 8) * 6 + 5);
      const waveB = Math.max(0, Math.cos(i / 13) * 3 + 2);
      const pico = i % 19 === 0 ? 7 : i % 29 === 0 ? 10 : 0;
      const total = Math.min(yMax, Math.round(waveA + waveB + pico));
      const base = Math.round(total * (i % 5 === 0 ? 0.35 : 0.22)); // série de baixo (menor)
      const topo = Math.max(0, total - base);                       // série de cima
      return { base, topo };
    });

  // Largura total útil (para caso queira medir)
  const totalWidth = nCols * barWidth + (nCols - 1) * gap;

  return (
    <Box sx={{ height, position: "relative", overflow: "hidden" }}>
      {/* Eixos */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          ml: `${padX}px`,
          mb: `${padY}px`,
          pointerEvents: "none",
        }}
      />

      {/* Grid horizontal + rótulos fakes do eixo Y */}
      {mostrarGrid &&
        Array.from({ length: yTicks }, (_, k) => k + 1).map((i) => {
          const frac = i / yTicks; // 1/yTicks ... 1
          return (
            <Box key={i}>
              <Box
                sx={{
                  position: "absolute",
                  left: padX,
                  right: 8,
                  bottom: padY + eixoXLabel + innerH * (1 - frac),
                  borderBottom: i === yTicks ? "1px solid" : "1px dashed",
                  borderColor: "divider",
                  opacity: i === yTicks ? 0.9 : 0.5,
                }}
              />
              {/* bloquinhos de texto (fingem números do eixo) */}
              <Box
                sx={{
                  position: "absolute",
                  left: 2,
                  bottom: padY + eixoXLabel + innerH * (1 - frac) - 8,
                  width: padX - 6,
                }}
              >
                <Skeleton variant="text" sx={{ width: "70%" }} />
              </Box>
            </Box>
          );
        })}

      {/* Barras */}
      <Box
        sx={{
          position: "absolute",
          left: padX,
          right: 8,
          bottom: padY + eixoXLabel,
          height: innerH,
          display: "flex",
          alignItems: "flex-end",
          gap: `${gap}px`,
          width: totalWidth, // para consistência visual
        }}
      >
        {fake.map((col, idx) => {
          const hBase = Math.max(0, Math.min(1, col.base / yMax)) * innerH;
          const hTopo = Math.max(0, Math.min(1, col.topo / yMax)) * innerH;
          return (
            <Box key={idx} sx={{ width: barWidth, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
              <Skeleton variant="rectangular" width={barWidth} height={Math.max(4, Math.floor(hBase))} />
              <Skeleton variant="rectangular" width={barWidth} height={Math.max(4, Math.floor(hTopo))} sx={{ mt: hBase ? "2px" : 0 }} />
            </Box>
          );
        })}
      </Box>

      {/* Eixo X: marcas fakes a cada xTickEvery colunas */}
      <Box
        sx={{
          position: "absolute",
          left: padX,
          right: 8,
          bottom: padY,
          height: eixoXLabel,
          display: "flex",
          alignItems: "flex-end",
          gap: `${gap}px`,
          width: totalWidth,
        }}
      >
        {fake.map((_, i) =>
          i % xTickEvery === 0 ? (
            <Skeleton key={i} variant="text" sx={{ width: barWidth * 1.2 }} />
          ) : (
            <Box key={i} sx={{ width: barWidth }} />
          )
        )}
      </Box>
    </Box>
  );
}
