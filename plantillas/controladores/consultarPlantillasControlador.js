// Se importa un módulo personalizado que establece la conexión con la base de datos
const conexion = require('../../util/bd.js');

exports.consultarPlantillas = async (pet, res) => {
    // Se llama a una función auxiliar para obtener las plantillas desde la base de datos
    const plantillasConsultadas = await obtenerPlantillas();

    if (plantillasConsultadas.length === 0) {
        // Si no se encontraron plantillas, se responde con un mensaje de error
        return res.status(404).json({
            message: "No se encontraron plantillas",
        });
    }

    // Se responde con un mensaje de éxito y se devuelve la lista de plantillas
    res.status(200).json({
        message: "Consulta de plantillas exitosa",
        plantillas: plantillasConsultadas,
    });
}

async function obtenerPlantillas() {
    // Se retorna una promesa que ejecuta una consulta SQL para obtener todas las plantillas
    return new Promise((resolver, rechazar) => {
        const consulta = 'SELECT * FROM plantillas';

        // Se ejecuta la consulta
        conexion.query(consulta, (err, resultados) => {
            if (err) {
                // En caso de error, se muestra en consola y se rechaza la promesa
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }

            // Si no hay error, se resuelve la promesa con los resultados obtenidos
            resolver(resultados);
        });
    });
}