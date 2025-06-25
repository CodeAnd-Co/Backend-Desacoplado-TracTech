// dispositivo/data/modelos/dispositivoModelo.js

/**
 * Modelo que representa un dispositivo en el sistema
 */
class DispositivoModelo {
    constructor(id, estado = true, idUsuario = null) {
        this.id = id;
        this.estado = estado; // true = activo, false = deshabilitado
        this.idUsuario = idUsuario;
    }

    /**
     * Convierte el modelo a un objeto plano para la respuesta JSON
     */
    toJSON() {
        return {
            id: this.id,
            activo: this.estado,
            idUsuario: this.idUsuario
        };
    }

    /**
     * Valida si el ID del dispositivo es válido
     */
    static validarId(id) {
        return Boolean(id && typeof id === 'string');
    }

    /**
     * Habilita el dispositivo
     */
    habilitar() {
        this.estado = true;
    }

    /**
     * Deshabilita el dispositivo
     */
    deshabilitar() {
        this.estado = false;
    }

    /**
     * Vincula el dispositivo a un usuario
     */
    vincularUsuario(idUsuario) {
        this.idUsuario = idUsuario;
    }

    /**
     * Libera el dispositivo de la vinculación con el usuario
     */
    liberarVinculacion() {
        this.idUsuario = null;
    }

    /**
     * Verifica si el dispositivo está vinculado a un usuario
     */
    estaVinculado() {
        return this.idUsuario !== null;
    }

    /**
     * Verifica si el dispositivo está vinculado a un usuario específico
     */
    estaVinculadoA(idUsuario) {
        return this.idUsuario === idUsuario;
    }
}

module.exports = DispositivoModelo;
