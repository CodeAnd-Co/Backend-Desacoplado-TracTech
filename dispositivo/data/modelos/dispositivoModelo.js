// dispositivo/data/modelos/dispositivoModelo.js

/**
 * Modelo que representa un dispositivo en el sistema
 */
class DispositivoModelo {
    constructor(id, estado = true) {
        this.id = id;
        this.estado = estado; // true = activo, false = deshabilitado
    }

    /**
     * Convierte el modelo a un objeto plano para la respuesta JSON
     */
    toJSON() {
        return {
            id: this.id,
            activo: this.estado
        };
    }

    /**
     * Valida si el ID del dispositivo es válido
     */
    static validarId(id) {
        return Boolean(id && typeof id === 'string' && id.length >= 10);
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
}

module.exports = DispositivoModelo;
