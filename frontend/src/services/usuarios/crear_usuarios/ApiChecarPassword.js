const API_URL = 'http://localhost:8080/api/users/checarpassword';

export default async function useApiChecarPassword(token, { password }) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud a la API:', error);
        return { error: 'Error en la conexión a la API.' };
    }
}
