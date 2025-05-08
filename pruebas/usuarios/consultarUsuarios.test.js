/**
 * @file Pruebas unitarias para el controlador consultarUsuarios.
 * 
 * Estas pruebas verifican:
 * - Que se retorne una lista de usuarios con código 200.
 * - Que se maneje correctamente el caso de lista vacía con código 404.
 * - Que los errores internos sean capturados y respondidos con código 500.
 * 
 * @see https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2
 */


// Importa estos módulos antes que cualquier otra cosa
jest.mock('../../util/bd', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn((callback) => callback(null)),
      query: jest.fn((sql, params, callback) => callback(null, [])),
      end: jest.fn()
    }))
  };
});

// Ahora, importa los módulos de prueba a continuación
const { consultarUsuarios } = require('../../usuarios/controladores/consultarUsuarios.controlador.js'); // Ajusta la ruta según tu estructura de proyecto
const { consultarUsuarios: consultarUsuariosRepositorio } = require('../../usuarios/data/repositorios/usuarios.repositorio.js');

// Mock del módulo de repositorios, si es necesario
jest.mock('../../usuarios/data/repositorios/usuarios.repositorio.js');

// Mock de los objetos de Express
const mockPeticion = {};
const mockRespuesta = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

// Agrupa las pruebas relacionadas con la función consultarUsuarios
describe('consultarUsuarios', () => {

  // Limpia los mocks antes de cada prueba
  // Esto asegura que cada prueba comience con un estado limpio
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver una lista de usuarios y status 200', async () => {
    const usuariosMock = [
      { id: 1, nombre: 'Juan', correo: 'juan@example.com' },
      { id: 2, nombre: 'Ana', correo: 'ana@example.com' }
    ];

    // Simula la respuesta del repositorio de usuarios
    consultarUsuariosRepositorio.mockResolvedValue(usuariosMock);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    // Verifica que las respuestas sean las esperadas
    expect(mockRespuesta.status).toHaveBeenCalledWith(200);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'Consulta de usuarios exitosa',
      usuarios: usuariosMock
    });
  });

  it('debería devolver mensaje de error y status 404 si no hay usuarios', async () => {
    consultarUsuariosRepositorio.mockResolvedValue([]);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    // Verifica que las respuestas sean las esperadas
    expect(mockRespuesta.status).toHaveBeenCalledWith(404);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'No se encontraron usuarios'
    });
  });

  it('debería manejar errores internos del servidor', async () => {
    // Guarda la referencia original de console.error
    const consoleErrorOriginal = console.error;
    // Sobrescribe console.error para que haga nada durante esta prueba
    console.error = jest.fn();

    const errorMock = new Error('Error de base de datos');
    consultarUsuariosRepositorio.mockRejectedValue(errorMock);

    await consultarUsuarios(mockPeticion, mockRespuesta);

    // Verifica que las respuestas sean las esperadas
    expect(mockRespuesta.status).toHaveBeenCalledWith(500);
    expect(mockRespuesta.json).toHaveBeenCalledWith({
      mensaje: 'Error interno del servidor'
    });

    // Asegúrate que se llamó al console.error dentro del controlador
    expect(console.error).toHaveBeenCalledWith('Error al consultar usuarios:', errorMock);

    // Restaura console.error al estado original
    console.error = consoleErrorOriginal;
  });
});