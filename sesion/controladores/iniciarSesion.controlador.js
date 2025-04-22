const conexion = require('../../util/db.js');
const bcrypt = require('bcrypt'); // Importa bcrypt

exports.iniciarSesion = async (pet, res) => {
    const { correo, contrasena } = pet.body;
    if (!correo || !contrasena) {
        return res.status(400).json({
        message: "Faltan datos requeridos",
        });
    }
    
    const usuarioRegistrado = await obtenerUsuario(correo, (err, usuario) => {
        console.error('Error al ejecutar la consulta:', err); // Solo en el servidor
        if (err) {
            return res.status(401).json({
                message: "Usuario o contraseña incorrectos",
            });
        }
        return usuario;
    });

    const contrasenaVerificada = verificarContrasena(usuarioRegistrado[0].Contrasenia, contrasena);
    if (!contrasenaVerificada) {
        return res.status(401).json({
            message: "Usuario o contraseña incorrectos",
        });
    }

    // Aquí iría la lógica para registrar al usuario en la base de datos
    
    res.status(200).json({
        message: "Usuario inició sesión con éxito",
    });
}

async function obtenerUsuario(correo) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        conexion.query(query, [correo], (err, resultados) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return reject(err);
            }
            resolve(resultados); // Retorna el primer resultado de la consulta
        });
    });
}

async function verificarContrasena(contrasenaAlmacenada, contrasenaIngresada) {
    try {
        return await bcrypt.compare(contrasenaIngresada, contrasenaAlmacenada);
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        return false;
    }
}