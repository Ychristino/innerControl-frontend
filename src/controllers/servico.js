import { NOTIFICATIONS } from "../constants/notifications";
import servicoService from "../services/servicoService";

const handleSubmit = (data, systemNotification, redirect) => {
    servicoService.create(data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Serviço cadastrado com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirect)
                redirect()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao incluir serviço! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });
}

const handleUpdate = async (data, systemNotification, redirect) => {
    servicoService.update(data.id, data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Serviço atualizado com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirect)
                redirect()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao atualizar serviço! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });
  };
export { handleSubmit, handleUpdate };