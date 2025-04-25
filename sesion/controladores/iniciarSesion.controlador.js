const conexion = require('../../util/bd.js');
const bcrypt = require('bcrypt'); // Importa bcrypt

exports.iniciarSesion = async (pet, res) => {
    const { correo, contrasena } = pet.body;
    if (!correo || !contrasena) {
        return res.status(400).json({
        message: "Faltan datos requeridos",
        });
    }

    if (!validarCorreo(correo)) {
        throw new Error("Correo inválido");
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

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

async function obtenerUsuario(correo) {
    return new Promise((resolver, rechazar) => {
        const consulta = 'SELECT * FROM usuario WHERE correo = ?';
        conexion.query(consulta, [correo], (err, resultados) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultados); // Retorna el primer resultado de la consulta
        });
    });
}

async function verificarContrasena(contrasenaAlmacenada, contrasenaIngresada) {
    try {
        return await bcrypt.compare(contrasenaIngresada, contrasenaAlmacenada);
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        return false;
    }
}