const { eliminarPlantillaModelo } = require('../modelos/eliminarPlantillaModelo.js');

async function eliminarPlantillaRepositorio(id) {
    const datos = await eliminarPlantillaModelo(id);
    
    if (!datos) {
        return {
            mensaje: 'Error al eliminar la plantilla: no se pudo eliminar',
        };
    }
    return datos;
}

module.exports = {
    eliminarPlantillaRepositorio,
};
