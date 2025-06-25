const modelo = require('../modelos/vincularDispositivoModelo');
const consultarModelo = require('../modelos/consultarDispositivosModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Vincula un dispositivo a un usuario
 * @param {string} dispositivoId - ID del dispositivo
 * @param {number} idUsuario - ID del usuario
 * @returns {Object}
 */
async function vincularDispositivo(dispositivoId, idUsuario) {
    try {
        if (!DispositivoModelo.validarId(dispositivoId)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        if (!idUsuario || isNaN(idUsuario)) {
            return {
                estado: 400,
                mensaje: 'ID de usuario inválido'
            };
        }

        // Verificar que el usuario existe
        const usuarioExiste = await modelo.verificarUsuarioExiste(idUsuario);
        if (!usuarioExiste) {
            return {
                estado: 404,
                mensaje: `Usuario con ID ${idUsuario} no encontrado`
            };
        }

        const resultado = await modelo.vincularDispositivo(dispositivoId, idUsuario);
        
        if (resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'Dispositivo no encontrado'
            };
        }

        // Obtener el dispositivo actualizado
        const dispositivoActualizado = await consultarModelo.obtenerPorId(dispositivoId);
        
        if (dispositivoActualizado) {
            const dispositivo = new DispositivoModelo(
                dispositivoActualizado.id,
                Boolean(dispositivoActualizado.estado),
                dispositivoActualizado.id_usuario_FK
            );
            
            return {
                estado: 200,
                mensaje: 'Dispositivo vinculado con éxito',
                datos: dispositivo.toJSON()
            };
        }

        return {
            estado: 500,
            mensaje: 'Error al obtener el dispositivo actualizado'
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al vincular el dispositivo'
        };
    }
}

/**
 * Libera todos los dispositivos vinculados a un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Object}
 */
async function liberarDispositivosDeUsuario(idUsuario) {
    try {
        if (!idUsuario || isNaN(idUsuario)) {
            return {
                estado: 400,
                mensaje: 'ID de usuario inválido'
            };
        }

        const resultado = await modelo.liberarDispositivosDeUsuario(idUsuario);
        
        return {
            estado: 200,
            mensaje: `${resultado.affectedRows} dispositivos liberados`,
            datos: { dispositivosLiberados: resultado.affectedRows }
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al liberar dispositivos del usuario'
        };
    }
}

module.exports = {
    vincularDispositivo,
    liberarDispositivosDeUsuario
};
