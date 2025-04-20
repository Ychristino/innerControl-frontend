import { useNavigate } from "react-router-dom";


const handleValid = () => {
    return true;
}

const handleSubmit = (data) => {
    // const navigate = useNavigate();

    console.log(data);
    // navigate("/pessoafisica");
}

export { handleValid, handleSubmit };