//RF21 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF21

// Se importa un módulo personalizado que establece la conexión con la base de datos
const conexion = require('../../util/bd.js');

// Se exporta una función asíncrona que maneja la consulta de plantillas
exports.eliminarPlantilla = async (pet, res) => {
    // Se extrae el idPlantilla del cuerpo de la petición
    const { idPlantilla } = pet.body;

    // Si no se proporciona idPlantilla, se devuelve un error 400 (Bad Request)
    if (!idPlantilla || idPlantilla == "null") {
        return res.status(400).json({
            message: "Faltan datos requeridos",
        });
    }

    // Se llama a una función auxiliar para obtener la plantilla desde la base de datos
    const plantillaConsultada = await eliminarPlantilla(idPlantilla);

    // Se responde con un mensaje de éxito y se devuelve la primera plantilla encontrada
    res.status(200).json({
        message: "Eliminacion de plantilla exitosa",
    });
}

// Función auxiliar que realiza la consulta a la base de datos
async function eliminarPlantilla(idPlantilla) {
    // Se retorna una promesa que ejecuta una consulta SQL usando el idPlantilla
    return new Promise((resolver, rechazar) => {
        const consulta = 'DELETE FROM plantillareporte WHERE idPlantillaReporte = ?';

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
