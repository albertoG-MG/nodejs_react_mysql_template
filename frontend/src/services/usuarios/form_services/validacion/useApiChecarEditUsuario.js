import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/checareditusuario'; 

export default async function useApiChecarUsuario(token, { username }, id) {
    try {

        const response = await axios.get(API_URL, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
                id: id,
                username: username
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error en la solicitud a la API:', error);

        let errorMessage = 'Error inesperado.';

        if (error.response) {
            errorMessage = error.response.data.message || 'Error en la conexión a la API.';
        } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor.';
        } else {
            errorMessage = 'Error en la configuración de la solicitud.';
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
