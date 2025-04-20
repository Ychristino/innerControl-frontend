import { TextField } from "@mui/material";

const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    const calc = (x) =>
        cpf
        .substr(0, x)
        .split('')
        .reduce((soma, el, i) => soma + el * (x + 1 - i), 0);
    const dig1 = (calc(9) * 10) % 11 % 10;
    const dig2 = (calc(10) * 10) % 11 % 10;
    return dig1 === +cpf[9] && dig2 === +cpf[10];
    };

const formatarCPF = (event, onChange) => {
    const {name, value} = event.target;

    const apenasNumeros = value.replace(/[^\d]/g, '');
    const cpfFormatado = apenasNumeros
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
        .substr(0, 14);

        event.target.value = cpfFormatado;

    if (onChange){
        onChange(event)
    }
};

export default function InputCPF({ fullWidth, label, name, value, onChange, margin, required, error, helperText }){
    return (
      <TextField
        fullWidth={fullWidth ? fullWidth : false}
        label={label}
        name={name}
        value={value}
        onChange={(e) => formatarCPF(e, onChange)}
        margin={margin}
        required={required ? required : false}
        error={!!error}
        helperText={helperText}
      />
    );
};

export { validarCPF, formatarCPF };