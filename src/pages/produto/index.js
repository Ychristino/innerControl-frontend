import Container from '@mui/material/Container';
import PainelFrame from '../../components/painelFrame';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function ProdutoIndex(){
    const navigate = useNavigate();

    const itensPainel = [
        {
            icon: <AddIcon />,
            label: "Cadastrar Produto",
            onClick: () => navigate("/produto/cadastro"),
        },
        {
            icon: <ListIcon />,
            label: "Listar Produtos",
            onClick: () => navigate("/produto/lista"),
        },
    ];

    return (
        <Container maxWidth="xl">
            <PainelFrame
                title={"Painel Produto"}
                buttons={itensPainel}
            />
        </Container>
    );
};