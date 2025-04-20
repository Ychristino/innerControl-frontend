import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import paisService from '../services/paisService';
import estadoService from '../services/estadoService';

const AutocompletePaisesEstados = () => {
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [paisSelecionado, setPaisSelecionado] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [loadingPaises, setLoadingPaises] = useState(false);
  const [loadingEstados, setLoadingEstados] = useState(false);

  useEffect(() => {
    setLoadingPaises(true);
    paisService.getAll()
      .then(res => setPaises(res.data))
      .catch(err => console.error('Erro ao carregar países:', err))
      .finally(() => setLoadingPaises(false));
  }, []);

  useEffect(() => {
    if (paisSelecionado) {
      setLoadingEstados(true);
      estadoService.getByPais(paisSelecionado.id)
        .then(res => setEstados(res.data))
        .catch(err => console.error('Erro ao carregar estados:', err))
        .finally(() => setLoadingEstados(false));
    } else {
      setEstados([]);
    }
  }, [paisSelecionado]);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <Autocomplete
        options={paises}
        getOptionLabel={(option) => option.nome}
        onChange={(e, newValue) => {
          setPaisSelecionado(newValue);
          setEstadoSelecionado(null);
        }}
        loading={loadingPaises}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione um País"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingPaises ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <div style={{ marginTop: 20 }}>
        <Autocomplete
          options={estados}
          getOptionLabel={(option) => option.nome}
          onChange={(e, newValue) => setEstadoSelecionado(newValue)}
          value={estadoSelecionado}
          disabled={!paisSelecionado}
          loading={loadingEstados}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione um Estado"
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingEstados ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default AutocompletePaisesEstados;
