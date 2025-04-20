import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, List, ListItem, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import pessoaService from '../../services/pessoaFisicaService';

const PessoaInfiniteList = () => {
  const [pessoas, setPessoas] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const { ref, inView } = useInView();
  const travado = useRef(false);

  const itensPorPagina = 10;

  useEffect(() => {
    const carregarPessoas = async () => {
      if (!temMais || carregando || travado.current) return;

      setCarregando(true);
      travado.current = true;

      try {
        const res = await pessoaService.getPaginated(pagina, itensPorPagina);
        const novos = Array.isArray(res.data.content) ? res.data.content : [];

        // Evita duplicatas com base no id
        setPessoas((prev) => {
          const idsExistentes = new Set(prev.map((p) => p.id));
          const novosUnicos = novos.filter((p) => !idsExistentes.has(p.id));
          return [...prev, ...novosUnicos];
        });

        setTemMais(novos.length === itensPorPagina);
      } catch (error) {
        console.error('Erro ao carregar pessoas:', error);
      } finally {
        setCarregando(false);
        travado.current = false;
      }
    };

    carregarPessoas();
  }, [pagina]);

  useEffect(() => {
    if (inView && temMais && !carregando && !travado.current) {
      setPagina((prev) => prev + 1);
    }
  }, [inView, temMais, carregando]);

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Lista de Pessoas</Typography>
      <List>
        {pessoas.map((pessoa) => (
          <ListItem key={pessoa.id}>{pessoa.nome}</ListItem>
        ))}
      </List>

      <div ref={ref} />

      {carregando && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!temMais && !carregando && (
        <Typography align="center" color="textSecondary" mt={2}>
          Fim da lista
        </Typography>
      )}
    </Box>
  );
};

export default PessoaInfiniteList;
