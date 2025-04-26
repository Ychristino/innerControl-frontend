import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
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
import { handleSubmit as pessoaFisicaSubmit, handleUpdate as pessoaFisicaUpdate } from '../controllers/pessoaFisica';
import { handleSubmit as produtoSubmit, handleUpdate as produtoUpdate } from '../controllers/produto';
import { handleSubmit as servicoSubmit, handleUpdate as servicoUpdate } from '../controllers/servico';
import SnackbarMessage from '../components/snackBarMessage';
import { Button, Slide } from '@mui/material';
import ListaPessoas from './pessoaFisica/list';
import PessoaFisicaUpdate from './pessoaFisica/udpate';
import ListaProdutos from './produto/list';
import ProdutoUpdate from './produto/update';
import ListagemEstoque from './estoque/list';
import { handleChangeQuantity as handleChangeQuantityEstoque } from '../controllers/estoque';
import ListaServicos from './servico/list';
import ServicoUpdate from './servico/update';
import PrivateRoute from './auth/PrivateRoute';
import LoginPage from './auth/LoginPage';
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './auth/AuthContext';

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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ margin: '8px', whiteSpace: 'wrap', overflow: 'hidden' }}>
      <Typography variant="caption">
        {mini ? 'InnerControl' : 'InnerControl - Controle de serviços'}
      </Typography>
      <Button
        onClick={handleLogout}
        color="error"
        size="small"
        fullWidth
        sx={{ mt: 1 }}
      >
        Logout
      </Button>
    </div>
  );
}

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  const { children, in: inProp, onExited, ...other } = props;
  return (
    <Slide
      direction="left"
      ref={ref}
      in={inProp}
      onExited={onExited}
      {...other}
    >
      {children}
    </Slide>
  );
});

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


function Logger() {
  const location = useLocation();

  useEffect(() => {
    console.log("Rota acessada:", location.pathname);
  }, [location]);

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
    <AuthProvider>
      <Router>
        <Logger />
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
              segment: 'servicos',
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
    </AuthProvider>
  );
}

function AppRoutes( {showSnackbar} ){
  const navigate = useNavigate();
  const [routeKey, setRouteKey] = useState(Date.now());
  const { isAuthenticated } = useAuth();

  const resetView = () => {
    setRouteKey(Date.now());
  };

  return (
  <Routes>
    <Route path="/login" element={
      isAuthenticated ? <Navigate to="/" /> : <LoginPage />
      } 
    />
    
    <Route path="/pessoafisica" element={
      <PrivateRoute>
        <PessoaFisicaIndex />
      </PrivateRoute>
      } 
    />
    <Route path="/produtos" element={
      <PrivateRoute>
        <ProdutoIndex />
      </PrivateRoute>
      } 
    />
    <Route path="/servicos" element={
      <PrivateRoute>
        <ServicoIndex />  
      </PrivateRoute>
      } 
    />
    <Route path="/estoque" element={
      <PrivateRoute>
        <EstoqueIndex />
      </PrivateRoute>
      } 
    />
    
    <Route path="/pessoafisica/cadastro" element={
      <PrivateRoute>
        <PessoaFisicaForm onSubmit={(data) =>
                                    pessoaFisicaSubmit(data,
                                    showSnackbar,
                                    ()=> navigate('/pessoafisica')
                                    )
        }
      />
      </PrivateRoute>
      } 
    />
    <Route path="/pessoafisica/udpate/:id" element={
      <PrivateRoute>
        <PessoaFisicaUpdate onSubmit={(data) => 
                              pessoaFisicaUpdate(data, 
                              showSnackbar, 
                              ()=> navigate('/pessoafisica/lista')
                              )
                            }
        />
      </PrivateRoute>
      } 
    />
    <Route path="/produtos/cadastro" element={
      <PrivateRoute>
        <ProdutoForm onSubmit={(data) => 
                                produtoSubmit(data, 
                                showSnackbar, 
                                ()=> navigate('/produtos')
                                )
                              }
        />
      </PrivateRoute>
      } 
    />
    <Route path="/produtos/update/:id" element={
      <PrivateRoute>
        <ProdutoUpdate onSubmit={(data) =>
                                  produtoUpdate(data, 
                                  showSnackbar, 
                                  ()=> navigate('/produtos/lista')
                                  )
                                }
        />
      </PrivateRoute>
      } 
    />
    <Route path="/estoque/lista" element={
      <PrivateRoute>
        <ListagemEstoque key={routeKey} 
                         onChangeQuantity={(data)=> 
                                            handleChangeQuantityEstoque(data,
                                            showSnackbar, 
                                            resetView)
                                          }
        />
      </PrivateRoute>
      } 
    />
    <Route path="/servicos/cadastro" element={
      <PrivateRoute>
        <ServicoForm onSubmit={(data) =>
                                servicoSubmit(data, 
                                showSnackbar, 
                                ()=> navigate('/servicos')
                                )
                              }
        />
      </PrivateRoute>
      } 
    />
    <Route path="/servicos/update/:id" element={
      <PrivateRoute>
        <ServicoUpdate onSubmit={(data) =>
                                  servicoUpdate(data, 
                                  showSnackbar, 
                                  ()=> navigate('/servicos/lista')
                                  )
                                }
        />
      </PrivateRoute>} 
    />
  <Route path="/pessoafisica/lista" element={
    <PrivateRoute>
      <ListaPessoas />
    </PrivateRoute>
    } 
  />
  <Route path="/produtos/lista" element={
    <PrivateRoute>
      <ListaProdutos />
    </PrivateRoute>
    } 
  />
  <Route path="/servicos/lista" element={
    <PrivateRoute>
      <ListaServicos />
    </PrivateRoute>
    } 
  />
  <Route path="*" element={<p>Não tem nada aqui... sai pianinho</p>} />
  </Routes>
)}