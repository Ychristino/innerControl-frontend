import { NOTIFICATIONS } from "../constants/notifications";
import produtoService from "../services/produtoService";

const handleSubmit = (data, systemNotification, redirectTo) => {
    produtoService.create(data)
        .then((response) => {
            systemNotification('Produto cadastrada com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirectTo)
                redirectTo()    
        })
        .catch((response) => {
            systemNotification(`Erro ao incluir produto! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });

}

export { handleSubmit };