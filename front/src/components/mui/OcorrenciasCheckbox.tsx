import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

interface OcorrenciasCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const OcorrenciasCheckbox: React.FC<OcorrenciasCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label="Mostrar apenas capítulos com ocorrências"
    />
  );
};

export default OcorrenciasCheckbox;
