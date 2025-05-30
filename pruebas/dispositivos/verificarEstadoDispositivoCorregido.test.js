// pruebas/dispositivos/verificarEstadoDispositivoCorregido.test.js

const DispositivoRepositorio = require('../../dispositivo/data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../../dispositivo/data/modelos/dispositivoModelo');
const { verificarEstado } = require('../../dispositivo/controladores/verificarEstadoDispositivo.controlador');

// Mock de la conexión de base de datos para las pruebas
jest.mock('../../util/servicios/bd', () => ({
    execute: jest.fn()
}));

describe('Dispositivos - Verificar Estado (Lógica Corregida)', () => {
    
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
    });

    test('No debe vincular usuario a dispositivo deshabilitado', async () => {
        const dispositivoId = 'test-device-disabled';
        const idUsuario = 123;
        
        // Mock de la petición con usuario autenticado
        const peticion = {
            body: { dispositivoId },
            usuario: { id: idUsuario }
        };
        
        // Mock de la respuesta
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };        // Mock: dispositivo existe pero está deshabilitado
        const dispositivoDeshabilitado = new DispositivoModelo(dispositivoId, false, null);
        jest.spyOn(DispositivoRepositorio, 'obtenerPorId').mockResolvedValue(dispositivoDeshabilitado);

        // Mock para que no se intente vincular el dispositivo
        const spyVincularDispositivo = jest.spyOn(DispositivoRepositorio, 'vincularDispositivo').mockResolvedValue(null);

        await verificarEstado(peticion, respuesta);

        // Verificar que NO se intentó vincular el dispositivo
        expect(spyVincularDispositivo).not.toHaveBeenCalled();
        
        // Verificar que se retorna estado deshabilitado
        expect(respuesta.status).toHaveBeenCalledWith(200);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'Dispositivo deshabilitado',
            estado: false,
            vinculado: false,
            idUsuario: null
        });
    });

    test('Debe vincular usuario a dispositivo habilitado sin usuario', async () => {
        const dispositivoId = 'test-device-enabled';
        const idUsuario = 123;
        
        const peticion = {
            body: { dispositivoId },
            usuario: { id: idUsuario }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock: dispositivo existe, está habilitado pero no vinculado
        const dispositivoHabilitado = new DispositivoModelo(dispositivoId, true, null);
        jest.spyOn(DispositivoRepositorio, 'obtenerPorId').mockResolvedValue(dispositivoHabilitado);

        // Mock: después de vincular, dispositivo queda vinculado al usuario
        const dispositivoVinculado = new DispositivoModelo(dispositivoId, true, idUsuario);
        jest.spyOn(DispositivoRepositorio, 'vincularDispositivo').mockResolvedValue(dispositivoVinculado);

        await verificarEstado(peticion, respuesta);

        // Verificar que SÍ se intentó vincular el dispositivo
        expect(DispositivoRepositorio.vincularDispositivo).toHaveBeenCalledWith(dispositivoId, idUsuario);
        
        // Verificar que se retorna estado activo y vinculado
        expect(respuesta.status).toHaveBeenCalledWith(200);        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'Dispositivo activo',
            estado: true,
            vinculado: true,
            idUsuario
        });
    });

    test('No debe vincular si dispositivo ya está vinculado a otro usuario', async () => {
        const dispositivoId = 'test-device-occupied';
        const idUsuario = 123;
        const otroUsuario = 456;
        
        const peticion = {
            body: { dispositivoId },
            usuario: { id: idUsuario }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock: dispositivo existe, está habilitado pero ya vinculado a otro usuario
        const dispositivoOcupado = new DispositivoModelo(dispositivoId, true, otroUsuario);
        jest.spyOn(DispositivoRepositorio, 'obtenerPorId').mockResolvedValue(dispositivoOcupado);

        await verificarEstado(peticion, respuesta);

        // Verificar que NO se intentó vincular el dispositivo
        expect(DispositivoRepositorio.vincularDispositivo).not.toHaveBeenCalled();
        
        // Verificar que se retorna estado activo pero vinculado a otro usuario
        expect(respuesta.status).toHaveBeenCalledWith(200);
        expect(respuesta.json).toHaveBeenCalledWith({
            mensaje: 'Dispositivo activo',
            estado: true,
            vinculado: true,
            idUsuario: otroUsuario
        });
    });

    test('Debe crear y vincular dispositivo nuevo', async () => {
        const dispositivoId = 'test-device-new';
        const idUsuario = 123;
        
        const peticion = {
            body: { dispositivoId },
            usuario: { id: idUsuario }
        };
        
        const respuesta = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock: dispositivo no existe
        jest.spyOn(DispositivoRepositorio, 'obtenerPorId').mockResolvedValue(null);

        // Mock: crear dispositivo nuevo vinculado al usuario
        const dispositivoNuevo = new DispositivoModelo(dispositivoId, true, idUsuario);
        jest.spyOn(DispositivoRepositorio, 'registrarOActualizar').mockResolvedValue(dispositivoNuevo);

        await verificarEstado(peticion, respuesta);

        // Verificar que se creó el dispositivo con el usuario
        expect(DispositivoRepositorio.registrarOActualizar).toHaveBeenCalledWith(dispositivoId, idUsuario);
        
        // Verificar que NO se llamó vincularDispositivo (ya se vinculó al crear)
        expect(DispositivoRepositorio.vincularDispositivo).not.toHaveBeenCalled();
    });
});
