// pruebas/dispositivos/vinculacionDispositivos.test.js
// Pruebas unitarias para la funcionalidad de vinculación de dispositivos con usuarios

const DispositivoRepositorio = require('../../dispositivo/data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../../dispositivo/data/modelos/dispositivoModelo');

// Mock de la conexión de base de datos
jest.mock('../../util/servicios/bd', () => ({
    execute: jest.fn(),
    query: jest.fn()
}));

const mockConexion = require('../../util/servicios/bd');

describe('Vinculación de Dispositivos con Usuarios', () => {
    let repositorio;
    
    beforeEach(() => {
        repositorio = new DispositivoRepositorio();
        jest.clearAllMocks();
    });

    describe('Vincular Dispositivo a Usuario', () => {
        test('Debe vincular un dispositivo exitosamente', async () => {
            const dispositivoId = 'test-device-123';
            const usuarioId = 1;
            
            // Mock para la actualización de vinculación
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 1 });
            });
            
            const resultado = await repositorio.vincularDispositivo(dispositivoId, usuarioId);
            
            expect(resultado).toBe(true);
            expect(mockConexion.execute).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE dispositivos SET'),
                expect.arrayContaining([usuarioId, dispositivoId]),
                expect.any(Function)
            );
        });

        test('Debe fallar si el dispositivo no existe', async () => {
            const dispositivoId = 'device-inexistente';
            const usuarioId = 1;
            
            // Mock para dispositivo no encontrado
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 0 });
            });
            
            const resultado = await repositorio.vincularDispositivo(dispositivoId, usuarioId);
            
            expect(resultado).toBe(false);
        });

        test('Debe manejar errores de base de datos', async () => {
            const dispositivoId = 'test-device-123';
            const usuarioId = 1;
            
            // Mock para error de base de datos
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(new Error('Error de conexión'), null);
            });
            
            await expect(repositorio.vincularDispositivo(dispositivoId, usuarioId))
                .rejects.toThrow('Error de conexión');
        });
    });

    describe('Liberar Dispositivos de Usuario', () => {
        test('Debe liberar todos los dispositivos de un usuario', async () => {
            const usuarioId = 1;
            
            // Mock para liberación exitosa
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 3 }); // 3 dispositivos liberados
            });
            
            const resultado = await repositorio.liberarDispositivosDeUsuario(usuarioId);
            
            expect(resultado).toBe(3);
            expect(mockConexion.execute).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE dispositivos SET id_usuario_FK = NULL'),
                [usuarioId],
                expect.any(Function)
            );
        });

        test('Debe retornar 0 si el usuario no tiene dispositivos', async () => {
            const usuarioId = 999;
            
            // Mock para usuario sin dispositivos
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, { affectedRows: 0 });
            });
            
            const resultado = await repositorio.liberarDispositivosDeUsuario(usuarioId);
            
            expect(resultado).toBe(0);
        });
    });

    describe('Obtener Dispositivos de Usuario', () => {
        test('Debe retornar dispositivos vinculados al usuario', async () => {
            const usuarioId = 1;
            const dispositivosMock = [
                {
                    id: 'device-1',
                    nombre: 'Dispositivo 1',
                    activo: 1,
                    id_usuario: 1,
                    fecha_vinculacion: '2024-01-01 10:00:00'
                },
                {
                    id: 'device-2',
                    nombre: 'Dispositivo 2',
                    activo: 1,
                    id_usuario: 1,
                    fecha_vinculacion: '2024-01-02 11:00:00'
                }
            ];
            
            // Mock para consulta exitosa
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, dispositivosMock);
            });
            
            const resultado = await repositorio.obtenerDispositivosDeUsuario(usuarioId);
            
            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toBeInstanceOf(DispositivoModelo);
            expect(resultado[0].id).toBe('device-1');
            expect(resultado[0].estaVinculado()).toBe(true);
        });

        test('Debe retornar array vacío si el usuario no tiene dispositivos', async () => {
            const usuarioId = 999;
            
            // Mock para usuario sin dispositivos
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, []);
            });
            
            const resultado = await repositorio.obtenerDispositivosDeUsuario(usuarioId);
            
            expect(resultado).toEqual([]);
        });
    });

    describe('Obtener Vinculaciones', () => {
        test('Debe retornar todas las vinculaciones con información del usuario', async () => {
            const vinculacionesMock = [
                {
                    id: 'device-1',
                    nombre: 'Dispositivo 1',
                    activo: 1,
                    id_usuario: 1,
                    fecha_vinculacion: '2024-01-01 10:00:00',
                    nombre_usuario: 'Juan Pérez',
                    correo_usuario: 'juan@test.com'
                },
                {
                    id: 'device-2',
                    nombre: 'Dispositivo 2',
                    activo: 1,
                    id_usuario: 2,
                    fecha_vinculacion: '2024-01-02 11:00:00',
                    nombre_usuario: 'María García',
                    correo_usuario: 'maria@test.com'
                }
            ];
            
            // Mock para consulta de vinculaciones
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, vinculacionesMock);
            });
            
            const resultado = await repositorio.obtenerVinculaciones();
            
            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toHaveProperty('nombre_usuario', 'Juan Pérez');
            expect(resultado[1]).toHaveProperty('correo_usuario', 'maria@test.com');
        });

        test('Debe manejar el caso sin vinculaciones', async () => {
            // Mock para sin vinculaciones
            mockConexion.execute.mockImplementation((query, params, callback) => {
                callback(null, []);
            });
            
            const resultado = await repositorio.obtenerVinculaciones();
            
            expect(resultado).toEqual([]);
        });
    });

    describe('DispositivoModelo - Métodos de Vinculación', () => {
        test('estaVinculado debe retornar true si tiene usuario asignado', () => {
            const dispositivo = new DispositivoModelo(
                'device-1',
                'Test Device',
                'Descripción',
                true,
                1, // id_usuario
                '2024-01-01 10:00:00'
            );
            
            expect(dispositivo.estaVinculado()).toBe(true);
        });

        test('estaVinculado debe retornar false si no tiene usuario asignado', () => {
            const dispositivo = new DispositivoModelo(
                'device-1',
                'Test Device',
                'Descripción',
                true,
                null, // sin usuario
                null
            );
            
            expect(dispositivo.estaVinculado()).toBe(false);
        });

        test('estaVinculadoA debe verificar vinculación a usuario específico', () => {
            const dispositivo = new DispositivoModelo(
                'device-1',
                'Test Device',
                'Descripción',
                true,
                1, // id_usuario
                '2024-01-01 10:00:00'
            );
            
            expect(dispositivo.estaVinculadoA(1)).toBe(true);
            expect(dispositivo.estaVinculadoA(2)).toBe(false);
        });

        test('vincularUsuario debe establecer la vinculación', () => {
            const dispositivo = new DispositivoModelo(
                'device-1',
                'Test Device',
                'Descripción',
                true
            );
            
            const usuarioId = 1;
            dispositivo.vincularUsuario(usuarioId);
            
            expect(dispositivo.id_usuario).toBe(usuarioId);
            expect(dispositivo.fecha_vinculacion).toBeDefined();
            expect(dispositivo.estaVinculado()).toBe(true);
        });

        test('liberarVinculacion debe remover la vinculación', () => {
            const dispositivo = new DispositivoModelo(
                'device-1',
                'Test Device',
                'Descripción',
                true,
                1, // usuario vinculado
                '2024-01-01 10:00:00'
            );
            
            dispositivo.liberarVinculacion();
            
            expect(dispositivo.id_usuario).toBeNull();
            expect(dispositivo.fecha_vinculacion).toBeNull();
            expect(dispositivo.estaVinculado()).toBe(false);
        });
    });
});

