// utils/textUtils.js

function quitarAcentos(texto) {
    return texto.replace(/[áéíóúÁÉÍÓÚ]/g, function(match) {
        const acentos = {
            'á': 'a',
            'é': 'e',
            'í': 'i',
            'ó': 'o',
            'ú': 'u',
            'Á': 'A',
            'É': 'E',
            'Í': 'I',
            'Ó': 'O',
            'Ú': 'U'
        };
        return acentos[match];
    });
}

module.exports = { quitarAcentos };
