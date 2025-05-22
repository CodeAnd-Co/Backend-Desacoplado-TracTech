const conexion = require('../../../util/servicios/bd.js');

// Example: Get users
function consultarUsuarios(rolAExcluir) {
  const consulta = `
    SELECT u.idUsuario, u.Nombre, u.Correo, r.Nombre as 'Rol'
    FROM usuario u
    JOIN rol r ON u.idRol_FK = r.idRol
    WHERE r.Nombre <> ?
  `;
  return new Promise((resolve, reject) => {
    conexion.query(consulta, [rolAExcluir], (error, resultados) => {
      if (error) return reject(error);
      resolve(resultados);
    });
  });
}

function crearUsuario(nombre, correo, contrasenia, idRol) {
  const consulta = 'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    conexion.query(consulta, [nombre, correo, contrasenia, idRol], (error, resultado) => {
      if (error) return reject(error);
      resolve(resultado.insertId);
    });
  });
}

function modificarUsuario(idUsuario, sets, valores) {
  const consulta = `
    UPDATE usuario
    SET ${sets}
    WHERE idUsuario = ?
  `;
  return new Promise((resolve, reject) => {
    conexion.query(consulta, [...valores, idUsuario], (error, resultado) => {
      if (error) return reject(error);
      resolve(resultado);
    });
  });
}

function eliminarUsuario(id) {
  const consulta = 'DELETE FROM usuario WHERE idUsuario = ?';
  return new Promise((resolve, reject) => {
    conexion.query(consulta, [id], (error, resultado) => {
      if (error) return reject(error);
      resolve(resultado);
    });
  });
}

function consultarRoles() {
  const consulta = 'SELECT idRol, Nombre FROM rol WHERE idRol != 1';
  return new Promise((resolve, reject) => {
    conexion.query(consulta, (error, resultados) => {
      if (error) return reject(error);
      resolve(resultados);
    });
  });
}

module.exports = {
  consultarUsuarios,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
  consultarRoles,
};