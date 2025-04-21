import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PersonIcon from '@mui/icons-material/Person';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConstructionIcon from '@mui/icons-material/Construction';
import PessoaFisicaIndex from './pessoaFisica';
import ServicoIndex from './servico';
import ProdutoIndex from './produto';
import EstoqueIndex from './estoque';
import PessoaFisicaForm from './pessoaFisica/form';
import ProdutoForm from './produto/form';
import ServicoForm from './servico/form';
import { handleSubmit as pessoaFisicaSubmit } from '../controllers/pessoaFisica';
import { handleSubmit as produtoSubmit } from '../controllers/produto';
import SnackbarMessage from '../components/snackBarMessage';
import { Slide } from '@mui/material';
import ListaPessoas from './pessoaFisica/list';

const mainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? 'InnerControl' : `InnerControl - Controle de serviços`}
    </Typography>
  );
}

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function PessoaFisica() {
  return <Typography>Página de Cadastro de Pessoa Física</Typography>;
}

function ListarPessoas() {
  return <Typography>Lista de Pessoas</Typography>;
}

function Produtos() {
  return <Typography>Página de Cadastro de Produtos</Typography>;
}

function ListarProdutos() {
  return <Typography>Lista de Produtos</Typography>;
}

function Estoque() {
  return <Typography>Lista de Estoque</Typography>;
}

export default function ApplicationNavigation() {

  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = (message, severity = 'success') => {
    const id = Date.now();
    setSnackbars((prev) => [
      ...prev,
      { id, message, severity, open: true },
    ]);
  };

  const handleCloseSnackbar = (id) => {
    setSnackbars((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, open: false } : s
      )
    );
  };

  const handleExited = (id) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Router>
      <AppProvider
        branding={{
          logo: <></>,
          title: 'InnerControl',
          homeUrl: '/',
        }}
        navigation={[
          {
            segment: 'pessoafisica',
            title: 'Pessoa Física',
            icon: <PersonIcon />,
            children: [
              {
                segment: 'cadastro',
                title: 'Cadastrar Pessoa',
                icon: <AddIcon />,
                link: 'cadastro',
              },
              {
                segment: 'lista',
                title: 'Listar Pessoas',
                icon: <ListIcon />,
                link: 'lista',
              },
            ],
          },
          {
            segment: 'produtos',
            title: 'Produtos',
            icon: <CategoryIcon />,
            children: [
              {
                segment: 'cadastro',
                title: 'Cadastrar Produto',
                icon: <AddIcon />,
                link: 'cadastro',
              },
              {
                segment: 'lista',
                title: 'Listar Produtos',
                icon: <ListIcon />,
                link: 'lista',
              },
            ],
          },
          {
            segment: 'estoque',
            title: 'Estoque',
            icon: <InventoryIcon />,
            children: [
              {
                segment: 'lista',
                title: 'Listar Estoque',
                icon: <ListIcon />,
                link: 'lista',
              },
            ],
          },
          {
            segment: 'servico',
            title: 'Serviço',
            icon: <ConstructionIcon />,
            children: [
              {
                segment: 'cadastro',
                title: 'Cadastrar Serviço',
                icon: <AddIcon />,
                link: 'cadastro',
              },
              {
                segment: 'lista',
                title: 'Listar Serviços',
                icon: <ListIcon />,
                link: 'lista',
              },
            ],
          },
        ]}
        theme={mainTheme}
      >
        <DashboardLayout
          slots={{
            sidebarFooter: SidebarFooter,
          }}
        >
          <AppRoutes showSnackbar={showSnackbar}/>
          {snackbars.map((snack, index) => (
            <SnackbarMessage 
              key={snack.id}
              open={snack.open}
              message={snack.message}
              severity={snack.severity}
              onClose={() => handleCloseSnackbar(snack.id)}
              onExited={() => handleExited(snack.id)}
              TransitionComponent={SlideTransition}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                top: `${8 + index * 70}px`,
              }}
            />
          ))}
        </DashboardLayout>
      </AppProvider>
    </Router>
  );
}

function AppRoutes( {showSnackbar} ){
  const navigate = useNavigate();

  return (
  <Routes>
    <Route path="/pessoafisica" element={<PessoaFisicaIndex />} />
    <Route path="/produtos" element={<ProdutoIndex />} />
    <Route path="/servico" element={<ServicoIndex />} />
    <Route path="/estoque" element={<EstoqueIndex />} />
    <Route path="/pessoafisica/cadastro" element={<PessoaFisicaForm 
                                                    onSubmit={(data) => 
                                                              pessoaFisicaSubmit(data, 
                                                                             showSnackbar, 
                                                                             ()=> navigate('/pessoaFisica')
                                                                             )
                                                              }
                                                    />} 
    />
    <Route path="/produtos/cadastro" element={<ProdutoForm 
                                                    onSubmit={(data) => 
                                                                produtoSubmit(data, 
                                                                             showSnackbar, 
                                                                             ()=> navigate('/produtos')
                                                                             )
                                                              }
                                                    />} 
    />
    <Route path="/servico/cadastro" element={<ServicoForm />} />
    <Route path="/pessoafisica/lista" element={<ListaPessoas />} />
    <Route path="/produtos/lista" element={<ListarProdutos />} />
    <Route path="/estoque/lista" element={<Estoque />} />
  </Routes>
)}