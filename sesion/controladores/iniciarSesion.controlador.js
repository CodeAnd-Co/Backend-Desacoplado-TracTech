// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2

const conexion = require('../../util/bd.js'); // Importa la conexión a la base de datos
const bcrypt = require('bcrypt'); // Importa bcrypt
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const validador = require('validator'); // Importa el validador de correos electrónicos

/**
 * Controlador para iniciar sesión de un usuario.
 *
 * @async
 * @param {import('express').Request} peticion - Objeto de solicitud HTTP.
 * @param {import('express').Response} respuesta - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.iniciarSesion = async (peticion, respuesta) => {
    // Extrae correo y contraseña del cuerpo de la solicitud
    const { correo, contrasenia } = peticion.body;

    // Valida que ambos campos estén presentes
    if (!correo || !contrasenia) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }

    // Valida que el correo tenga un formato correcto
    if (!validarCorreo(correo)) {
        return respuesta.status(400).json({
            mensaje: 'Correo inválido',
        });
      }
    
    // Sanitiza la entrada del correo y la contraseña
    // para evitar inyecciones SQL y otros ataques
    const { correoSanitizado, contraseniaSanitizada } = sanitizarEntrada(correo, contrasenia);
    
    try {
        
        // Obten el usuario de la base de datos
        const usuarioRegistrado = await obtenerUsuario(correoSanitizado);

        // Verifica si el usuario existe
        if (usuarioRegistrado.length === 0) {
            return respuesta.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos',
            });
        }

        // Verifica que la contraseña ingresada coincida con la almacenada
        const contraseniaVerificada = await verificarContrasenia(usuarioRegistrado[0].Contrasenia, contraseniaSanitizada);
        if (!contraseniaVerificada) {
            return respuesta.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos',
            });
        }

        // Genera un token de sesión para el usuario autenticado
        const token = generarToken(usuarioRegistrado);

        // Responde con éxito y envía el token
        respuesta.status(200).json({
            mensaje: 'Usuario inició sesión con éxito',
            token,
        });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        respuesta.status(500).json({
            mensaje: 'Error interno del servidor',
        });
    }
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

/**
 * Sanitiza los datos de entrada del usuario, como correo y contraseña.
 *
 * Utiliza `validador.normalizeEmail` para normalizar el correo electrónico y 
 * `validador.escape` para proteger contra inyecciones en la contraseña escapando caracteres especiales.
 *
 * @function sanitizarEntrada
 * @param {string} correo - Correo electrónico ingresado por el usuario.
 * @param {string} contrasenia - Contraseña ingresada por el usuario.
 * @returns {{correoSanitizado: string, contraseniaSanitizada: string}} Objeto con el correo y la contraseña sanitizados.
 */
function sanitizarEntrada(correo, contrasenia) {
    const correoSanitizado = validador.normalizeEmail(correo);
    const contraseniaSanitizada = validador.escape(contrasenia); // Escapa caracteres peligrosos
    return { correoSanitizado, contraseniaSanitizada };
}  

/**
 * Valida el formato de un correo electrónico usando una expresión regular.
 *
 * La expresión regular verifica que el correo tenga una estructura estándar,
 * incluyendo nombre de usuario, símbolo '@' y dominio válido.
 *
 * @function validarCorreo
 * @param {string} correo - Correo electrónico a validar.
 * @returns {boolean} `true` si el correo tiene un formato válido, de lo contrario `false`.
 */
function validarCorreo(correo) {
    const regex = /^[a-z0-9!#$%&'*+?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
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
                console.error('Error interno del servidor:', err);
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
 * @param {string} contraseniaAlmacenada - Contraseña cifrada almacenada en la base de datos.
 * @param {string} contraseniaIngresada - Contraseña proporcionada por el usuario.
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, de lo contrario `false`.
 */
async function verificarContrasenia(contraseniaAlmacenada, contraseniaIngresada) {
    try {
        // Compara la contraseña ingresada con la almacenada usando bcrypt
        return await bcrypt.compare(contraseniaIngresada, contraseniaAlmacenada);
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        return false;
    }
}
