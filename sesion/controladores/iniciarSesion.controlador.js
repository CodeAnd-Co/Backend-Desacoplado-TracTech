// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2

const conexion = require('../../util/bd.js');
const bcrypt = require('bcrypt'); // Importa bcrypt
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken

/**
 * Controlador para iniciar sesión de un usuario.
 *
 * @async
 * @param {import('express').Request} pet - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.iniciarSesion = async (pet, res) => {
    // Extrae correo y contraseña del cuerpo de la solicitud
    const { correo, contrasena } = pet.body;

    // Valida que ambos campos estén presentes
    if (!correo || !contrasena) {
        return res.status(400).json({
            message: "Faltan datos requeridos",
        });
    }

    if (!validarCorreo(correo)) {
        throw new Error("Correo inválido");
      }
    
    const usuarioRegistrado = await obtenerUsuario(correo, (err, usuario) => {
        if (usuario.length === 0) {
            return res.status(401).json({
                message: "Usuario o contraseña incorrectos",
            });
        }
        
        if (err) {
            return res.status(401).json({
                message: "Usuario o contraseña incorrectos",
            });
        }
        return usuario;
    });

    // Verifica que la contraseña ingresada coincida con la almacenada
    const contrasenaVerificada = verificarContrasena(usuarioRegistrado[0].Contrasenia, contrasena);
    if (!contrasenaVerificada) {
        return res.status(401).json({
            message: "Usuario o contraseña incorrectos",
        });
    }

    // Genera un token de sesión para el usuario autenticado
    const token = generarToken(usuarioRegistrado);

    // Responde con éxito y envía el token
    res.status(200).json({
        message: "Usuario inició sesión con éxito",
        token,
    });
}

/**
 * Genera un token JWT para el usuario autenticado.
 *
 * @param {Array<Object>} usuarioRegistrado - Datos del usuario obtenido de la base de datos.
 * @returns {string} Token JWT generado.
 */
function generarToken(usuarioRegistrado) {
    // Crea un token firmado con el ID y correo del usuario
    return jwt.sign(
        { id: usuarioRegistrado[0].idUsuario, correo: usuarioRegistrado[0].Correo }, // Datos a incluir en el token
        process.env.SECRETO_JWT, // Clave secreta del servidor
        { expiresIn: process.env.DURACION_JWT } // Duración del token
    );
}


function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

/**
 * Obtiene un usuario de la base de datos mediante su correo.
 *
 * @async
 * @param {string} correo - Correo electrónico del usuario.
 * @returns {Promise<Array<Object>>} Promesa que resuelve en un arreglo de usuarios.
 */
async function obtenerUsuario(correo) {
    return new Promise((resolver, rechazar) => {
        // Consulta para buscar el usuario por su correo
        const consulta = 'SELECT * FROM usuario WHERE correo = ?';

        // Ejecuta la consulta en la base de datos
        conexion.query(consulta, [correo], (err, resultados) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            // Resuelve la promesa con los resultados de la consulta
            resolver(resultados);
        });
    });
}

/**
 * Verifica si la contraseña ingresada coincide con la contraseña almacenada.
 *
 * @async
 * @param {string} contrasenaAlmacenada - Contraseña cifrada almacenada en la base de datos.
 * @param {string} contrasenaIngresada - Contraseña proporcionada por el usuario.
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, de lo contrario `false`.
 */
async function verificarContrasena(contrasenaAlmacenada, contrasenaIngresada) {
    try {
        // Compara la contraseña ingresada con la almacenada usando bcrypt
        return await bcrypt.compare(contrasenaIngresada, contrasenaAlmacenada);
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        return false;
    }
}
