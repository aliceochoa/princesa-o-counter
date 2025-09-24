import React from "react";
import { Box, Slider, Typography } from "@mui/material";

interface CapitulosSliderProps {
  intervalo: [number, number];
  onChange: (novoIntervalo: [number, number]) => void;
}

const CapitulosSlider: React.FC<CapitulosSliderProps> = ({
  intervalo,
  onChange,
}) => {
  return (
    <Box width="100%" px={2}>
      <Typography variant="body1" gutterBottom>
        Intervalo de capítulos:
      </Typography>
      <Slider
        value={intervalo}
        onChange={(_, val) => onChange(val as [number, number])}
        min={1}
        max={173}
        valueLabelDisplay="auto"
        marks={[
          { value: 1, label: "1" },
          { value: 32, label: "32" },
          { value: 102, label: "102" },
          { value: 173, label: "173" },
        ]}
      />
    </Box>
  );
};

export default CapitulosSlider;
