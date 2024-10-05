import axios from 'axios';

// Define la URL de tu API
const API_URL = 'http://localhost:8080/api/roles/getrolesxusuarios';

export const fetchRoles = async (token) => {
  try {

    const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    });

    return response.data; 
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    throw error;
  }
};
