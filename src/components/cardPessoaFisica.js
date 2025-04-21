import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';

export default function PessoaCard({ pessoa }) {
  const [expanded, setExpanded] = useState(false);  // Estado para controlar a expansão do card

  // Função para alternar a expansão do card
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      {/* Informações básicas */}
      <Typography variant="h6">{pessoa.nome}</Typography>
      <Typography variant="body2">CPF: {pessoa.cpf}</Typography>
      <Typography variant="body2">
        {pessoa.contatos && pessoa.contatos.length > 0 ? `Contato: ${pessoa.contatos[0].valor}` : 'Sem contatos'}
      </Typography>

      {/* Botão para expandir/colapsar */}
      <Button onClick={toggleExpand} variant="outlined" color="primary" size="small">
        {expanded ? 'Ver Menos' : 'Ver Mais'}
      </Button>

      {/* Detalhes expandidos */}
      {expanded && (
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <Typography variant="body1"><strong>Endereço:</strong></Typography>
            <Typography variant="body2">Rua: {pessoa.endereco?.logradouro}</Typography>
            <Typography variant="body2">Número: {pessoa.endereco?.numero}</Typography>
            <Typography variant="body2">Complemento: {pessoa.endereco?.complemento}</Typography>
            <Typography variant="body2">CEP: {pessoa.endereco?.cep}</Typography>
          </Grid>

          {/* Outros detalhes, como contatos adicionais */}
          <Grid item xs={12}>
            <Typography variant="body1"><strong>Contatos adicionais:</strong></Typography>
            {pessoa.contatos && pessoa.contatos.length > 1 ? (
              pessoa.contatos.slice(1).map((contato, index) => (
                <Typography key={index} variant="body2">{contato.tipo}: {contato.valor}</Typography>
              ))
            ) : (
              <Typography variant="body2">Nenhum outro contato registrado.</Typography>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
}
