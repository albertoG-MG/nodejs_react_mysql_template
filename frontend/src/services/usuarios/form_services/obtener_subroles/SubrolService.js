import axios from 'axios';

const API_URL = 'http://localhost:8080/api/subroles/getsubrolesxrolxusuarios';

export const fetchSubroles = async (token, selectedRoleId) => {
  try {

    const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          roleId: selectedRoleId
        }
    });

    return response.data; 
  } catch (error) {
    console.error('Error al obtener los subroles:', error);
    throw error;
  }
};