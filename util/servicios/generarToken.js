const jwt = require('jsonwebtoken');


function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.idUsuario, correo: usuario.Correo },
        process.env.SECRETO_JWT,
        { expiresIn: process.env.DURACION_JWT }
    );
}

module.exports = {
    generarToken
};