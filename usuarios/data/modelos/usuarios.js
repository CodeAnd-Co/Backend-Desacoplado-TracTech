const conexion = require('../../../util/servicios/bd.js');
function consultarRoles() {
  const consulta = 'SELECT idRol, Nombre FROM rol WHERE idRol != 1';
  return new Promise((resolve, reject) => {
    conexion.query(consulta, (error, resultados) => {
      if (error) return reject(error);
      resolve(resultados);
    });
  });
}

module.exports = consultarRoles