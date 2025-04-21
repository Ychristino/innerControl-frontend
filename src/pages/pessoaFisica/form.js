import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
  Autocomplete
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import DeleteIcon from "@mui/icons-material/Delete";
import paisService from "../../services/paisService";
import estadoService from "../../services/estadoService";
import ConfirmDialog from "../../components/ConfirmDialog";
import { InputCPF } from "../../components/cpfInput";
import { InputCEP } from "../../components/cepInput";
import { InputContato } from "../../components/contatoInput";


export default function FormularioPessoa({ dadosIniciais = null, onSubmit }) {
  const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null });
  const [paises, setPaises] = useState([]);
  const [estadosMap, setEstadosMap] = useState({});

  useEffect(() => {
    paisService.getAllNoPaginated()
      .then((response) => {
        setPaises(response.data.content)
      })
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: dadosIniciais || {
      nome: "",
      cpf: "",
      dataNascimento: "",
      enderecos: [
        {
          logradouro: "",
          numero: "",
          complemento: "",
          cep: "",
          cidade: {
            nome: "",
            estado: {
              nome: "",
              sigla: "",
              pais: { nome: "", id: "" },
            },
            pais: { nome: "", id: "" },
          },
        },
      ],
      contatos: [
        {
          tipo: "",
          valor: "",
        },
      ],
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name?.includes("cidade.estado.pais")) {
        const match = name.match(/^enderecos\.(\d+)\.cidade\.estado\.pais$/);
        if (match) {
          const index = match[1];
          const pais = value.enderecos?.[index]?.cidade?.estado?.pais;
          const paisId = pais?.id;
  
          loadEstados(paisId);
        }
      }
    });
  
    return () => subscription.unsubscribe();
  }, [watch, estadosMap]);

  const loadEstados = async (idPais) => {
    if (!idPais) return;

    if (estadosMap[idPais]){
      setEstadosMap((prev) => ({ ...prev, [idPais]: estadosMap[idPais] }));
      return ;
    }

    // Só vai no banco se não tiver sido carregado antes...
    estadoService.getAllFromSpecificCountryNoPaginated(idPais)
      .then((response) => {
        setEstadosMap((prev) => ({ ...prev, [idPais]: response.data }));
      });
  };

  const {
    fields: enderecosFields,
    append: appendEndereco,
    remove: removeEndereco,
  } = useFieldArray({ control, name: "enderecos" });

  const {
    fields: contatosFields,
    append: appendContato,
    remove: removeContato,
  } = useFieldArray({ control, name: "contatos" });

  const confirmarRemocao = (callback) => {
    setConfirmDialog({
      open: true,
      onConfirm: () => {
        callback();
        setConfirmDialog({ open: false, onConfirm: null });
      },
    });
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Cadastro de Pessoa</Typography>
      
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 12 }}>
          <TextField fullWidth label="Nome" {...register("nome", { required: true })} error={!!errors.nome} helperText={errors.nome && "Campo obrigatório"} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <InputCPF control={control} name="cpf" />
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="date"
            label="Data de Nascimento"
            InputLabelProps={{ shrink: true }}
            {...register("dataNascimento", { required: true })}
            error={!!errors.dataNascimento}
            helperText={errors.dataNascimento && "Campo obrigatório"}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4}>Endereços</Typography>
      {enderecosFields.map((field, index) => {
        const paisSelecionado = watch(`enderecos.${index}.cidade.estado.pais.id`);

        return (
          <Paper key={field.id} sx={{ p: 2, mb: 2 }} elevation={3}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 4 }}>
                <InputCEP control={control} name="enderecos.0.cep" />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name={`enderecos.${index}.cidade.estado.pais`}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        fullWidth
                        options={paises}
                        getOptionLabel={(option) => option.nome || ""}
                        value={value}
                        onChange={(_, newValue) => {
                          onChange({ nome: newValue?.nome || "", id: newValue?.id || "" });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="País" error={!!errors.enderecos?.[index]?.cidade?.estado?.pais} helperText={errors.enderecos?.[index]?.cidade?.estado?.pais && "Campo obrigatório"} />
                        )}
                      />
                    )}
                  />
              </Grid>

              <Grid item size={{ xs: 6, md: 6 }}>
                <Controller
                  control={control}
                  name={`enderecos.${index}.cidade.estado`}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      options={estadosMap[paisSelecionado] || []}
                      getOptionLabel={(option) => option.nome || ""}
                      value={value}
                      onChange={(_, newValue) => {
                        onChange({
                          nome: newValue?.nome || "",
                          sigla: newValue?.sigla || "",
                          pais: newValue?.pais || { nome: "", id: "" },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Estado" error={!!errors.enderecos?.[index]?.cidade?.estado} helperText={errors.enderecos?.[index]?.cidade?.estado && "Campo obrigatório"} />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item size={{ xs: 12, md: 12 }}>
                <TextField fullWidth label="Cidade" {...register(`enderecos.${index}.cidade.nome`, { required: true })} error={!!errors.enderecos?.[index]?.cidade?.nome} helperText={errors.enderecos?.[index]?.cidade?.nome && "Campo obrigatório"} />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item size={{ xs: 12, md: 8 }}>
                <TextField fullWidth label="Logradouro" {...register(`enderecos.${index}.logradouro`, { required: true })} error={!!errors.enderecos?.[index]?.logradouro} helperText={errors.enderecos?.[index]?.logradouro && "Campo obrigatório"} />
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Número" {...register(`enderecos.${index}.numero`, { required: true })} error={!!errors.enderecos?.[index]?.numero} helperText={errors.enderecos?.[index]?.numero && "Campo obrigatório"} />
              </Grid>
              <Grid item size={{ xs: 12, md: 12 }}>
                <TextField fullWidth label="Complemento" {...register(`enderecos.${index}.complemento`, { required: false })} error={!!errors.enderecos?.[index]?.complemento} helperText={errors.enderecos?.[index]?.complemento && "Campo obrigatório"} />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item size={{ xs: 12, md: 3 }} offset={9}>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => confirmarRemocao(() => removeEndereco(index))}
                  fullWidth
                  >
                  <DeleteIcon fontSize="small"/>
                  Remover Endereço
                </Button>
              </Grid>
            </Grid>
          </Paper>
        );
      })}
      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Button variant="outlined" onClick={() => appendEndereco({
            logradouro: "",
            numero: "",
            complemento: "",
            cep: "",
            cidade: {
              nome: "",
              estado: {
                nome: "",
                sigla: "",
                pais: { nome: "", id: "" }
              },
              pais: { nome: "", id: "" }
            }
          })}
            fullWidth
          >
            Adicionar Endereço
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4}>Contatos</Typography>
        {contatosFields.map((field, index) => (
          <Paper key={field.id} sx={{ p: 2, mb: 2 }} elevation={3}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Tipo"
                  {...register(`contatos.${index}.tipo`, { required: true })}
                  error={!!errors.contatos?.[index]?.tipo}
                  helperText={errors.contatos?.[index]?.tipo && "Campo obrigatório"}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="telefone">Telefone</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item size={{ xs: 12, md: 12 }}>
                <InputContato
                  control={control}
                  name={`contatos.${index}.valor`}
                  tipoContato={watch(`contatos.${index}.tipo`)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item size={{ xs: 12, md: 3 }} offset={9}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => confirmarRemocao(() => removeContato(index))}
                  fullWidth
                >
                  <DeleteIcon fontSize="small" />
                  Remover Contato
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      <Grid container spacing={2} marginTop={2}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Button variant="outlined" onClick={() => appendContato({ tipo: "", valor: "" })} fullWidth>Novo Contato</Button>
        </Grid>
      </Grid>

      <Box mt={4} fullWidth>
        <Button variant="outlined" type="submit" color="success" fullWidth>Salvar Pessoa</Button>
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

