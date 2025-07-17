const conexion = require('../../../util/servicios/bd.js');

/**
 * @async
 * @function guardarPlantillaModelo
 * @param {Object} datosPlantilla - Datos de la plantilla a guardar.
 * @description Función para guardar una nueva plantilla en la base de datos.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la inserción.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function guardarPlantillaModelo(datosPlantilla) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para insertar una nueva plantilla
        const consulta = 'INSERT INTO plantilla (titulo, contenido) VALUES (?, ?)';
        const valores = [datosPlantilla.titulo, datosPlantilla.contenido];
        
        // Ejecuta la consulta
        conexion.query(consulta, valores, (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la inserción
        });
    });
}

module.exports = {
    guardarPlantillaModelo,
};
