import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

interface PalavraSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const PalavraSwitch: React.FC<PalavraSwitchProps> = ({ label, checked, onChange }) => {
  // Define a cor do switch com base no rótulo
  const color: "secondary" | "primary" = label.toLowerCase() === "princesa" ? "secondary" : "primary";

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          color={color}
        />
      }
      label={`Mostrar "${label}"`}
    />
  );
};

export default PalavraSwitch;
