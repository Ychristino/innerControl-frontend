import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Autocomplete,
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../components/ConfirmDialog";
import { MonetaryInput } from "../../components/monetaryInput";
import produtoService from "../../services/produtoService";
import pessoaService from "../../services/pessoaFisicaService";
import { formatDate, monetaryFormat } from "../../utils/format";

export default function FormularioServico({ dadosIniciais = null, onSubmit }) {
  const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null });
  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    produtoService.getAllNoPaginated()
      .then((response) => {
        setProdutos(response.data);
      });

    pessoaService.getAllNoPaginated()
      .then((response) => {
        setPessoas(response.data);
      });
  }, []);

  const formDefaults = dadosIniciais
  ? {
      ...dadosIniciais,
      dataEntrada: formatDate(dadosIniciais.dataEntrada),
      dataEntrega: formatDate(dadosIniciais.dataEntrega),
    }
  : {
      descricao: "",
      dataEntrada: "",
      dataEntrega: "",
      valor: 0,
      pessoaId: null,
      produtosUtilizados: [],
    };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: formDefaults,
  });

  const produtosUtilizados = watch("produtosUtilizados");

  const {
    fields: produtosUtilizadosFields,
    append: appendProduto,
    remove: removeProduto,
  } = useFieldArray({ control, name: "produtosUtilizados" });

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);

  const confirmarRemocao = (callback) => {
    setConfirmDialog({
      open: true,
      onConfirm: () => {
        callback();
        setConfirmDialog({ open: false, onConfirm: null });
      },
    });
  };

  const handleAddProduto = () => {
    if (produtoSelecionado) {
      appendProduto({
        idProduto: produtoSelecionado.id,
        quantidade: quantidadeProduto,
        valorProduto: produtoSelecionado.precoVenda || 0,
      });
      setProdutoSelecionado(null);
      setQuantidadeProduto(1);
    }
  };

  const calcularTotalItem = (quantidade, valor) => quantidade * valor;

  const calcularTotalGeral = () => {
    const totalProdutos = produtosUtilizados.reduce((total, field) => {
      const produto = produtos.find((prod) => prod.id === field.idProduto);
      return total + calcularTotalItem(field.quantidade, field.valorProduto || 0);
    }, 0);
  
    const valorServico = Number(watch("valor")) || 0;
  
    return totalProdutos + valorServico;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Cadastro de Serviço</Typography>


      <Typography variant="h6" mt={4}>Pessoa Física</Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{xs: 12}}>
          <Controller
            control={control}
            name="pessoaId"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                fullWidth
                options={pessoas}
                getOptionLabel={(option) => option.nome || ""}
                value={pessoas.find((p) => p.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue?.id || null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pessoa Física"
                    error={!!errors.pessoaId}
                    helperText={errors.pessoaId && "Campo obrigatório"}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4}>Dados do serviço</Typography>
      <Grid container spacing={2}>
        <Grid item size={{xs: 12}}>
          <TextField
            fullWidth
            label="Descrição do Serviço"
            {...register("descricao", { required: true })}
            error={!!errors.descricao}
            helperText={errors.descricao && "Campo obrigatório"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            type="date"
            label="Data de Entrada"
            InputLabelProps={{ shrink: true }}
            {...register("dataEntrada", { required: true })}
            error={!!errors.dataEntrada}
            helperText={errors.dataEntrada && "Campo obrigatório"}
          />
        </Grid>
        <Grid item size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            type="date"
            label="Data de Entrega"
            InputLabelProps={{ shrink: true }}
            {...register("dataEntrega", { required: true })}
            error={!!errors.dataEntrega}
            helperText={errors.dataEntrega && "Campo obrigatório"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{xs: 12, md: 6}}>
          <MonetaryInput
            control={control}
            name="valor"
            label="Valor do serviço"
            rules={{ required: "Campo obrigatório" }}
            fullWidth
            error={!!errors.valor}
            helperText={errors.valor && "Campo obrigatório"}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4}>Produtos Utilizados</Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{xs: 12}}>
          <Controller
            control={control}
            name="produtoSelecionado"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={produtos}
                getOptionLabel={(option) => option.nome || ""}
                value={produtoSelecionado || null}
                onChange={(_, newValue) => setProdutoSelecionado(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Selecione um Produto" />
                )}
              />
            )}
          />
        </Grid>
        <Grid item size={{xs: 12}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduto}
            fullWidth
          >
            Adicionar Produto
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 4 }} elevation={3}>
        <Grid container spacing={2}>
          <Grid item size={{xs: 12}}>
            <Typography variant="h6">Lista de Produtos</Typography>
          </Grid>
          <Grid item size={{xs: 12}}>
            <Grid container spacing={2}>
              <Grid item size={{xs: 4}}><Typography>Produto</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Valor</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Quantidade</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Total</Typography></Grid>
              <Grid item size={{xs: 2}}></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item size={{xs: 4}}><Typography>Produto</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Valor Unitário</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Quantidade</Typography></Grid>
              <Grid item size={{xs: 2}}><Typography>Total</Typography></Grid>
              <Grid item size={{xs: 2}}></Grid>
            </Grid>

            {produtosUtilizados.map((field, index) => (
              <Box key={index}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item size={{xs: 4}}>
                    <Typography>
                      {produtos.find((prod) => prod.id === field.idProduto)?.nome || ""}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 2}}>
                    <Controller
                      control={control}
                      name={`produtosUtilizados.${index}.valorProduto`}
                      render={({ field: valorField }) => (
                        <TextField
                          type="number"
                          inputProps={{ min: 0, step: "0.01" }}
                          {...valorField}
                          onChange={(e) => valorField.onChange(Number(e.target.value))}
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item size={{xs: 2}}>
                    <Controller
                      control={control}
                      name={`produtosUtilizados.${index}.quantidade`}
                      render={({ field: quantidadeField }) => (
                        <TextField
                          type="number"
                          inputProps={{ min: 0 }}
                          {...quantidadeField}
                          onChange={(e) =>
                            quantidadeField.onChange(Math.max(0, Number(e.target.value)))
                          }
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item size={{xs: 2}}>
                    <Typography>
                      {monetaryFormat(calcularTotalItem(field.quantidade, field.valorProduto))}
                    </Typography>
                  </Grid>
                  <Grid item size={{xs: 2}}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => confirmarRemocao(() => removeProduto(index))}
                      fullWidth
                    >
                      Remover Item
                    </Button>
                  </Grid>
                </Grid>
                {index < produtosUtilizados.length - 1 && <Box my={1}><hr /></Box>}
              </Box>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid item size={{xs: 12}} textAlign="right">
            <Typography variant="h6">Total Geral: {monetaryFormat(calcularTotalGeral())}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={4}>
        <Button variant="outlined" type="submit" color="success" fullWidth>
          Salvar Serviço
        </Button>
      </Box>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        title="Confirmar Remoção"
        content="Tem certeza que deseja remover este item?"
      />
    </Box>
  );
}
