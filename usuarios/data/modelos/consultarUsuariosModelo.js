const conexion = require("../../../util/servicios/bd");

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

module.exports ={
    consultarUsuarios,
} 