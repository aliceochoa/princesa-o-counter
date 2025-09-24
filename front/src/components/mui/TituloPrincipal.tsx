import React from "react";
import { Box, Typography } from "@mui/material";

interface TituloPrincipalProps {
  titulo: string;
  subtitulo?: string;
  imgEsquerda?: string;
  imgDireita?: string;
}

const TituloPrincipal: React.FC<TituloPrincipalProps> = ({
  titulo,
  subtitulo,
  imgEsquerda,
  imgDireita,
}) => {
  return (
    <Box textAlign="center" mt={-6} mb={2}>
      <Box
  display="flex"
  alignItems="flex-end"
  justifyContent="center"
  gap={1}
  sx={{
    mb: -2,
    overflow: "visible", // permite que a imagem ultrapasse
    position: "relative", // necessário para manter layout
  }}
>
  {imgEsquerda && (
    <img
      src={imgEsquerda}
      alt="esquerda"
      style={{
        height: "125px",
        width: "auto",
        margin: 0,
        padding: 0,
        position: "relative",
        left: "10px", // empurra pra fora
      }}
    />
  )}

  <Box textAlign="center" sx={{ pb: 2 }}>
    <Typography
      variant="h4"
      sx={{
        color: "secondary.main",
        lineHeight: 1.1,
        textTransform: 'uppercase'
      }}
    >
      {titulo}
    </Typography>
    {subtitulo && (
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        {subtitulo}
      </Typography>
    )}
  </Box>

  {imgDireita && (
    <img
      src={imgDireita}
      alt="direita"
      style={{
        height: "125px",
        width: "auto",
        margin: 0,
        padding: 0,
        position: "relative",
        right: "10px", // empurra pra fora
      }}
    />
  )}
</Box>
    </Box>
  );
};

export default TituloPrincipal;
