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
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Vincular Dispositivo a Usuario', () => {
        test('Debe vincular un dispositivo exitosamente', async () => {
            const dispositivoId = 'test-device-123';
            const usuarioId = 1;

            // Mock para verificar que el usuario existe
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('SELECT idUsuario FROM usuario');
                callback(null, [{ idUsuario: usuarioId }]);
            });

            // Mock para la actualización del dispositivo
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('UPDATE dispositivos');
                expect(params).toEqual([usuarioId, dispositivoId]);
                callback(null, { affectedRows: 1 });
            });

            // Mock para obtener el dispositivo actualizado
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('SELECT id, estado, id_usuario_FK');
                callback(null, [{
                    id: dispositivoId,
                    estado: 1,
                    id_usuario_FK: usuarioId
                }]);
            });

            const resultado = await DispositivoRepositorio.vincularDispositivo(dispositivoId, usuarioId);

            expect(resultado).toBeInstanceOf(DispositivoModelo);
            expect(resultado.id).toBe(dispositivoId);
            expect(resultado.idUsuario).toBe(usuarioId);
            expect(mockConexion.execute).toHaveBeenCalledTimes(3);
        });

        test('Debe fallar si el dispositivo no existe', async () => {
            const dispositivoId = 'test-device-123';
            const usuarioId = 1;

            // Mock para verificar que el usuario existe
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(null, [{ idUsuario: usuarioId }]);
            });

            // Mock para la actualización (dispositivo no existe)
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(null, { affectedRows: 0 });
            });
            
            await expect(DispositivoRepositorio.vincularDispositivo(dispositivoId, usuarioId))
                .rejects.toThrow('Dispositivo no encontrado');
        });

        test('Debe manejar errores de base de datos', async () => {
            const dispositivoId = 'test-device-123';
            const usuarioId = 1;

            // Mock para simular error en la verificación del usuario
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(new Error('Error de conexión'), null);
            });
            
            await expect(DispositivoRepositorio.vincularDispositivo(dispositivoId, usuarioId))
                .rejects.toThrow('Error al acceder a la base de datos');
        });
    });

    describe('Liberar Dispositivos de Usuario', () => {
        test('Debe liberar todos los dispositivos de un usuario', async () => {
            const usuarioId = 1;

            // Mock para la liberación de dispositivos
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('UPDATE dispositivos');
                expect(query).toContain('SET id_usuario_FK = NULL');
                expect(params).toEqual([usuarioId]);
                callback(null, { affectedRows: 3 });
            });

            const resultado = await DispositivoRepositorio.liberarDispositivosDeUsuario(usuarioId);

            expect(resultado).toBe(3);
            expect(mockConexion.execute).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE dispositivos'),
                [usuarioId],
                expect.any(Function)
            );
        });

        test('Debe retornar 0 si el usuario no tiene dispositivos', async () => {
            const usuarioId = 1;

            // Mock para la liberación (sin dispositivos vinculados)
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(null, { affectedRows: 0 });
            });

            const resultado = await DispositivoRepositorio.liberarDispositivosDeUsuario(usuarioId);

            expect(resultado).toBe(0);
        });
    });

    describe('Obtener Dispositivos de Usuario', () => {
        test('Debe retornar dispositivos vinculados al usuario', async () => {
            const usuarioId = 1;

            // Mock para obtener dispositivos del usuario
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('WHERE id_usuario_FK = ?');
                expect(params).toEqual([usuarioId]);
                callback(null, [
                    {
                        id: 'device-1',
                        estado: 1,
                        id_usuario_FK: usuarioId
                    },
                    {
                        id: 'device-2',
                        estado: 1,
                        id_usuario_FK: usuarioId
                    }
                ]);
            });

            const resultado = await DispositivoRepositorio.obtenerDispositivosDeUsuario(usuarioId);

            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toBeInstanceOf(DispositivoModelo);
            expect(resultado[0].id).toBe('device-1');
            expect(resultado[0].idUsuario).toBe(usuarioId);
        });

        test('Debe retornar array vacío si el usuario no tiene dispositivos', async () => {
            const usuarioId = 1;

            // Mock para obtener dispositivos (sin resultados)
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(null, []);
            });

            const resultado = await DispositivoRepositorio.obtenerDispositivosDeUsuario(usuarioId);

            expect(resultado).toEqual([]);
        });
    });

    describe('Obtener Vinculaciones', () => {
        test('Debe retornar todas las vinculaciones con información del usuario', async () => {
            // Mock para obtener vinculaciones
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                expect(query).toContain('LEFT JOIN usuario u');
                callback(null, [
                    {
                        id: 'device-1',
                        estado: 1,
                        id_usuario_FK: 1,
                        nombre_usuario: 'Juan Pérez',
                        correo_usuario: 'juan@example.com'
                    },
                    {
                        id: 'device-2',
                        estado: 1,
                        id_usuario_FK: 2,
                        nombre_usuario: 'María García',
                        correo_usuario: 'maria@example.com'
                    }
                ]);
            });

            const resultado = await DispositivoRepositorio.obtenerVinculaciones();

            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toHaveProperty('dispositivo');
            expect(resultado[0]).toHaveProperty('usuario');
            expect(resultado[0].usuario.nombre).toBe('Juan Pérez');
        });

        test('Debe manejar el caso sin vinculaciones', async () => {
            // Mock para obtener vinculaciones (sin resultados)
            mockConexion.execute.mockImplementationOnce((query, params, callback) => {
                callback(null, []);
            });

            const resultado = await DispositivoRepositorio.obtenerVinculaciones();

            expect(resultado).toEqual([]);
        });
    });

    describe('DispositivoModelo - Métodos de Vinculación', () => {
        test('estaVinculado debe retornar true si tiene usuario asignado', () => {
            const dispositivo = new DispositivoModelo(
                'test-device-123',
                true,
                1
            );
            
            expect(dispositivo.estaVinculado()).toBe(true);
        });

        test('estaVinculado debe retornar false si no tiene usuario asignado', () => {
            const dispositivo = new DispositivoModelo(
                'test-device-123',
                true,
                null
            );
            
            expect(dispositivo.estaVinculado()).toBe(false);
        });

        test('estaVinculadoA debe verificar vinculación a usuario específico', () => {
            const dispositivo = new DispositivoModelo(
                'test-device-123',
                true,
                1
            );
            
            expect(dispositivo.estaVinculadoA(1)).toBe(true);
            expect(dispositivo.estaVinculadoA(2)).toBe(false);
        });

        test('vincularUsuario debe establecer la vinculación', () => {
            const dispositivo = new DispositivoModelo(
                'test-device-123',
                true,
                null
            );
            const usuarioId = 1;
            
            dispositivo.vincularUsuario(usuarioId);
            
            expect(dispositivo.idUsuario).toBe(usuarioId);
            expect(dispositivo.estaVinculado()).toBe(true);
        });

        test('liberarVinculacion debe remover la vinculación', () => {
            const dispositivo = new DispositivoModelo(
                'test-device-123',
                true,
                1
            );
            
            dispositivo.liberarVinculacion();
            
            expect(dispositivo.idUsuario).toBeNull();
            expect(dispositivo.estaVinculado()).toBe(false);
        });
    });
});

