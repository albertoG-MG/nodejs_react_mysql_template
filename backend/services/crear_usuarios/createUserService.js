const fs = require('fs');
const userModel = require("../../models/userModel");
const { tempnamSfx } = require('../../utils/asignarClaveArchivo');
const { hashPassword } = require('../../services/login/loginService');
const path = require('path');

const crearUsuario = async (formData, foto) => {
    const { username, password, nombre, apellido_pat, apellido_mat, correo, rol, subrol, departamento } = formData;

    try {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = hashPassword(password);
        let fotoNombre = null;

        // Manejo de la foto
        if (foto) {
            const ext = path.extname(foto.originalname);
            const location = path.join(__dirname, '../../src/img/imgs_uploaded/');

            if (!fs.existsSync(location)) {
                fs.mkdirSync(location, { recursive: true }); // Crea el directorio si no existe
            }

            // Generar un nombre único para la foto
            fotoNombre = tempnamSfx(location, ext);
            const fotoPath = path.join(location, fotoNombre);

            // Mover el archivo a la nueva ubicación
            await new Promise((resolve, reject) => {
                fs.rename(foto.path, fotoPath, (err) => {
                    if (err) {
                        return reject(new Error("No se pudo mover la foto a la ubicación seleccionada: " + err.message));
                    }
                    resolve(); // Solo resolvemos sin valor, ya que no necesitamos el nombre aquí
                });
            });

            // Usar path.basename para obtener solo el nombre del archivo
            fotoNombre = path.basename(fotoNombre);
        }

        // Crear el nuevo usuario
        const nuevoUsuario = {
            username: username,
            password: hashedPassword,
            nombre,
            apellido_pat,
            apellido_mat,
            correo,
            rol,
            subrol,
            departamento,
            nombre_archivo: foto.originalname || null,
            foto: fotoNombre || null // Si no hay foto, se guarda como null
        };

        // Guardar en la base de datos
        const resultado = await userModel.guardarUsuarioEnBaseDeDatos(nuevoUsuario);
        return resultado;
    } catch (error) {
        console.error("Error al guardar el usuario:", error);
        return false; // Puedes lanzar un error en vez de retornar false si lo prefieres
    }
};

module.exports = { crearUsuario };
