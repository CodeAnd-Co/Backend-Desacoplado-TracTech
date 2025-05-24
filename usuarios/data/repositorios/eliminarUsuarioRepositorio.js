// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const modelo = require('../modelos/eliminarUsuarioModelo.js');

async function eliminarUsuario(id) {
    if (!id) {
        return {
            estado: 500,
            mensaje: 'Falta el ID del usuario',
        };
    }
    if (isNaN(id)) {
        return {
            estado: 400,
            mensaje: 'El ID del usuario debe ser un número',
        };
    }
    const datos = await modelo.eliminarUsuario(id)
    if (datos.affectedRows === 0) {
        return {
            estado: 404,
            mensaje: 'El usuario no existe',
        };
    }

    return {
        estado: 200,
        mensaje: 'Usuario eliminado exitosamente',
    };
  }

module.exports = {
    eliminarUsuario,
};