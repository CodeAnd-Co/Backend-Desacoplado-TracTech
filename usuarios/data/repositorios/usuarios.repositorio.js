const conexion = require('../../../util/bd.js');
const { Usuario } = require('../modelos/usuarios.js');

function consultarUsuariosRepositorio() {
    const consulta = 'SELECT idUsuario, Nombre, Correo FROM usuario';

    return new Promise((resolver, rechazar) => {
        conexion.query(consulta, (error, resultados) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                return rechazar(error);
            }

            if (!resultados.length) {
                return rechazar(new Error('No se encontraron usuarios'));
            }

            const usuarios = resultados
                .filter(usuario => usuario.idUsuario && usuario.Nombre && usuario.Correo)
                .map(usuario => new Usuario({
                    id: usuario.idUsuario,
                    nombre: usuario.Nombre,
                    correo: usuario.Correo
                }));

            resolver(usuarios);
        });
    });
}

module.exports = consultarUsuariosRepositorio;