import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/crearusuario';

export default async function useApiCrearUsuario(token, formData) {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error en la solicitud a la API:', error);

        let errorMessage = 'Error inesperado.';

        // Verifica si hay respuesta y maneja el error
        if (error.response) {
            // La solicitud se hizo y el servidor respondió con un código de error
            errorMessage = error.response.data.message || 'Error en la conexión a la API.';
        } else if (error.request) {
            // La solicitud se hizo pero no se recibió respuesta
            errorMessage = 'No se recibió respuesta del servidor.';
        } else {
            // Ocurrió un error al configurar la solicitud
            errorMessage = 'Error en la configuración de la solicitud.';
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
