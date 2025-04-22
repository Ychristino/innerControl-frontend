import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Collapse,
  } from "@mui/material";
  import { useEffect, useState, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import estoqueService from "../../services/estoqueService";
  import { NOTIFICATIONS } from "../../constants/notifications";
  import { monetaryFormat } from "../../utils/format";
  import SearchBar from "../../components/searchBar";
  import QuantityDialog from "../../components/QuantityDialog";
import { ACTIONS } from "../../constants/actions";
  
  export default function ListagemEstoque({ onChangeQuantity }) {
    const [estoque, setEstoque] = useState([]);
    const [page, setPage] = useState(0);
    const [nomeBusca, setNomeBusca] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [quantidade, setQuantidade] = useState(0);
    const [actionType, setActionType] = useState(""); // "adicionar" ou "remover"
  
    const navigate = useNavigate();
  
    const observerRef = useRef(null);
    const loadingRef = useRef(false);
  
    const adicionarEstoqueUnico = (estoqueNovo) => {
      setEstoque((prevEstoque) => {
        const idsExistentes = new Set(prevEstoque.map((e) => e.id));
        const estoqueFiltrado = estoqueNovo.filter((item) => !idsExistentes.has(item.id));
        return [...prevEstoque, ...estoqueFiltrado];
      });
    };
  
    const fetchEstoque = async (pageToLoad = 0, nome = "") => {
      if (loadingRef.current) return;
      loadingRef.current = true;
  
      try {
        const response = await estoqueService.getAll(nome, pageToLoad, 10);
        const novosDados = response.data.content;
  
        if (novosDados.length > 0) {
          adicionarEstoqueUnico(novosDados);
        }
  
        setHasMore(!response.data.last);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Erro ao carregar estoque", error);
      } finally {
        loadingRef.current = false;
      }
    };
  
    const handleBuscar = () => {
      setPage(0);
      setHasMore(true);
      loadingRef.current = false;
      setEstoque([]);
      fetchEstoque(0, nomeBusca);
    };
  
    useEffect(() => {
      fetchEstoque();
    }, []);
  
    useEffect(() => {
      if (!observerRef.current || !hasMore || loadingRef.current) return;
  
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchEstoque(page, nomeBusca);
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
    }, [estoque, hasMore, page, nomeBusca]);
  
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Lista de Estoque</Typography>
  
        <SearchBar 
          value={nomeBusca} 
          onSearchChange={setNomeBusca} 
          onSearchClick={handleBuscar} 
        />
  
        {estoque.map((item, index) => {
          const isLastOrSecondLast = index >= estoque.length - 2;
          return (
            <Card
              key={item.id}
              sx={{ mb: 2 }}
              ref={isLastOrSecondLast ? observerRef : null}
            >
              <CardContent>
                <Typography variant="h6">{item.produto.nome.toUpperCase()}</Typography>
                <Typography>Quantidade: {item.quantidade}</Typography>
                <Typography>Preço de Custo: R$ {monetaryFormat(item.produto.precoCusto)}</Typography>
                <Typography>Preço de Venda: R$ {monetaryFormat(item.produto.precoVenda)}</Typography>
  
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/produtos/update/${item.produto.id}`)}
                  >
                    Atualizar Produto
                  </Button>
  
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      setSelectedProduto(item.produto);
                      setActionType(ACTIONS.ADICIONAR);
                      setQuantityDialogOpen(true);
                    }}
                  >
                    Adicionar Itens
                  </Button>
  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setSelectedProduto(item.produto);
                      setActionType(ACTIONS.REMOVER);
                      setQuantityDialogOpen(true);
                    }}
                  >
                    Remover Itens
                  </Button>
                </Box>
  
                <Collapse in={index === expandedIndex} timeout="auto" unmountOnExit>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Descrição:</Typography>
                    <Typography>{item.produto.descricao}</Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
  
        {/* Dialog para Adicionar ou Remover Quantidade */}
        <QuantityDialog
            open={quantityDialogOpen}
            onClose={() => setQuantityDialogOpen(false)}
            onConfirm={() => {
                onChangeQuantity?.({
                produto: selectedProduto,
                quantidade,
                acao: actionType,
                });
                setQuantityDialogOpen(false);
                setQuantidade(0); // resetar para evitar valores anteriores
            }}
            title={actionType === "adicionar" ? "Adicionar Itens" : "Remover Itens"}
            content={`Insira a quantidade a ${actionType === ACTIONS.ADICIONAR ? "adicionar" : "remover"} do estoque.`}
            quantity={quantidade}
            setQuantity={setQuantidade}
        />
      </Box>
    );
  }
  