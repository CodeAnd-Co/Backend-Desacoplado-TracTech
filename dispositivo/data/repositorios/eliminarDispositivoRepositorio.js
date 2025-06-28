const modelo = require('../modelos/eliminarDispositivoModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Elimina un dispositivo
 * @param {string} id - ID del dispositivo
 * @returns {Object}
 */
async function eliminar(id) {
    try {
        if (!DispositivoModelo.validarId(id)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        const resultado = await modelo.eliminar(id);
        
        if (resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'Dispositivo no encontrado'
            };
        }

        return {
            estado: 200,
            mensaje: 'Dispositivo eliminado con éxito'
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al eliminar el dispositivo'
        };
    }
}

module.exports = {
    eliminar
};
