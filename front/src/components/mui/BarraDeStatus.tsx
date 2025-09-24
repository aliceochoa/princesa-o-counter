import { Alert, Chip, LinearProgress, Stack } from "@mui/material";

type Props = { loadingCount: number; apiStatus: string | null };

export default function BarraDeStatus({ loadingCount, apiStatus }: Props) {
  const show = loadingCount > 0 || !!apiStatus;
  if (!show) return null;
  return (
    <Alert severity="info" sx={{ mb: 2, alignItems: "center" }}>
      <Stack direction="row" spacing={2} alignItems="center" width="100%">
        <Chip size="small" label={apiStatus || "Carregando dados do gráfico…"} />
        <LinearProgress sx={{ flex: 1 }} />
      </Stack>
    </Alert>
  );
}
