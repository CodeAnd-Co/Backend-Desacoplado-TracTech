// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const conexion = require("../../../util/servicios/bd");

async function modificarUsuario(idUsuario, sets, valores) {
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

module.exports = {
    modificarUsuario
} 