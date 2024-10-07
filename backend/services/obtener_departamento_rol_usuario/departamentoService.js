const { obtenerTodosDepartamentos } = require('../../models/departamentoModel');
const { ObtenerRolporId } = require('../../models/rolModel');

const getDepartamentoxRolxUsuarios = async (roleId) => {
    const rows_departamento = await obtenerTodosDepartamentos();
    
    if (rows_departamento.length === 0) {
        console.log("No hay departamentos registrados.");
        return [];
    }

    const rol = await ObtenerRolporId(roleId);
    if (!rol) {
        console.log("No hay ningún rol que cumpla con las condiciones, no se devuelve ningún departamento");
        return [];
    }

    const rolnom = rol.nombre;
    if (["Superadministrador", "Administrador", "Director general", "Usuario externo"].includes(rolnom)) {
        console.log("El rol es un " + rolnom + ", estos usuarios no se les puede asignar departamento");
        return [];
    } else if (["Director", "Gerente", "Empleado"].includes(rolnom)) {
        console.log("El rol es un " + rolnom + " por lo tanto, se devuelven todos los departamentos");
        return rows_departamento;
    } else if (["Supervisor", "Tecnico"].includes(rolnom)) {
        console.log("El rol es un " + rolnom + " por lo tanto, se devuelve solo el departamento de Operaciones");
        
        const departamentoOperaciones = rows_departamento.filter(departamento => departamento.departamento === "Operaciones");
        if (departamentoOperaciones.length === 0) {
            console.log("No se encontró el departamento de Operaciones");
            return [];
        }
        return departamentoOperaciones;
    }
};

module.exports = { getDepartamentoxRolxUsuarios };
