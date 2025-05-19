const conexion = require('../../../util/bd.js');

async function insertarPlantilla({ NombrePlantilla, FrecuenciaEnvio, CorreoDestino, NumeroDestino }) {
  const sql = `
    INSERT INTO plantilla
      (NombrePlantilla, FrecuenciaEnvio, CorreoDestino, NumeroDestino)
    VALUES (?, ?, ?, ?)
  `;
  const vals = [NombrePlantilla, FrecuenciaEnvio, CorreoDestino, NumeroDestino];
  return new Promise((res, rej) => {
    conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
  });
}

module.exports = { insertarPlantilla };
