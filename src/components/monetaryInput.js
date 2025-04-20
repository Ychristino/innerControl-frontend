import { TextField } from "@mui/material";

const formatarValor = (event, onChange) => {
    const { name, value } = event.target;
    
    const apenasNumeros = value.replace(/[^\d]/g, '');
    
    const valorFormatado = (
      Number(apenasNumeros) / 100
    ).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  
    event.target.value = valorFormatado;
    if (onChange){
        onChange(event);
    }
    
  };

export default function MonetaryInput({ label, name, value, margin, required, error, helperText, fullWidth, onChange }){
    return(
        <TextField
            fullWidth={fullWidth}
            label={label}
            name={name}
            value={value}
            onChange={(e) => formatarValor(e, onChange)}
            margin={margin}
            required={required}
            error={error}
            helperText={helperText}
        />
    );
}