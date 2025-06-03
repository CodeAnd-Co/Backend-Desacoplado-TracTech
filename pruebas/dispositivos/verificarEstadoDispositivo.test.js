// pruebas/dispositivos/verificarEstadoDispositivo.test.js

// Mock la conexión de base de datos ANTES de importar cualquier cosa
jest.mock('../../util/servicios/bd', () => ({
    execute: jest.fn(),
    query: jest.fn(),
    getConnection: jest.fn(),
    createPool: jest.fn(() => ({
        execute: jest.fn(),
        query: jest.fn(),
        getConnection: jest.fn()
    }))
}));

const DispositivoRepositorio = require('../../dispositivo/data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../../dispositivo/data/modelos/dispositivoModelo');

// Mock del repositorio para evitar conexiones reales a la base de datos
jest.mock('../../dispositivo/data/repositorios/dispositivoRepositorio');

describe('Dispositivos - Verificar Estado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Cerrar cualquier conexión pendiente después de todas las pruebas
    afterAll(async () => {
        // Esperar un poco para que se limpien las conexiones
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('No debe vincular usuario a dispositivo deshabilitado', async () => {
        const dispositivoId = 'test-device-disabled';
        const idUsuario = 123;
        
        // Mock: dispositivo existe pero está deshabilitado
        const dispositivoDeshabilitado = new DispositivoModelo(dispositivoId, false, null);
        DispositivoRepositorio.obtenerPorId.mockResolvedValue(dispositivoDeshabilitado);
        DispositivoRepositorio.obtenerDispositivosDeUsuario.mockResolvedValue([]);

        // Simular controlador
        const resultado = await simularVerificacionEstado(dispositivoId, idUsuario);

        expect(resultado.estado).toBe(false);
        expect(resultado.mensaje).toBe('Dispositivo deshabilitado');
        expect(DispositivoRepositorio.vincularDispositivo).not.toHaveBeenCalled();
    });

    test('Debe vincular usuario a dispositivo habilitado sin usuario', async () => {
        const dispositivoId = 'test-device-enabled';
        const idUsuario = 123;
        
        // Mock: dispositivo habilitado sin usuario
        const dispositivoSinUsuario = new DispositivoModelo(dispositivoId, true, null);
        const dispositivoVinculado = new DispositivoModelo(dispositivoId, true, idUsuario);
        
        DispositivoRepositorio.obtenerPorId.mockResolvedValue(dispositivoSinUsuario);
        DispositivoRepositorio.obtenerDispositivosDeUsuario.mockResolvedValue([]);
        DispositivoRepositorio.vincularDispositivo.mockResolvedValue(dispositivoVinculado);

        const resultado = await simularVerificacionEstado(dispositivoId, idUsuario);

        expect(resultado.estado).toBe(true);
        expect(DispositivoRepositorio.vincularDispositivo).toHaveBeenCalledWith(dispositivoId, idUsuario);
    });

    test('No debe vincular si dispositivo ya está vinculado a otro usuario', async () => {
        const dispositivoId = 'test-device-occupied';
        const idUsuario = 123;
        const otroUsuario = 456;

        // Mock: dispositivo vinculado a otro usuario
        const dispositivoOcupado = new DispositivoModelo(dispositivoId, true, otroUsuario);
        DispositivoRepositorio.obtenerPorId.mockResolvedValue(dispositivoOcupado);
        DispositivoRepositorio.obtenerDispositivosDeUsuario.mockResolvedValue([]);

        const resultado = await simularVerificacionEstado(dispositivoId, idUsuario);

        expect(resultado.estado).toBe(false);
        expect(resultado.codigo).toBe('DISPOSITIVO_AJENO');
        expect(resultado.mensaje).toBe('Este dispositivo pertenece a otro usuario');
    });

    test('Debe crear y vincular dispositivo nuevo', async () => {
        const dispositivoId = 'test-device-new';
        const idUsuario = 123;
        
        // Mock: dispositivo no existe
        const dispositivoNuevo = new DispositivoModelo(dispositivoId, true, idUsuario);
        DispositivoRepositorio.obtenerPorId.mockResolvedValue(null);
        DispositivoRepositorio.obtenerDispositivosDeUsuario.mockResolvedValue([]);
        DispositivoRepositorio.registrarOActualizar.mockResolvedValue(dispositivoNuevo);

        const resultado = await simularVerificacionEstado(dispositivoId, idUsuario);

        expect(resultado.estado).toBe(true);
        expect(DispositivoRepositorio.registrarOActualizar).toHaveBeenCalledWith(dispositivoId, idUsuario);
    });

    test('No debe permitir múltiples dispositivos al mismo usuario', async () => {
        const dispositivoId = 'test-device-new-2';
        const idUsuario = 123;
        
        // Mock: usuario ya tiene un dispositivo
        const dispositivoExistente = new DispositivoModelo('device-1', true, idUsuario);
        DispositivoRepositorio.obtenerPorId.mockResolvedValue(null);
        DispositivoRepositorio.obtenerDispositivosDeUsuario.mockResolvedValue([dispositivoExistente]);

        const resultado = await simularVerificacionEstado(dispositivoId, idUsuario);

        expect(resultado.estado).toBe(false);
        expect(resultado.codigo).toBe('MULTIPLES_DISPOSITIVOS');
        expect(resultado.mensaje).toBe('Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.');
    });
});

// Función auxiliar para simular la lógica del controlador
async function simularVerificacionEstado(dispositivoId, idUsuario) {
    try {
        let dispositivo = await DispositivoRepositorio.obtenerPorId(dispositivoId);
        const dispositivosUsuario = await DispositivoRepositorio.obtenerDispositivosDeUsuario(idUsuario);
        
        if (dispositivo) {
            if (dispositivo.estaVinculado()) {
                if (!dispositivo.estaVinculadoA(idUsuario)) {
                    return {
                        mensaje: 'Este dispositivo pertenece a otro usuario',
                        estado: false,
                        codigo: 'DISPOSITIVO_AJENO'
                    };
                }
            } else {
                if (dispositivosUsuario.length > 0) {
                    return {
                        mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                        estado: false,
                        codigo: 'MULTIPLES_DISPOSITIVOS'
                    };
                }
                
                if (dispositivo.estado) {
                    dispositivo = await DispositivoRepositorio.vincularDispositivo(dispositivoId, idUsuario);
                }
            }
        } else {
            if (dispositivosUsuario.length > 0) {
                return {
                    mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                    estado: false,
                    codigo: 'MULTIPLES_DISPOSITIVOS'
                };
            }
            
            dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoId, idUsuario);
        }

        return {
            mensaje: dispositivo.estado ? 'Dispositivo activo' : 'Dispositivo deshabilitado',
            estado: dispositivo.estado,
            vinculado: dispositivo.estaVinculado(),
            idUsuario: dispositivo.idUsuario
        };
    } catch {
        return { 
            mensaje: 'Error interno del servidor',
            estado: false 
        };
    }
}