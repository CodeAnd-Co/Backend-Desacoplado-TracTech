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
    } catch (error) {
        console.error('Error en consultarUsuariosRepositorio:', error);
        throw error;
    }
}

module.exports = {
    consultarUsuarios,
};