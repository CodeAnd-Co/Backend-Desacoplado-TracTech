const conexion = require("../../../util/servicios/bd");

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

module.exports = modificarUsuario