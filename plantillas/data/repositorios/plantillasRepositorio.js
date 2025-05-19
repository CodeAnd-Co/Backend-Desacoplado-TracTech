//RF22 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF22

// Se importa el módulo de conexión a la base de datos
const conexion = require('../../../util/bd.js');

/**
 * Guarda una nueva plantilla en la base de datos
 * @param {Object} plantilla - Objeto con los datos de la plantilla
 * @returns {Promise<number>} Promesa que resuelve con el ID de la plantilla insertada
 * @throws {Error} Error si no se puede insertar la plantilla
 */
function guardarPlantillaRepositorio(plantilla) {
  const consulta = `
    INSERT INTO plantillareporte 
      (idPlantillaReporte, Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const valores = [
    plantilla.idPlantillaReporte,
    plantilla.Nombre,
    plantilla.Datos,
    plantilla.FrecuenciaEnvio,
    plantilla.CorreoDestino,
    plantilla.NumeroDestino
  ];

  return new Promise((resolver, rechazar) => {
    conexion.query(consulta, valores, (error, resultado) => {
      if (error) {
        console.error('Error al insertar la plantilla:', error);
        return rechazar(error);
      }

      resolver(resultado.insertId);
    });
  });
}

module.exports = {
  guardarPlantillaRepositorio
};