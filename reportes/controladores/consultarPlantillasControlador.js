// Se importa un módulo personalizado que establece la conexión con la base de datos
const conexion = require('../../util/db.js');

// Se exporta una función asíncrona que maneja la consulta de plantillas
exports.consultarPlantillas = async (pet, res) => {
    // Se extrae el idPlantilla del cuerpo de la petición
    const { idPlantilla } = pet.body;

    // Si no se proporciona idPlantilla, se devuelve un error 400 (Bad Request)
    if (!idPlantilla) {
        return res.status(400).json({
            message: "Faltan datos requeridos",
        });
    }

    // Se llama a una función auxiliar para obtener la plantilla desde la base de datos
    const plantillaConsultada = await obtenerPlantilla(idPlantilla);

    // Se responde con un mensaje de éxito y se devuelve la primera plantilla encontrada
    res.status(200).json({
        message: "Consulta de plantilla exitosa",
        plantilla: plantillaConsultada[0], // Se asume que solo se necesita el primer resultado
    });
}

// Función auxiliar que realiza la consulta a la base de datos
async function obtenerPlantilla(idPlantilla) {
    // Se retorna una promesa que ejecuta una consulta SQL usando el idPlantilla
    return new Promise((resolver, rechazar) => {
        const consulta = 'SELECT * FROM plantillas WHERE idPlantilla = ?';

        // Se ejecuta la consulta con el valor de idPlantilla como parámetro para evitar inyecciones SQL
        conexion.query(consulta, [idPlantilla], (err, resultados) => {
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
