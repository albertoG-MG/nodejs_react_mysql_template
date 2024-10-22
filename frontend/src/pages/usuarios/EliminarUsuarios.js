import { useEffect } from 'react';
import { useParams, useNavigate, useLocation  } from 'react-router-dom';
import useApiEliminarUsuario from '../../services/usuarios/useApiEliminarUsuario'

export default function EliminarUsuarios(){
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const EliminarUsuarios = async() => {
        const {success, message} = await useApiEliminarUsuario(token, id);
        navigate('/consulta', { state: { success, message } });
      }
      EliminarUsuarios();
    }, [id, token, navigate])
    
    return null;
}