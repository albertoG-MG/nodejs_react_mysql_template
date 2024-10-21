import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users/editarusuario';

export default async function useApiEditarUsuario(token, formData, id, borrado) {
    try {

        formData.append('borrado', borrado);

        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
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
