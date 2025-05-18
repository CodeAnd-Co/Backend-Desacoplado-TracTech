// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const { modificarUsuario: modificarUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');
const bcrypt = require('bcrypt');
const validator = require('validator');

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

        await modificarUsuarioRepositorio(idUsuario, cambios);
    
        return respuesta.status(200).json({ mensaje: 'Usuario modificado exitosamente' });

    } catch (error) {
        return respuesta.status(500).json({ mensaje: error });
    }
}

/**
 * Valida y sanitiza los datos para modificar un usuario
 * @param {object} datos - Datos del usuario
 * @returns {{ error: string|null, datosSanitizados: object|null }}
 */
function validarYLimpiarUsuario(datos) {
  const numeroMinimoID = 1;
  const tamañoMinimoNombre = 1;
  const tamañoMaximoNombre = 50;
  const tamañoMinimoContrasenia = 8;
  const tamañoMaximoContrasenia = 50;

    let { idUsuario, nombre, correo, contrasenia, idRol } = datos;

    if(!Number.isInteger(idUsuario) || idUsuario < numeroMinimoID) {
      return {
        error: 'El identificador de usuario debe ser un número entero mayor o igual a 1.',
        datosSanitizados: null
      };
    }

    // Validar si hay al menos un campo para modificar
    const existeNombre = typeof nombre  === 'string' && nombre.trim()  !== '';
    const existeCorreo = typeof correo === 'string' && correo.trim() !== '';
    const existeContrasenia = typeof contrasenia === 'string' && contrasenia.trim() !== '';
    const existeRol = idRol != null;

    if(!existeNombre && !existeCorreo && !existeContrasenia && !existeRol) {
      return {
        error: 'Debes enviar al menos uno de estos campos para modificar: nombre, correo, contraseña o rol.',
        datosSanitizados: null
      };
    }

    const datosSanitizados = { idUsuario: idUsuario };

    if(existeNombre) {
      const nombreRecortado = nombre.trim();
      if(nombreRecortado.length < tamañoMinimoNombre || nombreRecortado.length > tamañoMaximoNombre) {
        return {
          error: `El nombre debe tener entre ${tamañoMinimoNombre} y ${tamañoMaximoNombre} caracteres.`,
          datosSanitizados: null
        };
      }

      const regexNombre = /^[A-Za-zÀ-ÖØ-öø-ÿ\. ]+$/;
      if (!regexNombre.test(nombreRecortado)) {
        return {
          error: 'El nombre solo puede contener letras (incluidos acentos), espacios y puntos.',
          datosSanitizados: null
        };
      }

      datosSanitizados.nombre = validator.escape(nombreRecortado);
    }

    if(existeCorreo) {
      const correoRecortado = correo.trim();
      if(!validator.isEmail(correoRecortado)) {
        return {
          error: 'El correo electrónico no tiene un formato válido (p. ej. usuario@dominio.com).',
          datosSanitizados: null
        };
      }
      datosSanitizados.correo = validator.normalizeEmail(correoRecortado);
    }

    if(existeContrasenia) {
      const contraseniaRecortada = contrasenia.trim();
      if(contraseniaRecortada.length < tamañoMinimoContrasenia || contraseniaRecortada.length > tamañoMaximoContrasenia) {
        return {
          error: `La contraseña debe tener entre ${tamañoMinimoContrasenia} y ${tamañoMaximoContrasenia} caracteres.`,
          datosSanitizados: null
        };
      }
      datosSanitizados.contrasenia = contraseniaRecortada;
    }

    if(existeRol) {
      if(!Number.isInteger(idRol) || idRol <= numeroMinimoID) {
        return {
          error: 'El identificador de rol debe ser un número entero mayor o igual a 1.',
          datosSanitizados: null
        };
      }
      datosSanitizados.idRol = idRol;
    }

    return { error: null, datosSanitizados };
}
