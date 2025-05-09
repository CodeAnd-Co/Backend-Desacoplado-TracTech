/**
 * @file Pruebas unitarias para el repositorio crearUsuarioRepositorio.
 *
 * Estas pruebas verifican:
 * - Que se inserte un usuario correctamente y se retorne su ID.
 * - Que se manejen errores al intentar insertar un usuario.
 *
 * @see https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
 */

// Mock de la conexión a la base de datos
jest.mock('../../util/bd', () => {
    return {
      query: jest.fn()
    };
  });
  
  const conexion = require('../../util/bd');
  const { crearUsuarioRepositorio } = require('../../usuarios/data/repositorios/usuarios.repositorio.js');
  
  describe('crearUsuarioRepositorio', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('debería insertar un usuario y devolver su ID', async () => {
      const usuarioMock = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasenia: '123456',
        idRol: 2
      };
  
      const resultadoMock = { insertId: 1 };
  
      // Simula la respuesta de la base de datos
      conexion.query.mockImplementation((sql, params, callback) => {
        callback(null, resultadoMock);
      });
  
      const idUsuario = await crearUsuarioRepositorio(
        usuarioMock.nombre,
        usuarioMock.correo,
        usuarioMock.contrasenia,
        usuarioMock.idRol
      );
  
      expect(conexion.query).toHaveBeenCalledWith(
        'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)',
        [usuarioMock.nombre, usuarioMock.correo, usuarioMock.contrasenia, usuarioMock.idRol],
        expect.any(Function)
      );
  
      expect(idUsuario).toBe(resultadoMock.insertId);
    });
  
    it('debería manejar errores al intentar insertar un usuario', async () => {
      const usuarioMock = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasenia: '123456',
        idRol: 2
      };
  
      const errorMock = new Error('Error de base de datos');
  
      // Simula un error en la base de datos
      conexion.query.mockImplementation((sql, params, callback) => {
        callback(errorMock, null);
      });
  
      await expect(
        crearUsuarioRepositorio(
          usuarioMock.nombre,
          usuarioMock.correo,
          usuarioMock.contrasenia,
          usuarioMock.idRol
        )
      ).rejects.toThrow('Error de base de datos');
  
      expect(conexion.query).toHaveBeenCalledWith(
        'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)',
        [usuarioMock.nombre, usuarioMock.correo, usuarioMock.contrasenia, usuarioMock.idRol],
        expect.any(Function)
      );
    });
  });