describe('Integración - Flujo Completo de Vinculación', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Flujo completo: crear, vincular, verificar y liberar dispositivo', async () => {
        const dispositivoId = 'test-device-integration';
        const usuarioId = 1;

        // 1. Mock para registrar/actualizar dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            // Verificar usuario existe
            callback(null, [{ idUsuario: usuarioId }]);
        });
        
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            // Insertar/actualizar dispositivo
            callback(null, { insertId: 1 });
        });
        
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            // Obtener dispositivo creado
            callback(null, [{
                id: dispositivoId,
                estado: 1,
                id_usuario_FK: usuarioId
            }]);
        });

        const dispositivoCreado = await DispositivoRepositorio.registrarOActualizar(dispositivoId, usuarioId);
        expect(dispositivoCreado.id).toBe(dispositivoId);

        // 2. Mock para vincular dispositivo (ya vinculado en el paso anterior)
        expect(dispositivoCreado.idUsuario).toBe(usuarioId);

        // 3. Mock para verificar vinculación
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, [{
                id: dispositivoId,
                estado: 1,
                id_usuario_FK: usuarioId
            }]);
        });

        const dispositivoVerificado = await DispositivoRepositorio.obtenerPorId(dispositivoId);
        expect(dispositivoVerificado.estaVinculadoA(usuarioId)).toBe(true);

        // 4. Mock para liberar dispositivo
        mockConexion.execute.mockImplementationOnce((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });        const dispositivosLiberados = await DispositivoRepositorio.liberarDispositivosDeUsuario(usuarioId);
        expect(dispositivosLiberados).toBe(1);
    });
});
