import axios from 'axios';

const API_URL="http://localhost:8080/api/users/checareditpassword";

export default async function useApiChecarEditPassword(token, { password }, id){

    try{

        const response = await axios.get(API_URL, {
            headers:{
                'Authorization': `Bearer ${token}`
            },
            params:{
                id:id,
                password:password
            }
        });

        return response.data;
    }catch(error){
        console.error("Error al hacer la solicitud de password" +error);

        let errorMessage = "Ocurrió un error inesperado";

        if(error.response){
            errorMessage = error.response.data.message || "Ocurrió un error en la conexión de la API";
        }else if(error.request){
            errorMessage = "No se recibió respuesta del servidor";
        }else{
            errorMessage = "Error en la configuración de la solicitud";
        }

        return {
            success: false,
            message: errorMessage
        }
    }
}