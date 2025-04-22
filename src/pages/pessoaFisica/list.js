import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Collapse,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import pessoaService from "../../services/pessoaFisicaService";
import { NOTIFICATIONS } from "../../constants/notifications";
import SearchBar from "../../components/searchBar";

export default function ListagemPessoasFisicas({ systemNotification }) {
  const [pessoas, setPessoas] = useState([]);
  const [page, setPage] = useState(0);
  const [nomeBusca, setNomeBusca] = useState("");
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null });

  const navigate = useNavigate();

  const observerRef = useRef(null);

  const fetchPessoas = async (pageToLoad = 0, nome = "") => {
    const response = await pessoaService.getAll(nome, pageToLoad, 10);
    const novosDados = response.data.content;

    if (pageToLoad === 0) {
      setPessoas(novosDados);
    } else {
      setPessoas((prev) => [...prev, ...novosDados]);
    }

    setHasMore(!response.data.last);
    setPage(pageToLoad + 1);
  };

  const handleBuscar = () => {
    setPage(0);
    setHasMore(true);
    setBuscaAtiva(true);
    fetchPessoas(0, nomeBusca);
  };

  const handleRemover = (idPessoa) => {
    setConfirmDialog({
      open: true,
      onConfirm: async () => {
        await pessoaService.remove(idPessoa)
          .then(() => {
            if (systemNotification)
              systemNotification("Pessoa Excluída!", NOTIFICATIONS.SUCCESS);
          })
          .catch((response) => {
            if (systemNotification)
              systemNotification(`Erro ao excluir pessoa! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
          });

        setPessoas((prev) => prev.filter((p) => p.id !== idPessoa));
        setConfirmDialog({ open: false, onConfirm: null });
      },
    });
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPessoas(page, nomeBusca);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [pessoas, hasMore, page, nomeBusca]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Lista de Pessoas Físicas</Typography>

      <SearchBar
          value={nomeBusca} 
          onSearchChange={setNomeBusca} 
          onSearchClick={handleBuscar} 
      />
      

      {pessoas.map((pessoa, index) => {
        const isLastOrSecondLast = index >= pessoas.length - 2;
        return (
          <Card
            key={pessoa.id}
            sx={{ mb: 2 }}
            ref={isLastOrSecondLast ? observerRef : null}
          >
            <CardContent>
              <Typography variant="h6">{pessoa.nome}</Typography>
              <Typography>CPF: {pessoa.cpf}</Typography>
              {pessoa.contatos?.length > 0 && (
                <Typography>Contato: {pessoa.contatos[0].valor}</Typography>
              )}

              <Box mt={2} display="flex" gap={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/pessoafisica/udpate/${pessoa.id}`)}
                >
                  Atualizar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemover(pessoa.id)}
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
                  <Typography variant="subtitle1">Contatos:</Typography>
                  {pessoa.contatos?.map((c, i) => (
                    <Typography key={i}>{c.tipo}: {c.valor}</Typography>
                  ))}

                  <Typography variant="subtitle1" mt={2}>Endereços:</Typography>
                  {pessoa.enderecos?.map((e, i) => (
                    <Box key={i} mb={1}>
                      <Typography>{e.logradouro}, {e.numero} - {e.cidade?.nome}/{e.cidade?.estado?.sigla}</Typography>
                      <Typography>CEP: {e.cep}</Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        );
      })}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
        title="Confirmar Remoção"
        content="Tem certeza que deseja remover esta pessoa?"
      />
    </Box>
  );
}
