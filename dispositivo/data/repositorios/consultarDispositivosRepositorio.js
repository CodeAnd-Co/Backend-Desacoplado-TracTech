const modelo = require('../modelos/consultarDispositivosModelo');
const DispositivoModelo = require('../modelos/dispositivoModelo');

/**
 * Obtiene un dispositivo por su ID
 * @param {string} id - ID del dispositivo
 * @returns {Object}
 */
async function obtenerPorId(id) {
    try {
        if (!DispositivoModelo.validarId(id)) {
            return {
                estado: 400,
                mensaje: 'ID de dispositivo inválido'
            };
        }

        const datos = await modelo.obtenerPorId(id);
        
        if (!datos) {
            return {
                estado: 404,
                mensaje: 'Dispositivo no encontrado'
            };
        }

        const dispositivo = new DispositivoModelo(
            datos.id,
            Boolean(datos.estado),
            datos.id_usuario_FK
        );        return {
            estado: 200,
            datos: dispositivo.toJSON()
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al obtener el dispositivo'
        };
    }
}

/**
 * Obtiene todos los dispositivos
 * @returns {Object}
 */
async function obtenerTodos() {
    try {
        const datos = await modelo.obtenerTodos();
        
        if (!datos || datos.length === 0) {
            return {
                estado: 404,
                mensaje: 'No se encontraron dispositivos'
            };
        }

        const dispositivos = datos.map(fila => {
            const dispositivo = new DispositivoModelo(
                fila.id,
                Boolean(fila.estado),
                fila.id_usuario_FK
            );
            const dispositivoJSON = dispositivo.toJSON();
            dispositivoJSON.nombreUsuario = fila.nombre_usuario || null;
            return dispositivoJSON;
        });        return {
            estado: 200,
            datos: dispositivos
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al obtener los dispositivos'
        };
    }
}

/**
 * Obtiene dispositivos por estado
 * @param {boolean} estado - Estado del dispositivo
 * @returns {Object}
 */
async function obtenerPorEstado(estado) {
    try {
        const datos = await modelo.obtenerPorEstado(estado);
        
        const dispositivos = datos.map(fila => {
            const dispositivo = new DispositivoModelo(
                fila.id,
                Boolean(fila.estado),
                fila.id_usuario_FK
            );
            return dispositivo.toJSON();
        });        return {
            estado: 200,
            datos: dispositivos
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al obtener dispositivos por estado'
        };
    }
}

/**
 * Obtiene dispositivos de un usuario específico
 * @param {number} idUsuario - ID del usuario
 * @returns {Object}
 */
async function obtenerDispositivosDeUsuario(idUsuario) {
    try {
        if (!idUsuario || isNaN(idUsuario)) {
            return {
                estado: 400,
                mensaje: 'ID de usuario inválido'
            };
        }

        const datos = await modelo.obtenerDispositivosDeUsuario(idUsuario);
        
        const dispositivos = datos.map(fila => {
            const dispositivo = new DispositivoModelo(
                fila.id,
                Boolean(fila.estado),
                fila.id_usuario_FK
            );
            return dispositivo.toJSON();
        });        return {
            estado: 200,
            datos: dispositivos
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al obtener dispositivos del usuario'
        };
    }
}

/**
 * Obtiene todas las vinculaciones dispositivo-usuario
 * @returns {Object}
 */
async function obtenerVinculaciones() {
    try {
        const datos = await modelo.obtenerVinculaciones();
        
        const vinculaciones = datos.map(fila => ({
            dispositivo: new DispositivoModelo(
                fila.id,
                Boolean(fila.estado),
                fila.id_usuario_FK
            ).toJSON(),
            usuario: fila.id_usuario_FK ? {
                id: fila.id_usuario_FK,
                nombre: fila.nombre_usuario,
                correo: fila.correo_usuario
            } : null
        }));        return {
            estado: 200,
            datos: vinculaciones
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al obtener las vinculaciones'
        };
    }
}

/**
 * Verifica si un usuario tiene dispositivos vinculados
 * @param {number} idUsuario - ID del usuario
 * @returns {Object}
 */
async function usuarioTieneDispositivosVinculados(idUsuario) {
    try {
        if (!idUsuario || isNaN(idUsuario)) {
            return {
                estado: 400,
                mensaje: 'ID de usuario inválido'
            };
        }

        const total = await modelo.contarDispositivosDeUsuario(idUsuario);
          return {
            estado: 200,
            datos: { tieneDispositivos: total > 0, cantidad: total }
        };
    } catch {
        return {
            estado: 500,
            mensaje: 'Error al verificar dispositivos del usuario'
        };
    }
}

module.exports = {
    obtenerPorId,
    obtenerTodos,
    obtenerPorEstado,
    obtenerDispositivosDeUsuario,
    obtenerVinculaciones,
    usuarioTieneDispositivosVinculados
};