describe('Integración - Flujo Completo de Vinculación', () => {
    let repositorio;
    
    beforeEach(() => {
        repositorio = new DispositivoRepositorio();
        jest.clearAllMocks();
    });

    test('Flujo completo: crear, vincular, verificar y liberar dispositivo', async () => {
        const dispositivoId = 'integration-test-device';
        const usuarioId = 1;
        
        // 1. Crear dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { insertId: 1, affectedRows: 1 });
        });
        
        const dispositivoCreado = await repositorio.crear(dispositivoId, 'Test Device', 'Descripción de prueba');
        expect(dispositivoCreado.id).toBe(dispositivoId);
        
        // 2. Vincular dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });
        
        const vinculacionExitosa = await repositorio.vincularDispositivo(dispositivoId, usuarioId);
        expect(vinculacionExitosa).toBe(true);
        
        // 3. Verificar vinculación
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, [{
                id: dispositivoId,
                nombre: 'Test Device',
                descripcion: 'Descripción de prueba',
                activo: 1,
                id_usuario_FK: usuarioId,
                fecha_vinculacion: '2024-01-01 10:00:00',
                fecha_registro: '2024-01-01 09:00:00',
                fecha_ultima_actividad: '2024-01-01 10:00:00',
                metadata: null
            }]);
        });
        
        const dispositivoVinculado = await repositorio.obtenerPorId(dispositivoId);
        expect(dispositivoVinculado.estaVinculadoA(usuarioId)).toBe(true);
        
        // 4. Liberar dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });
        
        const dispositivosLiberados = await repositorio.liberarDispositivosDeUsuario(usuarioId);
        expect(dispositivosLiberados).toBe(1);
    });
});
