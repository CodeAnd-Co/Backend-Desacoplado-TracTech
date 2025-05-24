/**
 * @file Pruebas unitarias para el repositorio crearUsuarioRepositorio.
 *
 * Estas pruebas verifican:
 * - Que se inserte un usuario correctamente y se retorne su ID.
 * - Que se manejen errores al intentar insertar un usuario.
 *
 * @see https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
 */

// Mock del modelo antes de las importaciones
jest.mock('../../usuarios/data/modelos/crearUsuarioModelo.js');

const { crearUsuarioRepositorio } = require('../../usuarios/data/repositorios/crearUsuarioRepositorio.js');
const modelo = require('../../usuarios/data/modelos/crearUsuarioModelo.js');

describe('crearUsuarioRepositorio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de variables de entorno necesarias para las validaciones
    process.env.LONGITUD_MAXIMA_NOMBRE_USUARIO = '100';
    process.env.LONGITUD_MAXIMA_CORREO = '100';
  });

  it('debería insertar un usuario y devolver su ID', async () => {
    const usuarioPrueba = {
      nombre: 'Juan',
      correo: 'juan@example.com',
      contrasenia: '123456',
      idRol: 2
    };

    const idUsuarioEsperado = 1;

    // Mock del modelo para simular éxito
    modelo.crearUsuario.mockResolvedValue(idUsuarioEsperado);

    const resultado = await crearUsuarioRepositorio(
      usuarioPrueba.nombre,
      usuarioPrueba.correo,
      usuarioPrueba.contrasenia,
      usuarioPrueba.idRol
    );

    expect(modelo.crearUsuario).toHaveBeenCalledWith(
      usuarioPrueba.nombre,
      usuarioPrueba.correo,
      usuarioPrueba.contrasenia,
      usuarioPrueba.idRol
    );

    expect(resultado).toEqual({
      estado: 201,
      mensaje: 'Usuario creado con éxito',
      idUsuario: idUsuarioEsperado
    });
  });

  it('debería manejar errores al intentar insertar un usuario', async () => {
    const usuarioPrueba = {
      nombre: 'Juan',
      correo: 'juan@example.com',
      contrasenia: '123456',
      idRol: 2
    };

    const errorPrueba = new Error('Error de base de datos');

    // Mock del modelo para simular error
    modelo.crearUsuario.mockRejectedValue(errorPrueba);

    const resultado = await crearUsuarioRepositorio(
      usuarioPrueba.nombre,
      usuarioPrueba.correo,
      usuarioPrueba.contrasenia,
      usuarioPrueba.idRol
    );

    expect(modelo.crearUsuario).toHaveBeenCalledWith(
      usuarioPrueba.nombre,
      usuarioPrueba.correo,
      usuarioPrueba.contrasenia,
      usuarioPrueba.idRol
    );

    expect(resultado).toEqual({
      estado: 500,
      mensaje: 'Error de conexión, intente más tarde'
    });
  });

  it('debería manejar error de correo duplicado', async () => {
    const usuarioPrueba = {
      nombre: 'Juan',
      correo: 'juan@example.com',
      contrasenia: '123456',
      idRol: 2
    };

    const errorDuplicado = {
      estado: 400,
      mensaje: 'El correo ya está registrado'
    };

    // Mock del modelo para simular error de duplicado
    modelo.crearUsuario.mockRejectedValue(errorDuplicado);

    const resultado = await crearUsuarioRepositorio(
      usuarioPrueba.nombre,
      usuarioPrueba.correo,
      usuarioPrueba.contrasenia,
      usuarioPrueba.idRol
    );

    expect(resultado).toEqual({
      estado: 400,
      mensaje: 'El correo ya está registrado'
    });
  });

  it('debería validar campos requeridos', async () => {
    const resultado = await crearUsuarioRepositorio('', '', '', '');

    expect(resultado).toEqual({
      estado: 400,
      mensaje: 'Un campo requerido está vacío'
    });
  });

  it('debería validar que idRol sea un número válido', async () => {
    const resultado = await crearUsuarioRepositorio('Juan', 'juan@test.com', '123456', 'invalid');

    expect(resultado).toEqual({
      estado: 400,
      mensaje: 'El idRol no es un número'
    });
  });

  it('debería validar rango de idRol', async () => {
    const resultado = await crearUsuarioRepositorio('Juan', 'juan@test.com', '123456', 5);

    expect(resultado).toEqual({
      estado: 400,
      mensaje: 'El idRol no es válido'
    });
  });
});