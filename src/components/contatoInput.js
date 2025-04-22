import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

export const InputContato = ({
  control,
  name,
  label = "Contato",
  rules = {},
  tipoContato,
  ...rest
}) => {
  const formatTelefone = (val) => {
    val = val.replace(/\D/g, "").slice(0, 11);
    if (val.length <= 10) {
      return val
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return val
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Campo obrigatório",
        validate: (value) =>
          tipoContato === "telefone"
            ? /^\d{10,11}$/.test(value) || "Número de telefone inválido"
            : tipoContato === "email"
            ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email inválido"
            : true,
        ...rules,
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const handleChange = (e) => {
          const rawValue = tipoContato === "telefone"
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;

          onChange(rawValue);
        };

        const formattedValue =
          tipoContato === "telefone" ? formatTelefone(value || "") : value || "";

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
