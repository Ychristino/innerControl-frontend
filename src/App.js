import ApplicationNavigation from "./pages/ApplicationFrame";
import 'bootstrap/dist/css/bootstrap.min.css';
import authService from "./services/authService"

const handleLogin = async () => {
  try {
    const token = await authService.login({
      email: 'ychristino@gmail.com',
      senha: 'Bolinho'
    });
  } catch (error) {
    console.error('Erro ao autenticar:', error);
  }
};

function App() {
  handleLogin();
  return (
    <>
      <ApplicationNavigation/>
    </>
  );
}

export default App;
