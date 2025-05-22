const { Usuario } = require('../modelos/usuarios.js');
const modelo = require('../modelos/usuarios.js');

function consultarUsuarios() {
  const rolAExcluir = process.env.SU;
  return modelo.consultarUsuarios(rolAExcluir)
      .then(resultados => resultados.map(usuario => new Usuario({
        id: usuario.idUsuario,
        nombre: usuario.Nombre,
        correo: usuario.Correo,
        rol: usuario.Rol,
      })));
}

function crearUsuarioRepositorio(nombre, correo, contrasenia, idRol) {
  return modelo.crearUsuario(nombre, correo, contrasenia, idRol);
}

function modificarUsuario(idUsuario, cambios) {
  const sets = [];
  const valores = [];
  if (cambios.nombre != null) { sets.push('Nombre = ?'); valores.push(cambios.nombre); }
  if (cambios.correo != null) { sets.push('Correo = ?'); valores.push(cambios.correo); }
  if (cambios.contrasenia != null) { sets.push('Contrasenia = ?'); valores.push(cambios.contrasenia); }
  if (cambios.idRol != null) { sets.push('idRol_FK = ?'); valores.push(cambios.idRol); }
  if (sets.length === 0) return Promise.reject(new Error('No se proporcionaron campos para actualizar'));
  return modelo.modificarUsuario(idUsuario, sets.join(', '), valores);
}

function eliminarUsuario(id) {
  return modelo.eliminarUsuario(id).then(resultado => resultado.affectedRows > 0);
}

function consultarRoles() {
  return modelo.consultarRoles();
}

module.exports = {
  consultarUsuarios,
  crearUsuarioRepositorio,
  modificarUsuario,
  eliminarUsuario,
  consultarRoles,
};