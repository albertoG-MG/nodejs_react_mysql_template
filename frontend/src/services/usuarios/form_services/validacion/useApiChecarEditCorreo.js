import axios from 'axios';

const API_URL = "http://localhost:8080/api/users/checareditcorreo";

export default async function useApiChecarEditCorreo(token, {correo}, id){
    try{
        const response = await axios.get(API_URL, {
            headers:{
                'Authorization': `Bearer ${token}`
            },
            params:{
                id:id,
                correo:correo
            }
        });

        return response.data;
    }catch(error){
        console.error("Error en la conexión con el API", error);

        let errorMessage = "Ocurrió un error inesperado";

        if(error.response){
            errorMessage =  error.response.data.message || "Ocurrió un error en la conexión con la API";
        }else if(error.request){
            errorMessage = "No se recibió respuesta con el servidor";
        }else{
            errorMessage = "La solicitud está mal configurada";
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}