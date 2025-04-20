import { Autocomplete, TextField } from "@mui/material";

const handleChange = (event, newValue, onChange) => {
  const targetEvent = {
    target: {
      name: 'pessoaFisica',
      value: newValue ? newValue.id : '',
    },
  };

  if (onChange) {
    onChange(targetEvent);
  }
};

export default function PessoaFisicaAutoComplete({
  fullWidth = false,
  pessoaFisicaSelecionada,
  onChange,
  errors = {},
  helperText,
  listaPessoasFisicas = [],
}) {
  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={listaPessoasFisicas}
      getOptionLabel={(option) => option.nome || ''}
      value={
        listaPessoasFisicas.find((pessoa) => pessoa.id === pessoaFisicaSelecionada) || null
      }
      onChange={(event, newValue) => handleChange(event, newValue, onChange)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pessoa Física"
          margin="normal"
          required
          error={!!errors.pessoaFisica}
          helperText={errors.pessoaFisica || helperText || ''}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      clearOnEscape
    />
  );
}
