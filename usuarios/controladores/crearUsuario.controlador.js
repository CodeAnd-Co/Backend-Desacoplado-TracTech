// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const bcrypt = require('bcrypt'); // Importa bcrypt
const { crearUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');

/**
 * Controlador para crear un nuevo usuario
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con el ID del nuevo usuario o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.crearUsuarioControlador = async (peticion, respuesta) => {
  console.log('controlador crearUsuarioControlador');
  try {
    /* eslint-disable-next-line camelcase */
    const { nombre, correo, contrasenia, idRolFK } = peticion.body;
    /* eslint-disable-next-line camelcase */
    if (!nombre || !correo || !contrasenia || !idRolFK) {
      return respuesta.status(400).json({
        mensaje: 'Un campo requerido está vacío',
      });
    }

    // Cifrar la contraseña antes de guardarla
    const rondasSalteadas = 12; // Número de rondas de sal
    const contraseniaCifrada = await bcrypt.hash(contrasenia, rondasSalteadas);
    console.log('Contraseña cifrada:', contraseniaCifrada);

    // Llamar al repositorio con la contraseña cifrada
     
    const idInsertado = await crearUsuarioRepositorio(nombre, correo, contraseniaCifrada, idRolFK);
    console.log('ID del usuario insertado:', idInsertado);

    respuesta.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      id: idInsertado,
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    respuesta.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
};
