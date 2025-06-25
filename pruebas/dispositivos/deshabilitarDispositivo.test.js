// pruebas/dispositivos/deshabilitarDispositivo.test.js

const consultarDispositivosRepositorio = require('../../dispositivo/data/repositorios/consultarDispositivosRepositorio');
const deshabilitarDispositivoRepositorio = require('../../dispositivo/data/repositorios/deshabilitarDispositivoRepositorio');
const { deshabilitarDispositivo } = require('../../dispositivo/controladores/deshabilitarDispositivo.controlador');

// Mock de la conexión de base de datos para las pruebas
jest.mock('../../util/servicios/bd', () => ({
    execute: jest.fn()
}));

describe('Dispositivos - Deshabilitar por Usuario', () => {
    
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
    });

    test('Debe deshabilitar dispositivo cuando el usuario tiene un dispositivo activo', async () => {
        const idUsuario = 123;
        const dispositivoId = 'test-device-12345';
        
        // Mock de la petición
        const peticion = {
            body: { idUsuario }
        };
        
        // Mock de la respuesta
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock para obtener dispositivos del usuario
        jest.spyOn(consultarDispositivosRepositorio, 'obtenerDispositivosDeUsuario').mockResolvedValue({
            estado: 200,
            datos: [
                { id: dispositivoId, activo: true, idUsuario }
            ]
        });

        // Mock para deshabilitar el dispositivo
        jest.spyOn(deshabilitarDispositivoRepositorio, 'deshabilitar').mockResolvedValue({
            estado: 200,
            mensaje: 'Dispositivo deshabilitado con éxito',
            datos: {
                id: dispositivoId,
                activo: false,
                idUsuario: null
            }
        });

        await deshabilitarDispositivo(peticion, respuesta);

        expect(consultarDispositivosRepositorio.obtenerDispositivosDeUsuario).toHaveBeenCalledWith(idUsuario);
        expect(deshabilitarDispositivoRepositorio.deshabilitar).toHaveBeenCalledWith(dispositivoId);
        expect(respuesta.status).toHaveBeenCalledWith(200);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'Dispositivo deshabilitado con éxito',
            exito: true,
            dispositivo: {
                id: dispositivoId,
                activo: false,
                idUsuario: null
            }
        });
    });

    test('Debe retornar error 404 cuando el usuario no tiene dispositivos', async () => {
        const idUsuario = 456;
        
        const peticion = {
            body: { idUsuario }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock para obtener dispositivos del usuario (sin dispositivos)
        jest.spyOn(consultarDispositivosRepositorio, 'obtenerDispositivosDeUsuario').mockResolvedValue({
            estado: 200,
            datos: []
        });

        await deshabilitarDispositivo(peticion, respuesta);

        expect(respuesta.status).toHaveBeenCalledWith(404);        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'No se encontraron dispositivos vinculados a este usuario',
            exito: false
        });
    });

    test('Debe retornar error 404 cuando el usuario no tiene dispositivos activos', async () => {
        const idUsuario = 789;
        const dispositivoId = 'test-device-inactive';
        
        const peticion = {
            body: { idUsuario }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock para obtener dispositivos del usuario (solo inactivos)
        jest.spyOn(consultarDispositivosRepositorio, 'obtenerDispositivosDeUsuario').mockResolvedValue({
            estado: 200,
            datos: [
                { id: dispositivoId, activo: false, idUsuario }
            ]
        });

        await deshabilitarDispositivo(peticion, respuesta);

        expect(respuesta.status).toHaveBeenCalledWith(404);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'El usuario no tiene dispositivos activos para deshabilitar',
            exito: false
        });
    });

    test('Debe retornar error 400 cuando no se proporciona idUsuario', async () => {
        const peticion = {
            body: {}
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deshabilitarDispositivo(peticion, respuesta);

        expect(respuesta.status).toHaveBeenCalledWith(400);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'El ID del usuario es requerido',
            exito: false
        });
    });

    test('Debe retornar error 400 cuando el idUsuario es inválido', async () => {
        const peticion = {
            body: { idUsuario: 'invalid' }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deshabilitarDispositivo(peticion, respuesta);

        expect(respuesta.status).toHaveBeenCalledWith(400);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'ID de usuario inválido',
            exito: false
        });
    });
});
