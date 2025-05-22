const conexion = require("../../../util/servicios/bd");

function crearUsuario(nombre, correo, contrasenia, idRol) {
    const consulta = 'INSERT INTO usuario (Nombre, Correo, Contrasenia, idRol_FK) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        conexion.query(consulta, [nombre, correo, contrasenia, idRol], (error, resultado) => {
            if (error) return reject(error);
            resolve(resultado.insertId);
        });
    });
}

module.exports = crearUsuario