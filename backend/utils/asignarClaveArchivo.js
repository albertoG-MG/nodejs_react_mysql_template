const fs = require('fs');
const path = require('path');

function tempnamSfx(directory, suffix) {
    let file;
    let fp;

    do {
        // Generar un nombre de archivo aleatorio
        file = path.join(directory, `${Math.floor(Math.random() * 1000000)}.${suffix}`);

        try {
            // Intentar abrir el archivo en modo exclusivo
            fp = fs.openSync(file, 'wx'); // 'wx' crea un archivo y lo abre para escritura
        } catch (error) {
            // Si el archivo ya existe, fp será undefined y el ciclo continuará
            fp = null;
        }
    } while (!fp);

    // Cerrar el archivo
    fs.closeSync(fp);
    return file;
}
