import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/checarusuario'; 

export default async function useApiChecarUsuario(token, { username }) {
    try {
        const response = await axios.post(API_URL, 
            { username }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error en la solicitud a la API:', error);

        // Verifica si hay respuesta y maneja el error
        if (error.response) {
            // La solicitud se hizo y el servidor respondió con un código de error
            return { error: error.response.data.message || 'Error en la conexión a la API.' };
        } else if (error.request) {
            // La solicitud se hizo pero no se recibió respuesta
            return { error: 'No se recibió respuesta del servidor.' };
        } else {
            // Ocurrió un error al configurar la solicitud
            return { error: 'Error en la configuración de la solicitud.' };
        }
    }
}