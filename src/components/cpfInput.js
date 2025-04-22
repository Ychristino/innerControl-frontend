import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

export const InputCPF = ({ control, name, label = "CPF", rules = {}, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Campo obrigatório",
        validate: (value) =>
          /^\d{11}$/.test(value) || "CPF inválido",
        ...rules,
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const formatCPF = (val) => {
          val = val.replace(/\D/g, "").slice(0, 11);
          return val
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        };

        const handleChange = (e) => {
          const rawValue = e.target.value.replace(/\D/g, "");
          onChange(rawValue); // mantém somente números no formState
        };

        const formattedValue = formatCPF(value || "");

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
