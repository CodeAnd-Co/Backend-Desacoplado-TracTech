/**
 * Repositorio general de dispositivos
 * Agrupa funcionalidades de los diferentes repositorios específicos
 */

const { liberarDispositivosDeUsuario, vincularDispositivo } = require('./vincularDispositivoRepositorio');
const { 
    obtenerPorId, 
    obtenerTodos, 
    obtenerPorEstado, 
    obtenerDispositivosDeUsuario, 
    obtenerVinculaciones, 
    usuarioTieneDispositivosVinculados 
} = require('./consultarDispositivosRepositorio');
const { eliminar } = require('./eliminarDispositivoRepositorio');
const { habilitar } = require('./habilitarDispositivoRepositorio');
const { deshabilitar } = require('./deshabilitarDispositivoRepositorio');

module.exports = {
    // Funciones de vinculación
    liberarDispositivosDeUsuario,
    vincularDispositivo,
    
    // Funciones de consulta
    obtenerPorId,
    obtenerTodos,
    obtenerPorEstado,
    obtenerDispositivosDeUsuario,
    obtenerVinculaciones,
    usuarioTieneDispositivosVinculados,
    
    // Funciones de gestión
    eliminar,
    habilitar,
    deshabilitar
};
