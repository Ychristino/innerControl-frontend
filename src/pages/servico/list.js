import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Grid,
    Collapse,
    TableCell,
    TableRow,
    TableContainer,
    Table,
    TableHead,
    TableBody,
  } from "@mui/material";
  import { useEffect, useState, useRef } from "react";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import { useNavigate } from "react-router-dom";
  import servicoService from "../../services/servicoService";
  import { NOTIFICATIONS } from "../../constants/notifications";
  import { monetaryFormat } from "../../utils/format";
  
  export default function ListaServicos({ systemNotification }) {
    const [servicos, setServicos] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null });
  
    const [filtroNome, setFiltroNome] = useState("");
    const [dataEntrada, setDataEntrada] = useState("");
    const [dataEntrega, setDataEntrega] = useState("");
  
    const navigate = useNavigate();
    const observerRef = useRef(null);
    const loadingRef = useRef(false);
  
    const fetchServicos = async (pageToLoad = 0) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        const response = await servicoService.getAll(filtroNome, 
                                                     dataEntrada,
                                                     dataEntrega,
                                                     pageToLoad);
        if (response.data.content.length > 0) {
          setServicos((prev) => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
        setPage(pageToLoad + 1);
      } catch (err) {
        console.error("Erro ao buscar serviços", err);
      } finally {
        loadingRef.current = false;
      }
    };
  
    const handleBuscar = () => {
      setPage(0);
      setHasMore(true);
      loadingRef.current = false;
      setServicos([]);
      fetchServicos(0);
    };
  
    const handleRemover = (idServico) => {
      setConfirmDialog({
        open: true,
        onConfirm: async () => {
          try {
            await servicoService.remove(idServico);
            systemNotification && systemNotification("Serviço Excluído!", NOTIFICATIONS.SUCCESS);
            setServicos((prev) => prev.filter((s) => s.id !== idServico));
            setConfirmDialog({ open: false, onConfirm: null });
          } catch (response) {
            systemNotification && systemNotification(`Erro ao excluir serviço! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
          }
        },
      });
    };
  
    useEffect(() => {
      fetchServicos();
    }, []);
  
    useEffect(() => {
      if (!observerRef.current || !hasMore || loadingRef.current) return;
  
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchServicos(page);
        }
      }, {
        threshold: 1.0,
      });
  
      observer.observe(observerRef.current);
  
      return () => observer.disconnect();
    }, [servicos, hasMore, page]);
  
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Lista de Serviços</Typography>
  
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Nome da Pessoa" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField fullWidth label="Data Entrada" type="date" InputLabelProps={{ shrink: true }} value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField fullWidth label="Data Entrega" type="date" InputLabelProps={{ shrink: true }} value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleBuscar}>Buscar</Button>
          </Grid>
        </Grid>
  
        {servicos.map((servico, index) => (
          <Card
            key={servico.id}
            sx={{ mb: 2 }}
            ref={index >= servicos.length - 2 ? observerRef : null}
          >
            <CardContent>
              <Typography variant="h6">{servico.pessoaNome}</Typography>
              <Typography>{servico.descricao}</Typography>
              <Typography>Entrada Serviço: {new Date(servico.dataEntrada).toLocaleDateString()}</Typography>
              <Typography>Entrega Prevista: {new Date(servico.dataEntrega).toLocaleDateString()}</Typography>
  
              <Box mt={2} display="flex" gap={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/servicos/update/${servico.id}`)}
                >
                  Atualizar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemover(servico.id)}
                >
                  Remover
                </Button>
                <Button
                  variant="text"
                  onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
                >
                  {index === expandedIndex ? "Ocultar" : "Ver mais"}
                </Button>
              </Box>
  
              <Collapse in={index === expandedIndex} timeout="auto" unmountOnExit>
                <Box mt={2}>
                    <Typography>Detalhes do Serviço</Typography>
                    {servico.produtosUtilizados?.length > 0 && (
                        <>
                            <TableContainer sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell align="center">Quantidade</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {servico.produtosUtilizados.map((prod, index) => (
                                    <TableRow key={index}>
                                    <TableCell>{prod.nomeProduto}</TableCell>
                                    <TableCell align="center">{prod.quantidade}</TableCell>
                                    <TableCell align="right">
                                        {monetaryFormat(prod.quantidade * prod.valorProduto)}
                                    </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={2} align="right">
                                    <strong>Total Produtos:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                    <strong>
                                        {monetaryFormat(
                                        servico.produtosUtilizados.reduce(
                                            (total, prod) => total + prod.quantidade * prod.valorProduto,
                                            0
                                        )
                                        )}
                                    </strong>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} align="right">
                                    <strong>Valor do Serviço:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                    <strong>{monetaryFormat(servico.valor || 0)}</strong>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} align="right">
                                    <strong>Total Geral:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                    <strong>
                                        {monetaryFormat(
                                        servico.produtosUtilizados.reduce(
                                            (total, prod) => total + prod.quantidade * prod.valorProduto,
                                            0
                                        ) + (servico.valor || 0)
                                        )}
                                    </strong>
                                    </TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
  
        <ConfirmDialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
          onConfirm={confirmDialog.onConfirm}
          title="Confirmar Remoção"
          content="Tem certeza que deseja remover este serviço?"
        />
      </Box>
    );
  }