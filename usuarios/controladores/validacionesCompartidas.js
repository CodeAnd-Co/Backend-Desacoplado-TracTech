const validator = require('validator');

const numeroMinimoID = 1;
const tamanioMinNombre = 1;
const tamanioMaxNombre = 50;
const tamanioMinCorreo = 5;
const tamanioMaxCorreo = 50;
const tamanioMinPass = 8;
const tamanioMaxPass = 50;

function validarIDCampo(id) {
    if (!Number.isInteger(id) || id < numeroMinimoID) {
        return 'El identificador debe ser un número entero mayor o igual a 1.';
    }
    return '';
}

function validarNombreCampo(nombre) {
    const valor = nombre.trim();
    if (valor.length < tamanioMinNombre || valor.length > tamanioMaxNombre) {
        return `El nombre debe tener entre ${tamanioMinNombre} y ${tamanioMaxNombre} caracteres.`;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ. ]*$/.test(valor)) {
        return 'El nombre solo puede contener letras, espacios y puntos, y no puede empezar con punto.';
    }
    return '';
}

function validarCorreoCampo(correo) {
    const valor = correo.trim();
    if (valor.length < tamanioMinCorreo || valor.length > tamanioMaxCorreo) {
        return `El correo debe tener entre ${tamanioMinCorreo} y ${tamanioMaxCorreo} caracteres.`;
    }
    if (!validator.isEmail(valor)) {
        return 'El correo debe tener un formato válido.';
    }
    return '';
}

function validarContraseniaCampo(pass) {
    const valor = pass.trim();
    if (valor.length < tamanioMinPass || valor.length > tamanioMaxPass) {
        return `La contraseña debe tener entre ${tamanioMinPass} y ${tamanioMaxPass} caracteres.`;
    }
    return '';
}

function validarRolCampo(idRol) {
    if (!Number.isInteger(idRol) || idRol < numeroMinimoID) {
        return 'El identificador de rol debe ser un número entero mayor o igual a 1.';
    }
    return '';
}

/**
 * Valida y sanitiza los datos para crear o modificar un usuario.
 * @param {object} datos       - { idUsuario?, nombre?, correo?, contrasenia?, idRol? }
 * @param {boolean} esCrear    - true = validación para crear (todos los campos obligatorios), false = para modificar
 * @returns {{ error: string|null, datosSanitizados: object|null }}
 */
function validarYLimpiarUsuario(datos, esCrear = false) {
    const { idUsuario, nombre, correo, contrasenia, idRol } = datos;
    const datosSanitizados = {};

    if (!esCrear) {
        const error = validarIDCampo(idUsuario);
        if (error) {
            return {
                error,
                datosSanitizados: null
            };
        }
        datosSanitizados.idUsuario = idUsuario;
    }

     // Validar si hay al menos un campo para modificar
    const existeNombre = typeof nombre  === 'string' && nombre.trim()  !== '';
    const existeCorreo = typeof correo === 'string' && correo.trim() !== '';
    const existeContrasenia = typeof contrasenia === 'string' && contrasenia.trim() !== '';
    const existeRol = idRol != null;

    if (esCrear) {
        if(!existeNombre || !existeCorreo || !existeContrasenia || !existeRol) {
            return {
                error: 'Para crear un usuario debes dar: nombre, correo, contraseña y rol',
                datosSanitizados: null
            };
        }
    } else {
        if(!existeNombre && !existeCorreo && !existeContrasenia && !existeRol) {
        return {
            error: 'Debes enviar al menos uno de estos campos para modificar: nombre, correo, contraseña o rol.',
            datosSanitizados: null
        };
        }
    }

    if(existeNombre) {
      const error = validarNombreCampo(nombre);
      if(error) {
        return {
          error,
          datosSanitizados: null
        };
      }
      datosSanitizados.nombre = validator.escape(nombre.trim());
    }

    if(existeCorreo) {
      const error = validarCorreoCampo(correo);
      if(error) {
        return {
          error,
          datosSanitizados: null
        };
      }
      datosSanitizados.correo = validator.normalizeEmail(correo.trim());
    }

    if(existeContrasenia) {
      const error = validarContraseniaCampo(contrasenia);
      if(error) {
        return {
          error,
          datosSanitizados: null
        };
      }
      datosSanitizados.contrasenia = contrasenia.trim();
    }

    if(existeRol) {
      const error = validarRolCampo(idRol);
      if(error) {
        return {
          error,
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
