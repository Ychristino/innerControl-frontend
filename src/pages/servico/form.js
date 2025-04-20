import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Autocomplete, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { FormFrame } from '../../components/formFrame';
import { Add, Remove, Delete } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Grid from '@mui/material/Grid2';
import MonetaryInput from '../../components/monetaryInput';
import PessoaFisicaAutoComplete from '../../components/autoCompletePessoaFisica';

function DatasServico({ servico, handleChange, errors }) {
  return (
    <Grid container spacing={2}>
      <Grid item size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Data de Entrada"
          name="dataEntrada"
          type="date"
          value={servico.dataEntrada}
          onChange={handleChange}
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          error={!!errors.dataEntrada}
          helperText={errors.dataEntrada || ''}
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Data de Entrega"
          name="dataEntrega"
          type="date"
          value={servico.dataEntrega}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
}

function ValorServico({ servico, handleChange, errors }) {
  return (
    <MonetaryInput
        fullWidth
        label="Valor do Serviço"
        name="valorServico"
        value={servico.valorServico}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.valorServico}
        helperText={errors.valorServico || ''}
      />
  );
}

function ListaProdutos({ servico, handleAddProduto, handleRemoveProduto, handleUpdateQuantidade, produtosDisponiveis }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleAdd = () => {
    if (produtoSelecionado && !servico.produtos.some((prod) => prod.nome === produtoSelecionado.nome)) {
      handleAddProduto({ ...produtoSelecionado, quantidade: 1 });
      setProdutoSelecionado(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Produtos</Typography>
      <Autocomplete
        options={produtosDisponiveis}
        getOptionLabel={(option) => `${option.nome} - R$ ${option.valor.toFixed(2)}`}
        value={produtoSelecionado}
        onChange={(event, newValue) => setProdutoSelecionado(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Selecionar Produto" margin="normal" fullWidth />
        )}
      />
      <Button 
        variant="outlined" 
        color='info'
        fullWidth
        size="large" 
        onClick={handleAdd} 
        sx={{ mt: 2 }} 
        aria-label="Adicionar item na lista"
      >
        <AddShoppingCartIcon /> Adicionar Item
      </Button>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Produto</TableCell>
            <TableCell>Valor (R$)</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servico.produtos.map((prod, index) => (
            <TableRow key={index}>
              <TableCell>{prod.nome}</TableCell>
              <TableCell>{prod.valor.toFixed(2)}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => handleUpdateQuantidade(index, prod.quantidade - 1)} disabled={prod.quantidade <= 1}>
                    <Remove />
                  </IconButton>
                  <TextField
                    type="number"
                    value={prod.quantidade}
                    onChange={(e) => handleUpdateQuantidade(index, parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    sx={{ width: '80px', mx: 1 }}
                  />
                  <IconButton onClick={() => handleUpdateQuantidade(index, prod.quantidade + 1)}>
                    <Add />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleRemoveProduto(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function ServicoForm() {
  const [servico, setServico] = useState({
    pessoaFisica: '', // Inicializado como string vazia
    dataEntrada: '',
    dataEntrega: '',
    valorServico: '',
    produtos: [],
  });

  const [errors, setErrors] = useState({
    pessoaFisica: '',
    dataEntrada: '',
    valorServico: '',
  });

  const pessoasFisicas = [
    { id: '1', nome: 'João Silva' },
    { id: '2', nome: 'Maria Souza' },
    { id: '3', nome: 'Pedro Oliveira' },
  ];

  const produtosDisponiveis = [
    { nome: 'Produto A', valor: 100.0 },
    { nome: 'Produto B', valor: 200.0 },
    { nome: 'Produto C', valor: 150.0 },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setServico({
      ...servico,
      [name]: value,
    });
  };

  const handleAddProduto = (produto) => {
    setServico({
      ...servico,
      produtos: [...servico.produtos, produto],
    });
  };

  const handleRemoveProduto = (index) => {
    const produtosAtualizados = servico.produtos.filter((_, i) => i !== index);
    setServico({
      ...servico,
      produtos: produtosAtualizados,
    });
  };

  const handleUpdateQuantidade = (index, quantidade) => {
    const produtosAtualizados = servico.produtos.map((prod, i) =>
      i === index ? { ...prod, quantidade: quantidade > 0 ? quantidade : 1 } : prod
    );
    setServico({
      ...servico,
      produtos: produtosAtualizados,
    });
  };

  const validarCampos = () => {
    let valid = true;
    const newErrors = {
      pessoaFisica: '',
      dataEntrada: '',
      valorServico: '',
    };

    if (!servico.pessoaFisica) {
      newErrors.pessoaFisica = 'É obrigatório selecionar uma pessoa física.';
      valid = false;
    }

    if (!servico.dataEntrada) {
      newErrors.dataEntrada = 'A data de entrada é obrigatória.';
      valid = false;
    }

    if (!servico.valorServico || parseFloat(servico.valorServico.replace(/[^\d.-]/g, '')) <= 0) {
      newErrors.valorServico = 'O valor do serviço é obrigatório e deve ser maior que zero.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validarCampos()) {
      console.log('Serviço cadastrado:', servico);
    }
  };

  const handleCancel = () => {
    setServico({
      pessoaFisica: '',
      dataEntrada: '',
      dataEntrega: '',
      valorServico: '',
      produtos: [],
    });
    setErrors({
      pessoaFisica: '',
      dataEntrada: '',
      valorServico: '',
    });
  };

  return (
    <FormFrame
      title="Cadastro de Serviço"
      formData={[
        <PessoaFisicaAutoComplete
          fullWidth={true} 
          pessoaFisicaSelecionada={servico.pessoaFisica} 
          onChange={handleChange} 
          errors={errors}
          helperText={errors.pessoaFisica}
          listaPessoasFisicas={pessoasFisicas}
        />,
        <DatasServico servico={servico} handleChange={handleChange} errors={errors} key="datas" />,
        <ValorServico
          servico={servico}
          handleChange={handleChange}
          errors={errors}
          key="valorServico"
        />,
        <ListaProdutos
          servico={servico}
          handleAddProduto={handleAddProduto}
          handleRemoveProduto={handleRemoveProduto}
          handleUpdateQuantidade={handleUpdateQuantidade}
          produtosDisponiveis={produtosDisponiveis}
          key="produtos"
        />,
      ]}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
