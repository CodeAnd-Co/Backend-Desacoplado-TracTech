const modelo = require('../modelos/registrarDispositivoModelo');
const consultarModelo = require('../modelos/consultarDispositivosModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Registra un nuevo dispositivo o actualiza uno existente
 * @param {string} id - ID del dispositivo
 * @param {number|null} idUsuario - ID del usuario que registra el dispositivo
 * @returns {Object}
 */
async function registrarOActualizar(id, idUsuario = null) {
    try {
        if (!DispositivoModelo.validarId(id)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        // Si se proporciona un idUsuario, verificar que existe
        if (idUsuario) {
            if (isNaN(idUsuario)) {
                return {
                    estado: 400,
                    mensaje: 'ID de usuario inválido'
                };
            }

            const usuarioExiste = await modelo.verificarUsuarioExiste(idUsuario);
            if (!usuarioExiste) {
                // Continuar sin vinculación si el usuario no existe
                idUsuario = null;
            }
        }

        await modelo.registrarOActualizar(id, idUsuario);
        
        // Obtener el dispositivo actualizado
        const dispositivoActualizado = await consultarModelo.obtenerPorId(id);
        
        if (dispositivoActualizado) {
            const dispositivo = new DispositivoModelo(
                dispositivoActualizado.id,
                Boolean(dispositivoActualizado.estado),
                dispositivoActualizado.id_usuario_FK
            );
            
            return {
                estado: 201,
                mensaje: 'Dispositivo registrado/actualizado con éxito',
                datos: dispositivo.toJSON()
            };
        } else {
            // Si por alguna razón no se encuentra, crear uno nuevo activo
            const dispositivo = new DispositivoModelo(id, true, idUsuario);
            return {
                estado: 201,
                mensaje: 'Dispositivo registrado con éxito',
                datos: dispositivo.toJSON()
            };
        }
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al registrar/actualizar el dispositivo'
        };
    }
}

module.exports = {
    registrarOActualizar
};
