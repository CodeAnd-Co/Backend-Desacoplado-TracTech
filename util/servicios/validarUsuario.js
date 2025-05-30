const validator = require('validator');

/**
 * Valida y sanitiza los datos para modificar un usuario
 * @param {object} datos - Datos del usuario
 * @returns {{ error: string|null, datosSanitizados: object|null }}
 */
function validarYLimpiarUsuario(datos) {
  const numeroMinimoID = 1;
  const tamanioMinimoNombre = 1;
  const tamanioMaximoNombre = 50;
  const tamanioMinimoCorreo = 5;
  const tamanioMaximoCorreo = 50;
  const tamanioMinimoContrasenia = 8;
  const tamanioMaximoContrasenia = 50;

  const { idUsuario, nombre, correo, contrasenia, idRol } = datos;
  if (!idUsuario || !nombre || !correo || !contrasenia || !idRol) {
    return {
      error: 'Faltan datos requeridos en la solicitud',
      datosSanitizados: null
    };
  }

  if (!Number.isInteger(idUsuario) || idUsuario < numeroMinimoID) {
    return {
      error: 'El identificador de usuario debe ser un número entero mayor o igual a 1.',
      datosSanitizados: null
    };
  }

  // Validar si hay al menos un campo para modificar
  const existeNombre = typeof nombre === 'string' && nombre.trim() !== '';
  const existeCorreo = typeof correo === 'string' && correo.trim() !== '';
  const existeContrasenia = typeof contrasenia === 'string' && contrasenia.trim() !== '';
  const existeRol = idRol != null;

  if (!existeNombre && !existeCorreo && !existeContrasenia && !existeRol) {
    return {
      error: 'Debes enviar al menos uno de estos campos para modificar: nombre, correo, contraseña o rol.',
      datosSanitizados: null
    };
  }

  const datosSanitizados = { idUsuario };

  if (existeNombre) {
    const nombreRecortado = nombre.trim();
    if (nombreRecortado.length < tamanioMinimoNombre || nombreRecortado.length > tamanioMaximoNombre) {
      return {
        error: `El nombre debe tener entre ${tamanioMinimoNombre} y ${tamanioMaximoNombre} caracteres.`,
        datosSanitizados: null
      };
    }

    const regexNombre = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ. ]*$/;
    if (!regexNombre.test(nombreRecortado)) {
      return {
        error: 'El nombre solo puede contener letras (incluidos acentos), espacios y puntos.',
        datosSanitizados: null
      };
    }

    datosSanitizados.nombre = validator.escape(nombreRecortado);
  }

  if (existeCorreo) {
    const correoRecortado = correo.trim();
    if (correoRecortado.length < tamanioMinimoCorreo || correoRecortado.length > tamanioMaximoCorreo) {
      return {
        error: `El correo debe tener entre ${tamanioMinimoCorreo} y ${tamanioMaximoCorreo} caracteres.`,
        datosSanitizados: null
      };
    }

    if (!validator.isEmail(correoRecortado)) {
      return {
        error: 'El correo electrónico no tiene un formato válido (p. ej. usuario@dominio.com).',
        datosSanitizados: null
      };
    }
    datosSanitizados.correo = validator.normalizeEmail(correoRecortado);
  }

  if (existeContrasenia) {
    const contraseniaRecortada = contrasenia.trim();
    if (contraseniaRecortada.length < tamanioMinimoContrasenia || contraseniaRecortada.length > tamanioMaximoContrasenia) {
      return {
        error: `La contraseña debe tener entre ${tamanioMinimoContrasenia} y ${tamanioMaximoContrasenia} caracteres.`,
        datosSanitizados: null
      };
    }
    datosSanitizados.contrasenia = contraseniaRecortada;
  }

  if (existeRol) {
    if (!Number.isInteger(idRol) || idRol <= numeroMinimoID) {
      return {
        error: 'El identificador de rol debe ser un número entero mayor o igual a 1.',
        datosSanitizados: null
      };
    }
    datosSanitizados.idRol = idRol;
  }

  return { error: null, datosSanitizados };
}

module.exports = {
  validarYLimpiarUsuario
};