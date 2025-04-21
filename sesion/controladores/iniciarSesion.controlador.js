const conexion = require('../../util/db.js');
exports.iniciarSesion = async (pet, res) => {
    console.log("pet", pet.body);
    const { correo, contrasena } = pet.body;
    if (!correo || !contrasena) {
        return res.status(400).json({
        message: "Faltan datos requeridos",
        });
    }
    
    const usuarioRegistrado = await obtenerUsuario(correo, contrasena, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                message: "Error al obtener el usuario",
            });
        }
        return usuario;
    });

    console.log("usuarioRegistrado", usuarioRegistrado[0]);
    const contrasenaVerificada = verificarContrasena(usuarioRegistrado[0].Contrasenia, contrasena);
    console.log("contrasenaVerificada", contrasenaVerificada);
    if (!contrasenaVerificada) {
        return res.status(401).json({
            message: "Contraseña incorrecta",
        });
    }

    // Aquí iría la lógica para registrar al usuario en la base de datos
    
    res.status(200).json({
        message: "Usuario inició sesión con éxito",
    });
}

async function obtenerUsuario(correo, contrasena) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuario WHERE correo = ? AND contrasenia = ?';
        conexion.query(query, [correo, contrasena], (err, resultados) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return reject(err);
            }
            resolve(resultados); // Retorna el primer resultado de la consulta
        });
    });
}

function verificarContrasena(contrasenaAlmacenada, contrasenaIngresada) {
    console.log("contrasenaAlmacenada", contrasenaAlmacenada);
    console.log("contrasenaIngresada", contrasenaIngresada);
    return contrasenaAlmacenada == contrasenaIngresada;
}