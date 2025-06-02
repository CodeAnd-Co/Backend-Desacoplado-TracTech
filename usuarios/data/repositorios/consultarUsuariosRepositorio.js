const modelo = require('../modelos/consultarUsuariosModelo.js');

async function consultarUsuarios() {
    try {
        const rolAExcluir = process.env.SU;
        const datos = await modelo.consultarUsuarios(rolAExcluir);

        const usuarios = datos[0];
        
        if (!usuarios || usuarios.length === 0) {
            return {
                estado: 404,
                mensaje: 'No se encontraron usuarios',
            };
        }
        return usuarios;
    } catch {
        return {
            estado: 500,
            mensaje: 'Hubo un error al procesar el listado de usuarios',
        };
    }
}

module.exports = {
    consultarUsuarios,
};