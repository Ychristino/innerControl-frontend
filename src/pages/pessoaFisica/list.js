import React, { useState, useEffect } from 'react';
import { TextField, Paper, Grid, Typography, CircularProgress, Button } from '@mui/material';
import pessoaService from '../../services/pessoaFisicaService';
import PessoaCard from '../../components/cardPessoaFisica';

export default function ListaPessoas() {
  const [pessoas, setPessoas] = useState([]);  // Dados carregados da API
  const [filteredPessoas, setFilteredPessoas] = useState([]);  // Dados filtrados localmente com base na busca
  const [search, setSearch] = useState("");  // Estado da busca
  const [loading, setLoading] = useState(false);  // Flag para controle do estado de carregamento

  // Função para carregar pessoas da API
  const loadPessoas = async () => {
    setLoading(true);
    try {
      const res = await pessoaService.getPaginated();  // Carrega as primeiras 10 pessoas
      setPessoas(res.data.content);  // Atualiza o estado com as pessoas recebidas
      setFilteredPessoas(res.data.content);  // Inicialmente, todos os dados estão visíveis
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de busca local (apenas nos dados carregados)
  useEffect(() => {
    if (search === "") {
      setFilteredPessoas(pessoas);  // Se a busca estiver vazia, mostra todos os dados
    } else {
      setFilteredPessoas(
        pessoas.filter((pessoa) =>
          pessoa.nome.toLowerCase().includes(search.toLowerCase())  // Filtra por nome
        )
      );
    }
  }, [search, pessoas]);

  // Carrega as pessoas quando o componente é montado
  useEffect(() => {
    loadPessoas();  // Carrega as pessoas da primeira página
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Lista de Pessoas</Typography>

      {/* Campo de busca */}
      <TextField
        fullWidth
        label="Buscar por nome"
        value={search}
        onChange={(e) => setSearch(e.target.value)}  // Atualiza o estado de busca
        variant="outlined"
        margin="normal"
      />

      {/* Exibe um carregamento enquanto os dados estão sendo carregados */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          {/* Exibe as pessoas filtradas */}
          {filteredPessoas.map((pessoa) => (
            <Grid item xs={12} key={pessoa.id}>
              <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                <PessoaCard pessoa={pessoa} />  {/* Componente para exibir os dados básicos */}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
