const conexion = require('../../../util/servicios/bd.js');
/**
 * @async
 * @function consultarPlantillaModelo
 * @description Función para consultar todas las Plantillas de la base de datos.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la consulta.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function consultarPlantillasModelo() {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para obtener todas las plantillas de la base de datos
        const consulta = 'SELECT * FROM plantilla';
        // Ejecuta la consulta
        conexion.query(consulta, (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}

module.exports = {
    consultarPlantillasModelo,
};