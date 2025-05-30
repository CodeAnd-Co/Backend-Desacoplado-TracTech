/**
 * @file Pruebas unitarias para el controlador consultarUsuarios.
 * 
 * Estas pruebas verifican:
 * - Que se retorne una lista de usuarios con código 200.
 * - Que se maneje correctamente el caso de lista vacía con código 404.
 * - Que los errores internos sean capturados y respondidos con código 500.
 * 
 * @see https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
 */

// Mock del repositorio antes de las importaciones
jest.mock('../../usuarios/data/repositorios/consultarUsuariosRepositorio.js');

// Importa estos módulos antes que cualquier otra cosa
jest.mock('../../util/servicios/bd', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn((callback) => callback(null)),
      query: jest.fn((sql, params, callback) => callback(null, [])),
      end: jest.fn()
    }))
  };
});

// Ahora, importa los módulos de prueba a continuación
const { consultarUsuarios } = require('../../usuarios/controladores/consultarUsuarios.controlador.js');
const { consultarUsuarios: consultarUsuariosRepositorio } = require('../../usuarios/data/repositorios/consultarUsuariosRepositorio.js');

// Mock de los objetos de Express
const mockPeticion = {};
const mockRespuesta = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

// Agrupa las pruebas relacionadas con la función consultarUsuarios
describe('consultarUsuarios', () => {

  // Limpia los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver una lista de usuarios y status 200', async () => {
    const usuariosMock = [
      { id: 1, nombre: 'Juan', correo: 'juan@example.com' },
      { id: 2, nombre: 'Ana', correo: 'ana@example.com' }
    ];

    consultarUsuariosRepositorio.mockResolvedValue(usuariosMock);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(200);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'Consulta de usuarios exitosa',
      usuarios: usuariosMock
    });
  });

  it('debería devolver mensaje de error y status 404 si no hay usuarios', async () => {
    consultarUsuariosRepositorio.mockResolvedValue([]);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(404);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'No se encontraron usuarios'
    });
  });

  it('debería manejar correctamente cuando el repositorio retorna null', async () => {
    consultarUsuariosRepositorio.mockResolvedValue(null);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(404);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'No se encontraron usuarios'
    });
  });

  it('debería manejar correctamente cuando el repositorio retorna undefined', async () => {
    consultarUsuariosRepositorio.mockResolvedValue(undefined);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(404);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'No se encontraron usuarios'
    });
  });

  it('debería devolver solo un usuario cuando hay uno disponible', async () => {
    const usuarioUnico = [{ id: 1, nombre: 'Usuario Solo', correo: 'solo@example.com' }];
    
    consultarUsuariosRepositorio.mockResolvedValue(usuarioUnico);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(200);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'Consulta de usuarios exitosa',
      usuarios: usuarioUnico
    });
  });

  it('debería manejar errores de conexión a la base de datos', async () => {
    const consoleErrorOriginal = console.error;
    console.error = jest.fn();

    const errorConexion = new Error('Connection timeout');
    consultarUsuariosRepositorio.mockRejectedValue(errorConexion);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledWith(500);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'Error interno del servidor'
    });

    console.error = consoleErrorOriginal;
  });

  it('debería llamar al repositorio exactamente una vez', async () => {
    const usuariosMock = [{ id: 1, nombre: 'Test', correo: 'test@example.com' }];
    consultarUsuariosRepositorio.mockResolvedValue(usuariosMock);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(consultarUsuariosRepositorio).toHaveBeenCalledTimes(1);
  });

  it('debería verificar que status y json sean llamados exactamente una vez en caso exitoso', async () => {
    const usuariosMock = [{ id: 1, nombre: 'Test', correo: 'test@example.com' }];
    consultarUsuariosRepositorio.mockResolvedValue(usuariosMock);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    expect(mockRespuesta.status).toHaveBeenCalledTimes(1);
    expect(mockRespuesta.json).toHaveBeenCalledTimes(1);
  });
});