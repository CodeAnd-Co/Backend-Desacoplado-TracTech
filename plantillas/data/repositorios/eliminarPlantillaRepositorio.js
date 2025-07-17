const { eliminarPlantillaPorTituloModelo } = require('../modelos/eliminarPlantillaModelo.js');

async function eliminarPlantillaPorTituloRepositorio(titulo) {
    const datos = await eliminarPlantillaPorTituloModelo(titulo);
    
    if (!datos) {
        return {
            mensaje: 'Error al eliminar la plantilla: no se pudo eliminar',
        };
    }
    return datos;
}

module.exports = {
    eliminarPlantillaPorTituloRepositorio,
};
