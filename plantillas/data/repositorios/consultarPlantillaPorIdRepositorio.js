const { consultarPlantillaPorTituloModelo } = require('../modelos/consultarPlantillaPorIdModelo.js');

async function consultarPlantillaPorTituloRepositorio(titulo) {
    const datos = await consultarPlantillaPorTituloModelo(titulo);
    
    if (!datos) {
        return {
            mensaje: 'Error al consultar la plantilla: no se encontró la plantilla',
        };
    }
    return datos;
}

module.exports = {
    consultarPlantillaPorTituloRepositorio,
};
