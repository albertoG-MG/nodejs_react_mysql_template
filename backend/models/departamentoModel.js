const db = require('../config/conexion');

const getDepartamentoxRolxUsuarios = async (roleId) => {
    try{
        let sql_departamento=`
            SELECT * FROM departamentos
        `;

        const [rows_departamento] = await db.query(sql_departamento);

        if(rows_departamento.length > 0){

            let sql_rol=`
                SELECT nombre FROM roles WHERE id = ?
            `;

            const [rows_rol] = await db.query(sql_rol, [roleId]);

            if(rows_rol.length > 0){
                const rol = rows_rol[0];
                const rolnom = rol.nombre;

                if(rolnom == "Superadministrador" || rolnom == "Administrador" || rolnom == "Director general" || rolnom == "Usuario externo" || rolnom == "Usuario externo"){
                    console.log("El rol es un " +rolnom+ ", estos usuarios no se les puede asignar departamento");
                    return [];
                }else if(rolnom == "Director" || rolnom == "Gerente" || rolnom == "Empleado"){
                    console.log("El rol es un " +rolnom+ " por lo tanto, se devuelven todos los departamentos");
                    return rows_departamento;
                }else if(rolnom == "Supervisor" || rolnom == "Tecnico"){
                    console.log("El rol es un " + rolnom + " por lo tanto, se devuelve solo el departamento de Operaciones");

                    const departamentoOperaciones = rows_departamento.filter(departamento => departamento.departamento === "Operaciones");
    
                    if (departamentoOperaciones.length === 0) {
                        console.log("No se encontró el departamento de Operaciones");
                        return [];
                    }
                    
                    return departamentoOperaciones;
                }

            }else{
                console.log("No hay ningún rol que cumpla con las condiciones, no se devuelve ningún departamento");
                return [];
            }
        }else{
            console.log("No hay departamentos registrados.");
            return [];
        }
    }catch(err){
        throw err;
    }
}

module.exports = { getDepartamentoxRolxUsuarios };