import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

export const InputCEP = ({ control, name, label = "CEP", rules = {}, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Campo obrigatório",
        validate: (value) =>
          /^\d{8}$/.test(value) || "CEP inválido", // valor raw
        ...rules,
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const formatCEP = (val) => {
          val = val.replace(/\D/g, "").slice(0, 8);
          return val.replace(/^(\d{5})(\d)/, "$1-$2");
        };

        const handleChange = (e) => {
          const rawValue = e.target.value.replace(/\D/g, "");
          onChange(rawValue);
        };

        const formattedValue = formatCEP(value || "");

        return (
          <TextField
            label={label}
            value={formattedValue}
            onChange={handleChange}
            onBlur={onBlur}
            error={!!error}
            helperText={error?.message}
            fullWidth
            {...rest}
          />
        );
      }}
    />
  );
};
