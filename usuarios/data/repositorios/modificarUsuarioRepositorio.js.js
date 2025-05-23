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
  return modelo.modificarUsuario(idUsuario, sets.join(', '), valores);
}





module.exports = {
  modificarUsuario,
};