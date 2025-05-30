// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const { modificarUsuario } = require('../data/repositorios/modificarUsuarioRepositorio.js');
const { validarYLimpiarUsuario } = require('../../util/servicios/validarUsuario.js');
const bcrypt = require('bcrypt');


/**
 * Esta función valida y sanitiza los datos recibidos desde el cuerpo de la petición HTTP.
 * Posteriormente, cifra la nueva contraseña con bcrypt (saltRounds = 10) y realiza
 * la actualización en la base de datos a través del repositorio correspondiente.
 *
 * @async
 * @function modificarUsuario
 * @param {import('express').Request} peticion - Objeto de la solicitud HTTP con los datos del usuario a modificar.
 * @param {import('express').Response} respuesta - Objeto de la respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} No retorna directamente, pero responde al cliente con el estado de la operación:
 */
exports.modificarUsuario = async (peticion, respuesta) => {
  try {
    if (!peticion.body) {
      return respuesta.status(400).json({
        mensaje: 'No se recibieron datos para modificar el usuario'
      });
    }

    const { error, datosSanitizados } = validarYLimpiarUsuario(peticion.body);

    if (error) {
      console.error('Error de validación:', error);
      return respuesta.status(400).json({ mensaje: error });
    }

    const { idUsuario, nombre, correo, contrasenia, idRol } = datosSanitizados;

    const cambios = {};
    if (nombre) cambios.nombre = nombre;
    if (correo) cambios.correo = correo;
    if (contrasenia) {
      // 12 iteraciones para el hash
      const contraseniaHasheada = await bcrypt.hash(contrasenia, 12);
      cambios.contrasenia = contraseniaHasheada;
    }
    if (idRol) cambios.idRol = idRol;

    const datos = await modificarUsuario(idUsuario, cambios);
    if (datos && datos.estado) {
      return respuesta.status(datos.estado).json({ mensaje: datos.mensaje });
    }

    return respuesta.status(200).json({ mensaje: 'Usuario modificado exitosamente' });

  } catch (error) {
    if (error.estado && error.mensaje) {
      return respuesta.status(error.estado).json({ mensaje: error.mensaje });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return respuesta.status(400).json({ mensaje: 'El correo ya está en uso' });
    }

    return respuesta.status(500).json({ mensaje: error });
  }
}
