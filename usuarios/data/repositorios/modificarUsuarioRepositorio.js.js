// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const modelo = require('../modelos/modificarUsuarioModelo.js');


async function modificarUsuario(idUsuario, cambios) {
  const sets = [];
  const valores = [];
  if (!idUsuario) {
    return Promise.reject(new Error('El ID del usuario es requerido'));
  }
  if (idUsuario <= 0 || isNaN(idUsuario)) {
    return Promise.reject(new Error('El ID del usuario no es válido'));
  }
  if (cambios.nombre != null) { sets.push('Nombre = ?'); valores.push(cambios.nombre); }
  if (cambios.correo != null) { sets.push('Correo = ?'); valores.push(cambios.correo); }
  if (cambios.contrasenia != null) { sets.push('Contrasenia = ?'); valores.push(cambios.contrasenia); }
  if (cambios.idRol != null) { sets.push('idRol_FK = ?'); valores.push(cambios.idRol); }
  if (sets.length === 0) return Promise.reject(new Error('No se proporcionaron campos para actualizar'));
  const datos = await modelo.modificarUsuario(idUsuario, sets.join(', '), valores);
  console.log(datos);
  if (datos.affectedRows === 0) {
    return {
      status: 404,
      mensaje: 'El usuario no existe',
    }
  }
  if (datos.code === 'ER_DUP_ENTRY') {
    console.log("El correo ya está en uso");
    return {
      status: 400,
      mensaje: 'El correo ya está en uso',
    };
  }

  if (!datos){
    return {
      status: 500,
      mensaje: 'Error al modificar el usuario',
    };
  }
  return {
    status: 200,
    mensaje: 'Usuario modificado exitosamente',
  };
}

module.exports = {
  modificarUsuario,
};