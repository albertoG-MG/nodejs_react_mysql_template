import axios from 'axios';

const API_URL = '/api/users/login';

export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL, { username, password });
        const token = response.data.token;

        // Almacenar el token en el almacenamiento local
        localStorage.setItem('token', token);

        return token;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en las credenciales');
    }
};