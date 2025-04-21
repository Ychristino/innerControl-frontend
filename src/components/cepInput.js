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
          /^\d{5}-\d{3}$/.test(value) || "CEP inválido",
        ...rules,
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const formatCEP = (val) => {
          val = val.replace(/\D/g, "").slice(0, 8);
          return val.replace(/^(\d{5})(\d)/, "$1-$2");
        };

        return (
          <TextField
            label={label}
            value={value || ""}
            onChange={(e) => onChange(formatCEP(e.target.value))}
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
