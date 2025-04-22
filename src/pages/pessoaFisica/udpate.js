import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormularioPessoa from "./form";
import pessoaService from "../../services/pessoaFisicaService";

export default function PessoaFisicaUpdate({ onSubmit}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dadosIniciais, setDadosIniciais] = useState(null);

  useEffect(() => {
    pessoaService.getById(id)
        .then((res) => {
      setDadosIniciais(res.data);
    });
  }, [id]);



  if (!dadosIniciais) return <div>Carregando...</div>;

  return <FormularioPessoa dadosIniciais={dadosIniciais} onSubmit={onSubmit} />;
}
