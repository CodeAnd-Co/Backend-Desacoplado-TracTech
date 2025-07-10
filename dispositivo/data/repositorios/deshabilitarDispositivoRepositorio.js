const modelo = require('../modelos/deshabilitarDispositivoModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Deshabilita un dispositivo
 * @param {string} id - ID del dispositivo
 * @returns {Object}
 */
async function deshabilitar(id) {
    try {
        if (!DispositivoModelo.validarId(id)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        const resultado = await modelo.deshabilitar(id);
        
        if (resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'Dispositivo no encontrado'
            };
        }

        // Dispositivo deshabilitado y desvinculado
        const dispositivo = new DispositivoModelo(id, false, null);
        
        return {
            estado: 200,
            mensaje: 'Dispositivo deshabilitado con éxito',
            datos: dispositivo.toJSON()
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al deshabilitar el dispositivo'
        };
    }
}

module.exports = {
    deshabilitar
};
