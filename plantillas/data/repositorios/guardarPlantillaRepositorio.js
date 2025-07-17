const { guardarPlantillaModelo } = require('../modelos/guardarPlantillaModelo.js');

async function guardarPlantillaRepositorio(datosPlantilla) {
    const datos = await guardarPlantillaModelo(datosPlantilla);
    
    if (!datos) {
        return {
            mensaje: 'Error al guardar la plantilla: no se pudo insertar',
        };
    }
    return datos;
}

module.exports = {
    guardarPlantillaRepositorio,
};
