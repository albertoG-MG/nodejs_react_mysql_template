const fs = require('fs');
const userModel = require("../../models/userModel");
const { tempnamSfx } = require('../../utils/asignarClaveArchivo');
const { hashPassword } = require('../../services/login/loginService');
const path = require('path');

const editarUsuario = async (formData, foto, id) => {
    const { username, password, nombre, apellido_pat, apellido_mat, correo, rol, subrol, departamento, borrado } = formData;

    const checkUser = await userModel.editarUsuario(id);
    if (!checkUser) {
        console.error("Este usuario no existe");
        return false;
    }

    try {
        // Hashear la contraseña antes de
        let hashedPassword = null; // Cambiado a let
        if (password) {
            hashedPassword = hashPassword(password);
        }
        
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
                fs.writeFile(fotoPath, foto.buffer, (err) => {
                    if (err) {
                        return reject(new Error("No se pudo mover la foto a la ubicación seleccionada: " + err.message));
                    }
                    resolve(); // Solo resolvemos sin valor, ya que no necesitamos el nombre aquí
                });
            });

            // Usar path.basename para obtener solo el nombre del archivo
            fotoNombre = path.basename(fotoNombre);
        }

        let oldFotoName = null;

        if (checkUser.nombre_foto && checkUser.foto_identificador) {
            const oldFotoPath = path.join(__dirname, '../../src/img/imgs_uploaded/', checkUser.foto_identificador);
        
            // Si se sube una nueva foto, eliminar la foto anterior
            if (foto) {
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath);
                }
            } else if (borrado === "false") {
                // Si no se sube una nueva foto y borrado es false, mantenemos la foto anterior
                oldFotoName = checkUser.nombre_foto;
                fotoNombre = checkUser.foto_identificador;
            } else {
                // Si borrado es true, eliminar la foto anterior
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath);
                }
            }
        }
        
        const editarUsuario = {
            username,
            password: hashedPassword,
            nombre,
            apellido_pat,
            apellido_mat,
            correo,
            departamento,
            rol,
            subrol,
            nombre_archivo: foto ? foto.originalname : (oldFotoName ? oldFotoName : null),
            foto: fotoNombre || null
        };

        const resultado = await userModel.editarUsuarioPage(editarUsuario, id);
        return resultado;
    } catch (error) {
        console.error("Error al guardar el usuario:", error);
        return false;
    }
};

module.exports = { editarUsuario };
