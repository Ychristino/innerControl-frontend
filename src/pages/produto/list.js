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
  import { useEffect, useState, useRef } from "react";
  import ConfirmDialog from "../../components/ConfirmDialog";
  import { useNavigate } from "react-router-dom";
  import produtoService from "../../services/produtoService";
  import { NOTIFICATIONS } from "../../constants/notifications";
  import { monetaryFormat } from "../../utils/format";
import SearchBar from "../../components/searchBar";
  
  export default function ListagemProdutos({ systemNotification }) {
    const [produtos, setProdutos] = useState([]);
    const [page, setPage] = useState(0);
    const [nomeBusca, setNomeBusca] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null });
  
    const navigate = useNavigate();
  
    const observerRef = useRef(null);
    const loadingRef = useRef(false); // Controle de carregamento para evitar chamadas simultâneas
    const loadedProductIds = useRef(new Set()); // Para controlar os produtos já carregados
  
    // Função para adicionar novos produtos ao estado sem duplicação
    const adicionarProdutosUnicos = (produtosNovos) => {
      setProdutos((prevProdutos) => {
        const idsExistentes = new Set(prevProdutos.map((p) => p.id)); // IDs dos produtos já na lista
        const produtosFiltrados = produtosNovos.filter((produto) => !idsExistentes.has(produto.id));
        return [...prevProdutos, ...produtosFiltrados]; // Adiciona apenas os novos produtos
      });
    };
  
    const fetchProdutos = async (pageToLoad = 0, nome = "") => {
      if (loadingRef.current) return; // Se já estiver carregando, não faz nova requisição
      loadingRef.current = true; // Marca que está carregando
  
      try {
        const response = await produtoService.getAll(nome, pageToLoad, 10);
        const novosDados = response.data.content;
  
        if (novosDados.length > 0) {
          adicionarProdutosUnicos(novosDados); // Adiciona os novos produtos
        }
  
        setHasMore(!response.data.last); // Atualiza a variável de controle de mais dados
        setPage(pageToLoad + 1); // Atualiza a página para o próximo carregamento
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      } finally {
        loadingRef.current = false; // Marca que o carregamento foi finalizado
      }
    };
  
    const handleBuscar = () => {
      setPage(0);
      setHasMore(true);
      loadingRef.current = false; // Reseta o controle de carregamento
      loadedProductIds.current.clear(); // Limpa o Set ao buscar novamente
      setProdutos([]); // Limpa os produtos ao fazer uma nova busca
      fetchProdutos(0, nomeBusca);
    };
  
    const handleRemover = (idProduto) => {
      setConfirmDialog({
        open: true,
        onConfirm: async () => {
          try {
            await produtoService.remove(idProduto);
            if (systemNotification) {
              systemNotification("Produto Excluído!", NOTIFICATIONS.SUCCESS);
            }
            setProdutos((prev) => prev.filter((p) => p.id !== idProduto)); // Remove o produto da lista
            setConfirmDialog({ open: false, onConfirm: null });
          } catch (response) {
            if (systemNotification) {
              systemNotification(`Erro ao excluir produto! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
            }
          }
        },
      });
    };
  
    useEffect(() => {
      fetchProdutos(); // Carrega produtos na inicialização
    }, []);
  
    useEffect(() => {
      if (!observerRef.current || !hasMore || loadingRef.current) return; // Não inicia o observer se não houver mais produtos ou estiver carregando
  
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchProdutos(page, nomeBusca); // Carrega mais produtos quando atingir o final da lista
          }
        },
        {
          threshold: 1.0, // Garante que o scroll chegue até o final
        }
      );
  
      observer.observe(observerRef.current);
  
      return () => {
        if (observerRef.current) observer.unobserve(observerRef.current); // Desfaz a observação ao sair do componente
      };
    }, [produtos, hasMore, page, nomeBusca]); // Sempre que houver mudança nos produtos ou na página, o observer será ajustado
  
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Lista de Produtos</Typography>
  
        <SearchBar 
            value={nomeBusca} 
            onSearchChange={setNomeBusca} 
            onSearchClick={handleBuscar} 
        />
  
        {produtos.map((produto, index) => {
          const isLastOrSecondLast = index >= produtos.length - 2;
          return (
            <Card
              key={produto.id}
              sx={{ mb: 2 }}
              ref={isLastOrSecondLast ? observerRef : null} // Referência ao penúltimo item para o Infinite Scroll
            >
              <CardContent>
                <Typography variant="h6">{produto.nome}</Typography>
                <Typography>Preço: {monetaryFormat(produto.precoVenda)}</Typography>
  
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/produtos/update/${produto.id}`)}
                  >
                    Atualizar
                  </Button>
  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemover(produto.id)}
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
                    {produto.descricao && (
                      <>
                        <Typography variant="subtitle1">Descrição:</Typography>
                        <Typography>{produto.descricao}</Typography>
                      </>
                    )}
                    <Typography>Valor de compra: {monetaryFormat(produto.precoCusto)}</Typography>
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
          content="Tem certeza que deseja remover este produto?"
        />
      </Box>
    );
  }
  