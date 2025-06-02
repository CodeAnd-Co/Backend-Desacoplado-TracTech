const conexion = require('../../../util/servicios/bd');

function consultarUsuarios(rolAExcluir) {
    const consulta = `CALL obtener_usuarios_sin_rol(?)`;
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