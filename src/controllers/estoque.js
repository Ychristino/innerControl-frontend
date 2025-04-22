import { ACTIONS } from "../constants/actions";
import { NOTIFICATIONS } from "../constants/notifications";
import estoqueService from "../services/estoqueService";

const handleChangeQuantity = (data, systemNotification, redirect) => {
  let request = data.acao === ACTIONS.ADICIONAR ? estoqueService.compraProduto : estoqueService.venderProduto;
      
  request(data.produto.id, data)
      .then((response) => {
        if (systemNotification)
            systemNotification('Atualização de estoque realizada com sucesso!', NOTIFICATIONS.SUCCESS);
        if(redirect)
            redirect()    
      })
      .catch((response) => {
          if (systemNotification)
              systemNotification(`Erro ao atualizar estoque! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
      });
};

export { handleChangeQuantity };