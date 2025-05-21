/**
 * @file Pruebas unitarias para el repositorio crearUsuarioRepositorio.
 *
 * Estas pruebas verifican:
 * - Que se inserte un usuario correctamente y se retorne su ID.
 * - Que se manejen errores al intentar insertar un usuario.
 *
 * @see https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
 */

// Prueba de la conexión a la base de datos
jest.mock('../../util/servicios/bd', () => {
    return {
      query: jest.fn()
    };
  });
  
  const conexion = require('../../util/servicios/bd');
  const { crearUsuarioRepositorio } = require('../../usuarios/data/repositorios/usuarios.repositorio.js');
  
  describe('crearUsuarioRepositorio', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('debería insertar un usuario y devolver su ID', async () => {
      const usuarioPrueba = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasenia: '123456',
        idRol: 2
      };
  
      const resultadoPrueba = { insertId: 1 };
  
      // Simula la respuesta de la base de datos
      conexion.query.mockImplementation((sql, params, callback) => {
        callback(null, resultadoPrueba);
      });
  
      const idUsuario = await crearUsuarioRepositorio(
        usuarioPrueba.nombre,
        usuarioPrueba.correo,
        usuarioPrueba.contrasenia,
        usuarioPrueba.idRol
      );
  
      expect(conexion.query).toHaveBeenCalledWith(
        'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)',
        [usuarioPrueba.nombre, usuarioPrueba.correo, usuarioPrueba.contrasenia, usuarioPrueba.idRol],
        expect.any(Function)
      );
  
      expect(idUsuario).toBe(resultadoPrueba.insertId);
    });
  
    it('debería manejar errores al intentar insertar un usuario', async () => {
      const usuarioPrueba = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasenia: '123456',
        idRol: 2
      };
  
      const errorPrueba = new Error('Error de base de datos');
  
      // Simula un error en la base de datos
      conexion.query.mockImplementation((sql, params, callback) => {
        callback(errorPrueba, null);
      });
  
      await expect(
        crearUsuarioRepositorio(
          usuarioPrueba.nombre,
          usuarioPrueba.correo,
          usuarioPrueba.contrasenia,
          usuarioPrueba.idRol
        )
      ).rejects.toThrow('Error de base de datos');
  
      expect(conexion.query).toHaveBeenCalledWith(
        'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)',
        [usuarioPrueba.nombre, usuarioPrueba.correo, usuarioPrueba.contrasenia, usuarioPrueba.idRol],
        expect.any(Function)
      );
    });
  });