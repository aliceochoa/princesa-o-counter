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
} from "@mui/material";
import PalavraSwitch from "./components/mui/PalavraSwitch";
import OcorrenciasCheckbox from "./components/mui/OcorrenciasCheckbox";
import OrdenarSelect from "./components/mui/OrdenarSelect";
import CapitulosSlider from "./components/mui/CapitulosSlider";
import TabelaPalavras from "./components/recharts/TabelaPalavras";
import TotaisBox from "./components/mui/TotaisBox";
import TituloPrincipal from "./components/mui/TituloPrincipal";

type CapituloData = {
  capitulo: number;
  princesa?: number;
  princeso?: number;
  data?: string;
};

const API_URL = `${(import.meta as any).env.VITE_API_URL?.replace(/\/+$/, "")}/capitulos`;

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

  const carregarDados = async () => {
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
      const maior = princesa >= princeso ? princesa : princeso;
      const menor = princesa < princeso ? princesa : princeso;

      return {
        ...item,
        data: item.data,
        princesa,
        princeso,
        maior,
        menor,
        soma:
          (mostrarPrincesa ? princesa : 0) + (mostrarPrinceso ? princeso : 0),
      };
    })
    .sort((a, b) => {
      if (ordenar === "crescente") return a.soma - b.soma;
      if (ordenar === "decrescente") return b.soma - a.soma;
      return a.capitulo - b.capitulo;
    });

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

        {/* Tabela */}
        <TabelaPalavras
          dados={dadosFiltrados}
          mostrarPrincesa={mostrarPrincesa}
          mostrarPrinceso={mostrarPrinceso}
        />
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
    por{' '}
    <Link
      href="https://github.com/aliceochoa"
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      color="inherit"
      fontWeight="bold"
    >
      Alice Ochoa
    </Link>{' '} | agosto de 2025
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default App;
