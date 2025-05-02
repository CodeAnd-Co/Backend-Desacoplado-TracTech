// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const conexion = require('../../../util/bd.js');
const { Usuario } = require('../modelos/usuarios.js');

/**
 * Consulta todos los usuarios en la base de datos
  * @returns {Promise<Array<Usuario>>} Promesa que resuelve con un array de objetos Usuario
 * @throws {Error} Error si no se pueden recuperar los usuarios o no existen
 */
function consultarUsuariosRepositorio() {
  const consulta = 'SELECT idUsuario, Nombre, Correo FROM usuario';

  return new Promise((resolver, rechazar) => {
    conexion.query(consulta, (error, resultados) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        return rechazar(error);
      }

      if (!resultados.length) {
        return rechazar(new Error('No se encontraron usuarios'));
      }

      const usuarios = resultados
        .filter(usuario => usuario.idUsuario && usuario.Nombre && usuario.Correo)
        .map(usuario => new Usuario({
          id: usuario.idUsuario,
          nombre: usuario.Nombre,
          correo: usuario.Correo
        }));

      resolver(usuarios);
    });
  });
}

/**
 * Agrega un nuevo usuario a la base de datos
 * @param {Usuario} usuario Objeto Usuario con los datos del nuevo usuario
 * @returns {Promise<number>} Promesa que resuelve con el ID del usuario insertado
 * @throws {Error} Error si no se puede insertar el usuario
 */
function crearUsuarioRepositorio(nombre, correo, contrasenia, idRol_FK) {
  console.log('Datos a insertar:', nombre, correo, contrasenia, idRol_FK);
  const consulta = 'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)';
  const valores = [nombre, correo, contrasenia, idRol_FK];

  return new Promise((resolver, rechazar) => {
    conexion.query(consulta, valores, (error, resultado) => {
      if (error) {
        console.error('Error al insertar el usuario:', error);
        return rechazar(error);
      }

      resolver(resultado.insertId);
    });
  });
}


//module.exports = consultarUsuariosRepositorio;

module.exports = {
  consultarUsuariosRepositorio,
  crearUsuarioRepositorio
};