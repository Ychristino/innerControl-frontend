import { useForm, Controller } from "react-hook-form";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { MonetaryInput } from "../../components/monetaryInput";

export default function FormularioProduto({ dadosIniciais = null, onSubmit }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: dadosIniciais || {
      nome: "",
      descricao: "",
      precoCusto: "",
      precoVenda: "",
      quantidadeInicial: "",
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Cadastro de Produto</Typography>
      
      <Paper sx={{ p: 3 }} elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              {...register("nome", { required: true })}
              error={!!errors.nome}
              helperText={errors.nome && "Campo obrigatório"}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Descrição"
              {...register("descricao", { required: false })}
              error={!!errors.descricao}
              helperText={errors.descricao && "Campo obrigatório"}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MonetaryInput control={control} name="precoCusto" label="Preço de Custo" required />
          </Grid>

          <Grid item xs={12} md={6}>
            <MonetaryInput control={control} name="precoVenda" label="Preço de Venda" required />
          </Grid>

          {/* Condicionalmente renderiza o campo "Quantidade Inicial" */}
          {!dadosIniciais && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantidade Inicial"
                {...register("quantidadeInicial", { required: true, min: 0 })}
                error={!!errors.quantidadeInicial}
                helperText={errors.quantidadeInicial && "Campo obrigatório"}
              />
            </Grid>
          )}
        </Grid>

        <Box mt={4}>
          <Button type="submit" variant="outlined" color="success" fullWidth>
            {dadosIniciais ? "Atualizar Produto" : "Salvar Produto"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
