const conexion = require('../../../util/servicios/bd.js');

/**
 * Model: Plantilla (maestra de plantilla de reporte)
 */
class Plantilla {
  constructor({ IdPlantilla = null, NombrePlantilla, FrecuenciaEnvio = null, CorreoDestino = null, NumeroDestino = null }) {
    this.IdPlantilla      = IdPlantilla;
    this.NombrePlantilla  = NombrePlantilla;
    this.FrecuenciaEnvio  = FrecuenciaEnvio;
    this.CorreoDestino    = CorreoDestino;
    this.NumeroDestino    = NumeroDestino;
  }

  /**
   * Inserta una nueva fila en tabla plantilla
   * @returns {Promise<number>} insertId
   */
  static async insertarPlantilla(props) {
    const sql = `
      INSERT INTO plantilla
        (NombrePlantilla, FrecuenciaEnvio, CorreoDestino, NumeroDestino)
      VALUES (?, ?, ?, ?)
    `;
    const vals = [
      props.NombrePlantilla,
      props.FrecuenciaEnvio,
      props.CorreoDestino,
      props.NumeroDestino
    ];
    return new Promise((res, rej) => {
      conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
    });
  }
}

module.exports = Plantilla;