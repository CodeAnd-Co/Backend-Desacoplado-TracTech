// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF2

// sesion/data/modelos/sesionModelo.js
const conexion = require('../../../util/servicios/bd');

function obtenerUsuarioPorCorreo(correo) {
    return new Promise((resolve, reject) => {
        const consulta = 'SELECT * FROM usuario WHERE correo = ?';
        conexion.query(consulta, [correo], (err, resultados) => {
            if (err) return reject(err);
            resolve(resultados);
        });
    });
}

module.exports = {
    obtenerUsuarioPorCorreo,
};