import Container from '@mui/material/Container';
import PainelFrame from '../../components/painelFrame';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function PessoaFisicaIndex(){
    const navigate = useNavigate();

    const itensPainel = [
        {
            icon: <AddIcon />,
            label: "Cadastrar Pessoa",
            onClick: () => navigate("/pessoafisica/cadastro"),
        },
        {
            icon: <ListIcon />,
            label: "Listar Pessoa",
            onClick: () => navigate("/pessoafisica/lista"),
        },
    ];

    return (
        <Container maxWidth="xl">
            <PainelFrame
                title={"Painel Pessoa"}
                buttons={itensPainel}
            />
        </Container>
    );
};