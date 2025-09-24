import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Divider,
  Stack,
  Link,
  Alert,
  LinearProgress,
  Button,
  Paper,
} from "@mui/material";
import PalavraSwitch from "./components/mui/PalavraSwitch";
import OcorrenciasCheckbox from "./components/mui/OcorrenciasCheckbox";
import OrdenarSelect from "./components/mui/OrdenarSelect";
import CapitulosSlider from "./components/mui/CapitulosSlider";
import TabelaPalavras from "./components/recharts/TabelaPalavras";
import TotaisBox from "./components/mui/TotaisBox";
import TituloPrincipal from "./components/mui/TituloPrincipal";
import BarraDeStatus from "./components/mui/BarraDeStatus";
import GraficoSkeleton from "./components/mui/GraficoSkeleton";
import "./wakeApi";
import "./axiosRetry";
import { useApiStatus } from "./hooks/useApiStatus";

type CapituloData = {
  capitulo: number;
  princesa?: number;
  princeso?: number;
  data?: string;
};

const API_URL = `${(import.meta as any).env.VITE_API_URL?.replace(
  /\/+$/,
  ""
)}/capitulos`;
const API_BASE = (import.meta as any).env.VITE_API_URL?.replace(/\/+$/, "");
const PING_ENDPOINTS = [
  `${API_BASE}/health`,
  `${API_BASE}/capitulos?min=1&max=1&ocultar=false`,
];

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function pingApiOnce(): Promise<boolean> {
  for (const url of PING_ENDPOINTS) {
    try {
      const r = await fetch(url, { method: "GET" });
      if (r.ok) return true; // 2xx
    } catch (_) {
      // ignore and try next
    }
  }
  return false;
}

async function wakeApiWithRetry(
  setStatus: (s: string) => void,
  maxSeconds = 70
): Promise<boolean> {
  // Progressive backoff ~ 0s,1s,2s,4s,8s,12s,16s,20s,  capped
  const steps = [0, 1000, 2000, 4000, 8000, 12000, 16000, 20000];
  let elapsed = 0;
  for (let i = 0; i < steps.length && elapsed <= maxSeconds * 1000; i++) {
    const wait = steps[i];
    if (wait) {
      setStatus(`Acordando a API (tentativa ${i}/${steps.length - 1})`);
      await sleep(wait);
      elapsed += wait;
    }
    const ok = await pingApiOnce();
    if (ok) return true;
  }
  return false;
}

