import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { FormFrame } from '../../components/formFrame';
import Grid from '@mui/material/Grid2';
import MonetaryInput from '../../components/monetaryInput';

function NomeProduto({ produto, handleChange, errors }) {
  return (
    <TextField
      fullWidth
      label="Nome"
      name="nome"
      value={produto.nome}
      onChange={handleChange}
      margin="normal"
      required
      error={!!errors.nome}
      helperText={errors.nome || ''}
    />
  );
}

function ValoresProduto({ produto, handleChange, errors, formatarValor }) {
  return (
    <Grid container spacing={2}>
      <Grid item size={{ xs: 12, md: 6 }}>
        <MonetaryInput
          fullWidth
          label="Valor de Compra"
          name="valorCompra"
          value={produto.valorCompra}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.valorCompra}
          helperText={errors.valorCompra || ''}
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 6 }}>
      <MonetaryInput
          fullWidth
          label="Valor de Venda"
          name="valorVenda"
          value={produto.valorVenda}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.valorVenda}
          helperText={errors.valorVenda || ''}
        />
      </Grid>
    </Grid>
  );
}

function DescricaoProduto({ produto, handleChange }) {
  return (
    <TextField
      fullWidth
      label="Descrição"
      name="descricao"
      value={produto.descricao}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={4}
    />
  );
}

function QuantidadeEstoque({ produto, handleChange, errors }) {
  return (
    <TextField
      fullWidth
      label="Quantidade Inicial"
      name="quantidade"
      type="number"
      value={produto.quantidade}
      onChange={handleChange}
      margin="normal"
      required
      InputProps={{ inputProps: { min: 0 } }}
      error={!!errors.quantidade}
      helperText={errors.quantidade || ''}
    />
  );
}

export default function ProdutoForm() {
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    quantidade: 0,
    valorCompra: '',
    valorVenda: '',
  });

  const [errors, setErrors] = useState({
    nome: '',
    quantidade: '',
    valorCompra: '',
    valorVenda: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduto({
      ...produto,
      [name]: value,
    });
  };

  const validarCampos = () => {
    let valid = true;
    const newErrors = {
      nome: '',
      quantidade: '',
      valorCompra: '',
      valorVenda: '',
    };

    if (!produto.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
      valid = false;
    }

    if (produto.quantidade === '' || produto.quantidade < 0) {
      newErrors.quantidade = 'A quantidade inicial deve ser maior ou igual a zero.';
      valid = false;
    }

    if (!produto.valorCompra || parseFloat(produto.valorCompra.replace(/[^\d.-]/g, '')) <= 0) {
      newErrors.valorCompra = 'O valor de compra é obrigatório e deve ser maior que zero.';
      valid = false;
    }

    if (!produto.valorVenda || parseFloat(produto.valorVenda.replace(/[^\d.-]/g, '')) <= 0) {
      newErrors.valorVenda = 'O valor de venda é obrigatório e deve ser maior que zero.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validarCampos()) {
      console.log('Produto cadastrado:', produto);
      // Enviar os dados para a API ou realizar outra lógica de processamento
    }
  };

  const handleCancel = () => {
    setProduto({ nome: '', descricao: '', quantidade: 0, valorCompra: '', valorVenda: '' });
    setErrors({ nome: '', quantidade: '', valorCompra: '', valorVenda: '' });
  };

  return (
    <FormFrame
      title="Cadastro de Produto"
      formData={[
        <NomeProduto 
          produto={produto} 
          handleChange={handleChange} 
          errors={errors}
          key="nome" 
        />,
        <ValoresProduto 
          produto={produto} 
          handleChange={handleChange} 
          errors={errors} 
          key="valores" 
        />,
        <DescricaoProduto 
          produto={produto} 
          handleChange={handleChange} 
          key="descricao" 
        />,
        <QuantidadeEstoque 
          produto={produto} 
          handleChange={handleChange} 
          errors={errors}
          key="quantidade" 
        />,
      ]}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
