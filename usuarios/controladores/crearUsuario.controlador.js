// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const bcrypt = require('bcrypt'); // Importa bcrypt
const { crearUsuarioRepositorio } = require('../data/repositorios/crearUsuarioRepositorio.js');

/**
 * Controlador para crear un nuevo usuario
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con el ID del nuevo usuario o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.crearUsuarioControlador = async (peticion, respuesta) => {
  try {
    const { nombre, correo, contrasenia, idRolFK } = peticion.body;
    
    if (!nombre || !correo || !contrasenia || !idRolFK) {
      return respuesta.status(400).json({
        mensaje: 'Un campo requerido está vacío',
      });
    }
    
    
    if (contrasenia.length > process.env.LONGITUD_MAXIMA_CONTRASENIA) {
      return respuesta.status(400).json({
        mensaje: `La contraseña no puede exceder los ${process.env.LONGITUD_MAXIMA_CONTRASENIA} caracteres`,
      });
    }
    
    // Cifrar la contraseña antes de guardarla
    const rondasSalteadas = 12;
    const contraseniaCifrada = await bcrypt.hash(contrasenia, rondasSalteadas);

    // Llamar al repositorio con la contraseña cifrada
    const resultado = await crearUsuarioRepositorio(nombre, correo, contraseniaCifrada, idRolFK);
    
    // Siempre retornar con el status y mensaje del repositorio
    return respuesta.status(resultado.estado).json({
      mensaje: resultado.mensaje,
      ...(resultado.idUsuario && { idUsuario: resultado.idUsuario })
    });

  } catch (error) {
    if (error.estado && error.mensaje) {
      return respuesta.status(error.estado).json({
        mensaje: error.mensaje,
      });
    }
    respuesta.status(500).json({
      mensaje: 'Error interno del servidor, intente más tarde',
    });
  }
};
