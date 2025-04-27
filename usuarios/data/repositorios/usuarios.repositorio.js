const conexion = require('../../../util/bd.js');
const { Usuario } = require('../modelos/usuarios.js');

async function consultarUsuariosRepositorio() {
    const consulta = 'SELECT idUsuario, Nombre, Correo FROM usuarios';

    try {
        const [filas] = await conexion.query(consulta);

        if (!filas.length) {
            throw new Error('No se encontraron usuarios');
        }

        const usuarios = filas
            .filter(usuario => usuario.idUsuario && usuario.Nombre && usuario.Correo)
            .map(usuario => new Usuario({
                id: usuario.idUsuario,
                nombre: usuario.Nombre,
                correo: usuario.Correo
            }));

        return usuarios;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
}

module.exports = consultarUsuariosRepositorio;