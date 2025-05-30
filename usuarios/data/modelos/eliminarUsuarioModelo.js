// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const conexion = require('../../../util/servicios/bd');

function eliminarUsuario(id) {
    const consulta = 'DELETE FROM usuario WHERE idUsuario = ?';
    return new Promise((resolve, reject) => {
        conexion.query(consulta, [id], (error, resultado) => {
            if (error) return reject(error);
            resolve(resultado);
        });
    });
}

module.exports ={
    eliminarUsuario
} 