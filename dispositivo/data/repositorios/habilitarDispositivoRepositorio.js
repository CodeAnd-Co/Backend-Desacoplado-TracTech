const modelo = require('../modelos/habilitarDispositivoModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Habilita un dispositivo
 * @param {string} id - ID del dispositivo
 * @returns {Object}
 */
async function habilitar(id) {
    try {
        if (!DispositivoModelo.validarId(id)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        const resultado = await modelo.habilitar(id);
        
        if (resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'Dispositivo no encontrado'
            };
        }

        const dispositivo = new DispositivoModelo(id, true);
        
        return {
            estado: 200,
            mensaje: 'Dispositivo habilitado con éxito',
            datos: dispositivo.toJSON()
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al habilitar el dispositivo'
        };
    }
}

module.exports = {
    habilitar
};
