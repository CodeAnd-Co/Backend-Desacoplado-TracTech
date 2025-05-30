// pruebas/dispositivos/verificarEstadoDispositivo.test.js

const DispositivoRepositorio = require('../../dispositivo/data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../../dispositivo/data/modelos/dispositivoModelo');

// Mock de la conexión de base de datos para las pruebas
jest.mock('../../util/servicios/bd', () => ({
    execute: jest.fn()
}));

const mockConexion = require('../../util/servicios/bd');

describe('Dispositivos - Verificar Estado', () => {
    
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
    });    test('Debe crear un nuevo dispositivo si no existe', async () => {
        const dispositivoId = 'test-device-12345';
        
        // Mock para crear el dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 }); // Dispositivo creado exitosamente
        });
        
        const dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoId);
        
        expect(dispositivo).toBeDefined();
        expect(dispositivo.id).toBe(dispositivoId);
        expect(dispositivo.estado).toBe(true);
    });

    test('Debe validar ID de dispositivo correctamente', () => {
        expect(DispositivoModelo.validarId('valid-device-id-123')).toBe(true);
        expect(DispositivoModelo.validarId('short')).toBe(false);
        expect(DispositivoModelo.validarId('')).toBe(false);
        expect(DispositivoModelo.validarId(null)).toBe(false);
    });

    test('Debe habilitar un dispositivo correctamente', async () => {
        const dispositivoId = 'test-device-habilitar';
          // Mock para habilitar dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });
        
        const dispositivo = await DispositivoRepositorio.habilitar(dispositivoId);
        
        expect(dispositivo.estado).toBe(true);
    });

    test('Debe deshabilitar un dispositivo correctamente', async () => {
        const dispositivoId = 'test-device-deshabilitar';
          // Mock para deshabilitar dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });
        
        const dispositivo = await DispositivoRepositorio.deshabilitar(dispositivoId);
        
        expect(dispositivo.estado).toBe(false);
    });
});
