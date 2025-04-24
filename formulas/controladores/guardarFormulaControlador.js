const conexion = require('../../util/bd.js');

exports.guardarFormula = async (pet, res) => {
    const {nombre, formula} = pet.body;
    if (!formula || !nombre) {
        return res.status(400).json({
            message: "Faltan datos requeridos",
        });
    }
    const formulaGuardada = await guardarFormula(nombre, formula, (err, resultado) => {
        if (err) {
            return res.status(500).json({
                message: "Error al guardar la fórmula",
            });
        }
        return resultado;
    });
    if (!formulaGuardada) {
        return res.status(500).json({
            message: "Error al guardar la fórmula",
        });
    }
    res.status(200).json({
        message: "Fórmula guardada con éxito",
    });

}

async function guardarFormula(nombre, formula) {
    return new Promise((resolver, rechazar) => {
        const consulta = 'INSERT INTO formula (Nombre, Datos) VALUES (?, ?)';
        conexion.query(consulta, [nombre, formula], (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado); // Retorna el resultado de la consulta
            
        });
    });
    
}