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

module.exports = {
    modificarFormulaRepositorio,
};
