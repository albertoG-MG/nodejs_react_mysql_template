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

        return {
            success: true,
            message: 'Usuario disponible.',
            data: response.data
        };

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
            message: errorMessage,
            data: null
        };
    }
}