const App: React.FC = () => {
  const [dados, setDados] = useState<CapituloData[]>([]);
  const [intervalo, setIntervalo] = useState<[number, number]>([32, 173]);
  const [mostrarPrincesa, setMostrarPrincesa] = useState(true);
  const [mostrarPrinceso, setMostrarPrinceso] = useState(true);
  const [ocultarZeros, setOcultarZeros] = useState(true);
  const [ordenar, setOrdenar] = useState("nenhuma");
  const [totais, setTotais] = useState<{ princesa: number; princeso: number }>({
    princesa: 0,
    princeso: 0,
  });
  const [warming, setWarming] = useState(false);
  const [warmingStatus, setWarmingStatus] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);


  const { loadingCount, apiStatus, hasSettledOnce } = useApiStatus();

  const carregarDados = async () => {
    try {
      setApiError(null);
      if (!apiReady) {
        setWarming(true);
        const ok = await wakeApiWithRetry((s) => setWarmingStatus(s));
        setWarming(false);
        if (!ok) {
          setApiError("Não consegui conectar à API. Tente novamente.");
          return;
        }
        setApiReady(true);
      }

      const params: any = {
        min: intervalo[0],
        max: intervalo[1],
        ordenar: ordenar,
        ocultar: ocultarZeros,
        palavras: [],
      };

      if (mostrarPrincesa) params.palavras.push("princesa");
      if (mostrarPrinceso) params.palavras.push("princeso");

      const response = await axios.get(API_URL, { params });
      setDados(response.data);

      // Calcular totais
      const total: { princesa: number; princeso: number } = {
        princesa: 0,
        princeso: 0,
      };
      response.data.forEach((item: CapituloData) => {
        if (mostrarPrincesa && item.princesa) total.princesa += item.princesa;
        if (mostrarPrinceso && item.princeso) total.princeso += item.princeso;
      });
      setTotais(total);
    } catch (err) {
      setApiError("Erro ao buscar dados da API. Tente novamente.");
    }
  
    finally {
      try { setHasFetchedOnce(true); } catch {}
    }
};

  const dadosFiltrados = dados
    .filter((item) => {
      const cap = item.capitulo;
      const dentroDoIntervalo = cap >= intervalo[0] && cap <= intervalo[1];

      if (!dentroDoIntervalo) return false;

      if (!ocultarZeros) return true;

      // Se ocultarZeros está ativo, aplicar filtros específicos:
      if (mostrarPrincesa && mostrarPrinceso) {
        return (item.princesa ?? 0) > 0 || (item.princeso ?? 0) > 0;
      } else if (mostrarPrincesa) {
        return (item.princesa ?? 0) > 0;
      } else if (mostrarPrinceso) {
        return (item.princeso ?? 0) > 0;
      } else {
        return false; // Nenhuma palavra está visível, oculta tudo
      }
    })
    .map((item) => {
      const princesa = item.princesa ?? 0;
      const princeso = item.princeso ?? 0;
      return {
        capitulo: item.capitulo,
        princesa,
        princeso,
        data: item.data,
        soma: princesa + princeso,
      };
    })
    .sort((a, b) => {
      if (ordenar === "crescente") return a.soma - b.soma;
      if (ordenar === "decrescente") return b.soma - a.soma;
      return a.capitulo - b.capitulo;
    });

  const TABLE_MIN_HEIGHT = 420; // ajuste se quiser
  const isLoadingData = warming || loadingCount > 0 || !hasSettledOnce;
  const hasData = Array.isArray(dadosFiltrados) && dadosFiltrados.length > 0;
  const showSkeleton = isLoadingData || !hasSettledOnce;
  const showTable = !showSkeleton && !apiError && hasData;
  const showEmpty = !showSkeleton && !apiError && hasFetchedOnce && !hasData;

  useEffect(() => {
    (async () => {
      setWarming(true);
      const ok = await wakeApiWithRetry((s) => setWarmingStatus(s));
      setWarming(false);
      setApiReady(ok);
      if (!ok)
        setApiError(
          "A API pode estar iniciando (Render). Clique em 'Tentar novamente' ou recarregue."
        );
    })();
  }, []);

  useEffect(() => {
    carregarDados();
  }, [intervalo, mostrarPrincesa, mostrarPrinceso, ocultarZeros, ordenar]);

  return (
    <Container>
      <Card
        variant="outlined"
        sx={{
          p: 2,
          m: 4,
          backgroundColor: "#fafafa",
          width: "100%",
          mx: "auto",
          overflow: "visible",
        }}
      >
        <TituloPrincipal
          titulo="Princesa(o) Counter"
          subtitulo="Mavi & Luma | Mania de Você"
          imgEsquerda="img/header1v2.png"
          imgDireita="img/header2v2.png"
        />

        {/* Box de filtros */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2, overflowX: "auto" }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              divider={
                <Divider orientation="vertical" variant="middle" flexItem />
              }
              justifyContent="flex-start"
              flexWrap="nowrap"
            >
              <Box display="flex" px={1} gap={2}>
                {/* Selecionar Princesa e/ou Princeso */}
                <PalavraSwitch
                  label="Princesa"
                  checked={mostrarPrincesa}
                  onChange={() => {
                    if (mostrarPrincesa && !mostrarPrinceso) {
                      // Impede que ambos fiquem desmarcados
                      setMostrarPrincesa(false);
                      setMostrarPrinceso(true);
                    } else {
                      setMostrarPrincesa((prev) => !prev);
                    }
                  }}
                />
                <PalavraSwitch
                  label="Princeso"
                  checked={mostrarPrinceso}
                  onChange={() => {
                    if (mostrarPrinceso && !mostrarPrincesa) {
                      // Impede que ambos fiquem desmarcados
                      setMostrarPrinceso(false);
                      setMostrarPrincesa(true);
                    } else {
                      setMostrarPrinceso((prev) => !prev);
                    }
                  }}
                />
              </Box>

              {/* Mostrar apenas capítulos com ocorrências */}
              <OcorrenciasCheckbox
                checked={ocultarZeros}
                onChange={() => setOcultarZeros((prev) => !prev)}
              />

              {/* Ordenação */}
              <OrdenarSelect value={ordenar} onChange={setOrdenar} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Intervalo de capítulos */}
            <CapitulosSlider intervalo={intervalo} onChange={setIntervalo} />
          </Card>
        </Grid>

        {/* Barra de Status e Alertas */}
        <BarraDeStatus loadingCount={loadingCount} apiStatus={apiStatus} />

        {/* Área da Tabela/Gráfico (mantém altura enquanto carrega) */}
        <>
          {showSkeleton ? (
              <><Alert severity="info" icon={false} sx={{ mb: 1 }}>
              {warmingStatus ||
                "Carregando os dados… Pode levar alguns segundos enquanto a API inicia."}
            </Alert><LinearProgress /><GraficoSkeleton
                height={TABLE_MIN_HEIGHT - 96}
                barWidth={28}
                gap={16}
                bars={[20, 48, 72, 56, 88, 34, 60]} /></>
          ) : apiError ? (
            <Alert
              severity="warning"
              action={
                <Button
                  onClick={() => {
                    setApiReady(false);
                    carregarDados();
                  }}
                >
                  Tentar novamente
                </Button>
              }
            >
              {apiError}
            </Alert>
          ) : showTable ? (
            <TabelaPalavras
              dados={dadosFiltrados}
              mostrarPrincesa={mostrarPrincesa}
              mostrarPrinceso={mostrarPrinceso}
            />
          ) : showEmpty ? (
            <Alert severity="info" icon={false}>
              Nenhuma ocorrência para os filtros atuais.
            </Alert>
          ) : null}
        </>
        {/* Totais */}
        <TotaisBox
          mostrarPrincesa={mostrarPrincesa}
          mostrarPrinceso={mostrarPrinceso}
          totais={totais}
          intervalo={intervalo}
        />
        {/* Copyright */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            por{" "}
            <Link
              href="https://github.com/aliceochoa"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="inherit"
              fontWeight="bold"
            >
              Alice Ochoa
            </Link>{" "}
            | agosto de 2025
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default App;
