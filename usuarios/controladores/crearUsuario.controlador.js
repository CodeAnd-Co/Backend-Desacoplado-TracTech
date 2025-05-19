// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const bcrypt = require('bcrypt');
const { crearUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');
const { validarYLimpiarUsuario }  = require('./validacionesCompartidas.js');

/**
 * Controlador para crear un nuevo usuario.
 * Valida y sanitiza con esCrear = true, cifra la contraseña
 * y llama al repositorio para insertarlo en BD.
 *
 * @async
 * @function crearUsuarioControlador
 * @param {import('express').Request}  peticion  - Datos de entrada: { nombre, correo, contrasenia, idRol }
 * @param {import('express').Response} respuesta - Objeto de respuesta de Express
 */
exports.crearUsuarioControlador = async (peticion, respuesta) => {
  try {
    // 1) Validamos y limpiamos todos los campos obligatorios
    const { error, datosSanitizados } = validarYLimpiarUsuario(peticion.body, true);
    if (error) {
      return respuesta.status(400).json({ mensaje: error });
    }

    const { nombre, correo, contrasenia, idRol } = datosSanitizados;

    // Ciframos la contraseña
    const rondasDeCifrado = 12;
    const contraseniaCifrada = await bcrypt.hash(contrasenia, rondasDeCifrado);

    const idInsertado = await crearUsuarioRepositorio(
      nombre,
      correo,
      contraseniaCifrada,
      idRol
    );

    return respuesta.status(201).json({ mensaje: 'Usuario creado exitosamente', id: idInsertado });

  } catch (error) {
    return respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
