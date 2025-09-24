import React from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

interface OrdenarSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const OrdenarSelect: React.FC<OrdenarSelectProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body1">Ordenação:</Typography>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select value={value} onChange={handleChange}>
          <MenuItem value="nenhuma">Nenhuma</MenuItem>
          <MenuItem value="crescente">Crescente</MenuItem>
          <MenuItem value="decrescente">Decrescente</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrdenarSelect;
