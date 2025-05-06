// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const { modificarUsuario: modificarUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');
const bcrypt = require('bcrypt');
const validador = require('validator');

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
        const { error, datosSanitizados } = validarYLimpiarUsuario(peticion.body);

        if (error) {
            return respuesta.status(400).json({ message: error });
        }
      
        const { idUsuario, nombre, correo, contrasenia } = datosSanitizados;
    
        // TODO: Asegurarme de que el número de salt sea el correcto
        const hashContrasenia = await bcrypt.hash(contrasenia, 10);
    
        await modificarUsuarioRepositorio(idUsuario, nombre, correo, hashContrasenia);
    
        return respuesta.status(200).json({ message: 'Usuario modificado exitosamente' });

    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        return respuesta.status(500).json({ message: 'Error interno del servidor' });
    }
}

/**
 * Valida y sanitiza los datos para modificar un usuario
 * @param {object} datos - Datos del usuario
 * @returns {{ error: string|null, datosSanitizados: object|null }}
 */
function validarYLimpiarUsuario(datos) {
    let { idUsuario, nombre, correo, contrasenia } = datos;
  
    if (!idUsuario || !nombre || !correo || !contrasenia) {
      return { error: 'Faltan datos requeridos para modificar el usuario', datosSanitizados: null };
    }
  
    if (!validator.isInt(idUsuario.toString())) {
      return { error: 'ID inválido', datosSanitizados: null };
    }
  
    if (!validator.isEmail(correo)) {
      return { error: 'Correo inválido', datosSanitizados: null };
    }
  
    // Sanitización
    const datosSanitizados = {
      idUsuario: parseInt(idUsuario),
      nombre: validator.escape(nombre.trim()),
      correo: validator.normalizeEmail(correo.trim()),
      contrasenia: contrasenia.trim() // Hash se hace aparte
    };
  
    return { error: null, datosSanitizados };
  }