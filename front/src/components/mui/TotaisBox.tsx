import React from "react";
import { Card, Box, Typography, Tooltip } from "@mui/material";

interface TotaisBoxProps {
  mostrarPrincesa: boolean;
  mostrarPrinceso: boolean;
  totais: { princesa: number; princeso: number };
  intervalo: [number, number];
}

const TotaisBox: React.FC<TotaisBoxProps> = ({
  mostrarPrincesa,
  mostrarPrinceso,
  totais,
  intervalo,
}) => {
  const intervaloTexto =
    intervalo[0] !== 1 || intervalo[1] !== 173
      ? ` entre os capítulos ${intervalo[0]} e ${intervalo[1]}`
      : "";

  return (
    <Card
      variant="outlined"
      sx={{
        px: 2,
        py: 0.5,
        mb: 2,
        overflow: "visible",
        minHeight: mostrarPrincesa && mostrarPrinceso ? 180 : 130, // garante altura mínima para um ou dois cards
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {mostrarPrincesa && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            mb: mostrarPrinceso ? -4 : 0, // só aplica margem se o outro não estiver visível
          }}
        >
          <img
            src="img/box1.png"
            alt="Princesa"
            style={{
              width: 120,
              height: 120,
              marginLeft: -32,
              marginRight: 8,
              marginTop: 2,
              zIndex: 2,
            }}
          />
          <Tooltip
            title={
              <>
                <Typography variant="body2" color="white">
                  A primeira vez foi no capítulo{" "}
                  <Box component="span" sx={{ color: "secondary.main" }}>
                    32
                  </Box>
                  .
                </Typography>
                <Typography variant="body2" color="white">
                  O recorde foi no cap.{" "}
                  <Box component="span" sx={{ color: "secondary.main" }}>
                    149
                  </Box>{" "}
                  com{" "}
                  <Box component="span" sx={{ color: "secondary.main" }}>
                    17 vezes
                  </Box>
                  .
                </Typography>
              </>
            }
            arrow
            placement="top-end"
            slotProps={{
              popper: {
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "gray",
                  },
                  "& .MuiTooltip-arrow": {
                    color: "gray",
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#ba9494", // rosa claro
                px: 2,
                py: 1,
                borderRadius: 2,
                ml: -3.8, // balão começa por trás da imagem
                zIndex: 1,
              }}
            >
              <Typography fontWeight="bold">
                O Mavi chamou a Luma de "princesa" exatamente {totais.princesa}{" "}
                vezes
                {intervaloTexto}.
                <Box
                  component="span"
                  sx={{ color: "secondary.main", fontWeight: "bold" }}
                >
                  *
                </Box>
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      )}

      {mostrarPrinceso && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            mt: mostrarPrincesa ? -4 : 0, // só aplica margem se o outro estiver visível
          }}
        >
          <Tooltip
            title={
              <>
                <Typography variant="body2" color="white">
                  A primeira vez foi no capítulo{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    49
                  </Box>
                  .
                </Typography>
                <Typography variant="body2" color="white">
                  O recorde foi no cap.{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    132
                  </Box>{" "}
                  com{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    7 vezes
                  </Box>
                  .
                </Typography>
              </>
            }
            arrow
            placement="top-end"
            slotProps={{
              popper: {
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "gray",
                  },
                  "& .MuiTooltip-arrow": {
                    color: "gray",
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#7ba5b8", // azul claro
                px: 2,
                py: 1,
                borderRadius: 2,
                mr: -6, // balão começa por trás da imagem
                zIndex: 1,
              }}
            >
              <Typography fontWeight="bold">
                A Luma chamou o Mavi de "princeso" exatamente {totais.princeso}{" "}
                vezes
                {intervaloTexto}.
                <Box
                  component="span"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  *
                </Box>
              </Typography>
            </Box>
          </Tooltip>
          <img
            src="img/box2.png"
            alt="Princeso"
            style={{
              width: 130,
              height: 130,
              marginRight: -46,
              marginLeft: 8,
              marginTop: 4,
              zIndex: 2,
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default TotaisBox;
