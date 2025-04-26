import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import authService from '../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    authService.login({ email, senha: password })
    .then(response=>{
      login(response);
      navigate('/');
    })
    .catch(err=>{
      setError(`Erro ao fazer login: ${error.message || error}`)
    })

  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          mt: 8,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Senha"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Entrar
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Não tem uma conta? <Button color="primary">Cadastrar</Button>
            </Typography>
          </Grid>
        </Grid> */}
      </Box>
    </Container>
  );
};

export default LoginPage;
