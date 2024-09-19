import axios from 'axios';

const API_URL = '/api/users/login'; // Ruta de inicio de sesión

export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL, { username, password });
        return response.data.token; // Suponiendo que el token está aquí
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en las credenciales');
    }
};
