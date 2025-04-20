import Container from '@mui/material/Container';
import PainelFrame from '../../components/painelFrame';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function ServicoIndex(){
    const navigate = useNavigate();

    const itensPainel = [
        {
            icon: <AddIcon />,
            label: "Cadastrar Serviço",
            onClick: () => navigate("/servico/cadastro"),
        },
        {
            icon: <ListIcon />,
            label: "Listar Serviço",
            onClick: () => navigate("/servico/lista"),
        },
    ];

    return (
        <Container maxWidth="xl">
            <PainelFrame
                title={"Painel Serviço"}
                buttons={itensPainel}
            />
        </Container>
    );
};