const modelo = require('../modelos/crearUsuarioModelo.js');

async function crearUsuarioRepositorio(nombre, correo, contrasenia, idRol) {
  if (!nombre || !correo || !contrasenia || !idRol) {
    return {
      estado: 400,
      mensaje: 'Un campo requerido está vacío',
    };
  }
  // verificar que el rol sea un número
  if (isNaN(idRol)) {
    return {
      estado: 400,
      mensaje: 'El idRol no es un número',
    };
  }
  if (idRol <1 || idRol > 3) {
    return {
      estado: 400,
      mensaje: 'El idRol no es válido',
    };
  }
  
  if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_USUARIO) {
    return {
      estado: 400,
      mensaje: `El nombre no puede exceder los ${process.env.LONGITUD_MAXIMA_NOMBRE_USUARIO} caracteres`,
    };
  }
  
  if (correo.length > process.env.LONGITUD_MAXIMA_CORREO) {
    return {
      estado: 400,
      mensaje: `El correo no puede exceder los ${process.env.LONGITUD_MAXIMA_CORREO} caracteres`,
    };
  }

  try {
    const datos = await modelo.crearUsuario(nombre, correo, contrasenia, idRol);      
    return {
      estado: 201,
      mensaje: 'Usuario creado con éxito',
      idUsuario: datos,
    };
    
  } catch (error) {
    // Si el error tiene estado y mensaje (como el de duplicado), lo retornamos
    if (error.estado && error.mensaje) {
      return {
        estado: error.estado,
        mensaje: error.mensaje,
      };
    }

    return {
      estado: 500,
      mensaje: 'Error de conexión, intente más tarde',
    };
  }
}

module.exports = {
    crearUsuarioRepositorio,
};