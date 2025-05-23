import { NOTIFICATIONS } from "../constants/notifications";
import pessoaService from "../services/pessoaFisicaService";

const handleSubmit = (data, systemNotification, redirect) => {
    pessoaService.create(data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Pessoa cadastrada com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirect)
                redirect()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao incluir pessoa! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });
}

const handleUpdate = async (data, systemNotification, redirect) => {
    pessoaService.update(data.id, data)
        .then((response) => {
            if (systemNotification)
                systemNotification('Pessoa atualizada com sucesso!', NOTIFICATIONS.SUCCESS);
            if(redirect)
                redirect()    
        })
        .catch((response) => {
            if (systemNotification)
                systemNotification(`Erro ao atualizar pessoa! ${response.response.data[0].message}`, NOTIFICATIONS.ERROR);
        });

  };
export { handleSubmit, handleUpdate };