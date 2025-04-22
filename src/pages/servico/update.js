import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormularioProduto from "./form";
import servicoService from "../../services/servicoService";

export default function ServicoUpdate({ onSubmit}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dadosIniciais, setDadosIniciais] = useState(null);

  useEffect(() => {
    servicoService.getById(id)
        .then((res) => {
      setDadosIniciais(res.data);
    });
  }, [id]);



  if (!dadosIniciais) return <div>Carregando...</div>;

  return <FormularioProduto dadosIniciais={dadosIniciais} onSubmit={onSubmit} />;
}
