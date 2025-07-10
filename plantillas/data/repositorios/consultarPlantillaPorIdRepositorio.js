const { consultarPlantillaPorIdModelo } = require('../modelos/consultarPlantillaPorIdModelo.js');

async function consultarPlantillaPorIdRepositorio(id) {
    const datos = await consultarPlantillaPorIdModelo(id);
    
    if (!datos) {
        return {
            mensaje: 'Error al consultar la plantilla: no se encontró la plantilla',
        };
    }
    return datos;
}

module.exports = {
    consultarPlantillaPorIdRepositorio,
};
