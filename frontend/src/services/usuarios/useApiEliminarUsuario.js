import axios from 'axios';


const API_URL = "http://localhost:8080/api/users/eliminarusuario";

const useApiEliminarUsuario = async(token, id) => {
    try{
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }catch(error){
        console.error("Error en la configuración de la API", error)

        let errorMessage = "Ocurrió un error inesperado";

        if(error.response){
            errorMessage = error.response.data.message || "Error en la conexión de la API";
        }else if(error.request){
            errorMessage = "No se recibió respuesta del servidor";
        }else{
            errorMessage = "Error en la configuración de la solicitud";
        }

        return{
            success: false,
            message: errorMessage
        }
    }
};

export default useApiEliminarUsuario;