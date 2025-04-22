import { NOTIFICATIONS } from "../constants/notifications";
import produtoService from "../services/produtoService";

const handleSubmit = (data, systemNotification, redirectTo) => {
    produtoService.create(data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Produto cadastrada com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirectTo)
                redirectTo()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao incluir produto! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });

}

const handleUpdate = (data, systemNotification, redirectTo) => {
    produtoService.update(data.id, data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Produto atualizado com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirectTo)
                redirectTo()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao atualizar produto! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });

}

export { handleSubmit, handleUpdate };