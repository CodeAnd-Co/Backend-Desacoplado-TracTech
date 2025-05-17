// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 
const conexion = require('../../../util/bd.js');

async function modificarFormulaRepositorio(id, nombre, formula) {
    return new Promise((resolver, rechazar) => {
        const consulta = 'UPDATE formula SET Nombre = ?, Datos = ? WHERE idFormula = ?';
        conexion.query(consulta, [nombre, formula, id], (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado);
        });
    });
}

async function guardarFormulaRepositorio(nombre, formula) {
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

async function eliminarFormulaRepositorio(id) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para eliminar la fórmula de la base de datos
        const consulta = 'DELETE FROM formula WHERE idFormula = ?';
        // Ejecuta la consulta
        conexion.query(consulta, [id], (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}

module.exports = {
    modificarFormulaRepositorio,
    guardarFormulaRepositorio,
    eliminarFormulaRepositorio,
};
