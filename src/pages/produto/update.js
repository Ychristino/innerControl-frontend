import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormularioProduto from "./form";
import produtoService from "../../services/produtoService";

export default function ProdutoUpdate({ onSubmit}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dadosIniciais, setDadosIniciais] = useState(null);

  useEffect(() => {
    produtoService.getById(id)
        .then((res) => {
      setDadosIniciais(res.data);
    });
  }, [id]);



  if (!dadosIniciais) return <div>Carregando...</div>;

  return <FormularioProduto dadosIniciais={dadosIniciais} onSubmit={onSubmit} />;
}
