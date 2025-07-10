// dispositivo/controladores/habilitarDispositivo.controlador.js

const habilitarDispositivoRepositorio = require('../data/repositorios/habilitarDispositivoRepositorio');
const consultarDispositivosRepositorio = require('../data/repositorios/consultarDispositivosRepositorio');
const registrarDispositivoRepositorio = require('../data/repositorios/registrarDispositivoRepositorio');
const DispositivoModelo = require('../data/modelos/dispositivoModelo');
const validator = require('validator');

/**
 * Controlador para habilitar un dispositivo
 */
exports.habilitarDispositivo = async (peticion, respuesta) => {
    try {
        if (!peticion.body) {
            return respuesta.status(400).json({ 
                mensaje: 'Faltan datos requeridos',
                exito: false 
            });
        }

        const { dispositivoId } = peticion.body;

        // Validar que se proporcione el ID del dispositivo
        if (!dispositivoId) {
            return respuesta.status(400).json({ 
                mensaje: 'El ID del dispositivo es requerido',
                exito: false 
            });
        }

        // Sanitizar el ID del dispositivo
        const dispositivoIdSanitizado = validator.escape(dispositivoId.toString());

        // Validar formato del ID
        if (!DispositivoModelo.validarId(dispositivoIdSanitizado)) {
            return respuesta.status(400).json({ 
                mensaje: 'ID de dispositivo inválido',
                exito: false 
            });
        }

        // Buscar el dispositivo
        const busquedaDispositivo = await consultarDispositivosRepositorio.obtenerPorId(dispositivoIdSanitizado);
        
        let resultado;
        
        // Si el dispositivo no existe, lo creamos y lo habilitamos
        if (busquedaDispositivo.estado === 404) {
            resultado = await registrarDispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado);
        } else if (busquedaDispositivo.estado === 200) {
            // Habilitar dispositivo existente
            resultado = await habilitarDispositivoRepositorio.habilitar(dispositivoIdSanitizado);
        } else {
            return respuesta.status(busquedaDispositivo.estado).json({
                mensaje: busquedaDispositivo.mensaje,
                exito: false
            });
        }        if (resultado.estado !== 200 && resultado.estado !== 201) {
            return respuesta.status(resultado.estado).json({ 
                mensaje: resultado.mensaje,
                exito: false 
            });
        }

        respuesta.status(200).json({
            mensaje: resultado.mensaje,
            exito: true,
            dispositivo: resultado.datos
        });

    } catch {
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            exito: false 
        });
    }
};
