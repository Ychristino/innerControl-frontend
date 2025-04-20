import Container from '@mui/material/Container';
import PainelFrame from '../../components/painelFrame';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";

export default function EstoqueIndex(){
    const navigate = useNavigate();

    const itensPainel = [
{
            icon: <ListIcon />,
            label: "Listar Estoque",
            onClick: () => navigate("/estoque/lista"),
        },
    ];

    return (
        <Container maxWidth="xl">
            <PainelFrame
                title={"Painel Estoque"}
                buttons={itensPainel}
            />
        </Container>
    );
};