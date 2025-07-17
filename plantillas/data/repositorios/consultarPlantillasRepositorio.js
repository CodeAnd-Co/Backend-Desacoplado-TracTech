const { consultarPlantillasModelo } = require('../modelos/consultarPlantillasModelo.js');

async function consultarPlantillasRepositorio() {
    const datos = await consultarPlantillasModelo((error, resultado) => {
        if (error) {
            return error;
        }
        return resultado;
    });
    if (!datos) {
        return {
            mensaje: 'Error al consultar las Plantillass: no se encontraron Plantillass',
        };
    }
    return datos;
}

module.exports = {
    consultarPlantillasRepositorio,
};