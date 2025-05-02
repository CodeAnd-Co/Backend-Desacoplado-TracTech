// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const { crearUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');
const { Usuario } = require('../data/modelos/usuarios.js');

/**
 * Controlador para crear un nuevo usuario
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con el ID del nuevo usuario o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.crearUsuarioControlador = async (peticion, respuesta) => {
  try {
    const { nombre, correo, contrasenia, idRol_FK } = peticion.body;
    console.log('Datos recibidos:', { nombre, correo, contrasenia, idRol_FK });

    if (!nombre || !correo || !contrasenia || !idRol_FK)   {
      return respuesta.status(400).json({
        mensaje: 'Un campo requerido está vacío',
      });
    }

    //const nuevoUsuario = new Usuario({ nombre, correo, contrasenia, idRol_FK });
    const idInsertado = await crearUsuarioRepositorio(nombre, correo, contrasenia, idRol_FK);
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
