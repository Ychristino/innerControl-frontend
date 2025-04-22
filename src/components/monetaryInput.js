import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { monetaryFormat } from "../utils/format";

// Converte string formatada para número
const parseToNumber = (value) => {
  if (!value) return 0;
  const numeric = parseFloat(value.replace(/[^\d]/g, "")) / 100;
  return isNaN(numeric) ? 0 : numeric;
};

export function MonetaryInput({ control, name, label = "Valor", rules = {}, ...rest }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value = 0, ref }, fieldState: { error } }) => (
        <TextField
          fullWidth
          inputRef={ref}
          label={label}
          value={monetaryFormat(value)}
          onChange={(e) => {
            const rawValue = parseToNumber(e.target.value);
            onChange(rawValue);
          }}
          onBlur={onBlur}
          error={!!error}
          helperText={error?.message}
          {...rest}
        />
      )}
    />
  );
}
