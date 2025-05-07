// RF67 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF67
const conexion = require('../../util/bd.js');

// Función para guardar una fórmula en la base de datos
exports.guardarFormula = async (pet, res) => {
    // Recibe los datos desde el cuerpo de la petición
    const {nombre, formula} = pet.body;
    // Verifica si se recibieron los datos necesarios
    if (!formula || !nombre) {
        return res.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }
    // Hace la consulta a la base de datos para guardar la fórmula
    const formulaGuardada = await guardarFormula(nombre, formula, (err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al guardar la fórmula',
            });
        }
        return resultado;
    });
    // Verifica si la fórmula fue guardada correctamente
    if (!formulaGuardada) {
        return res.status(500).json({
            mensaje: 'Error al guardar la fórmula',
        });
    }
    // Mensaje de éxito
    res.status(200).json({
        mensaje: 'Fórmula guardada con éxito',
    });

}
// Función para guardar la fórmula en la base de datos
async function guardarFormula(nombre, formula) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para insertar la fórmula en la base de datos
        // Se utiliza '?' como marcador de posición para evitar inyecciones SQL
        const consulta = 'INSERT INTO formula (Nombre, Datos) VALUES (?, ?)';
        // Ejecuta la consulta
        conexion.query(consulta, [nombre, formula], (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
            
        });
    });
    
}