//RF34 Usuario guarda plantilla de reporte. - Modelo para fórmulas en plantillas

const conexion = require('../../../util/servicios/bd.js');

/**
 * Model: FormulasPlantilla - Maneja las fórmulas aplicadas en las plantillas
 */
class FormulasPlantilla {
  constructor({ 
    IdFormula = null,
    IdGrafica,
    NombreFormula,
    EstructuraFormula,
    Parametros = [],
    ResultadosEjemplo = null,
    EstadoFormula = 'activa'
  }) {
    this.IdFormula = IdFormula;
    this.IdGrafica = IdGrafica;
    this.NombreFormula = NombreFormula;
    this.EstructuraFormula = EstructuraFormula;
    this.Parametros = Parametros;
    this.ResultadosEjemplo = ResultadosEjemplo;
    this.EstadoFormula = EstadoFormula;
  }

  /**
   * Inserta una nueva fórmula asociada a una gráfica
   * @returns {Promise<number>} insertId
   */
  static async insertar(props) {
    const sql = `
      INSERT INTO formulasplantilla
        (IdGrafica, NombreFormula, EstructuraFormula, Parametros, ResultadosEjemplo, EstadoFormula)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const vals = [
      props.IdGrafica,
      props.NombreFormula,
      props.EstructuraFormula,
      JSON.stringify(props.Parametros || []),
      JSON.stringify(props.ResultadosEjemplo || []),
      props.EstadoFormula || 'activa'
    ];
    return new Promise((res, rej) => {
      conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
    });
  }

  /**
   * Obtiene todas las fórmulas asociadas a una gráfica
   * @param {number} idGrafica - ID de la gráfica
   * @returns {Promise<Array>} - Lista de fórmulas
   */
  static async obtenerPorGrafica(idGrafica) {
    const sql = `SELECT * FROM formulasplantilla WHERE IdGrafica = ? AND EstadoFormula = 'activa'`;
    
    return new Promise((res, rej) => {
      conexion.query(sql, [idGrafica], (err, results) => {
        if (err) return rej(err);
        
        // Parsear campos JSON
        const formulas = results.map(formula => {
          try {
            formula.Parametros = JSON.parse(formula.Parametros || '[]');
            formula.ResultadosEjemplo = JSON.parse(formula.ResultadosEjemplo || '[]');
          } catch (parseError) {
            formula.Parametros = [];
            formula.ResultadosEjemplo = [];
          }
          return formula;
        });
        
        res(formulas);
      });
    });
  }

  /**
   * Elimina todas las fórmulas asociadas a una gráfica
   * @param {number} idGrafica - ID de la gráfica
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  static async eliminarPorGrafica(idGrafica) {
    const sql = `DELETE FROM formulasplantilla WHERE IdGrafica = ?`;
    
    return new Promise((res, rej) => {
      conexion.query(sql, [idGrafica], (err, result) => {
        if (err) return rej(err);
        res(result.affectedRows > 0);
      });
    });
  }
}

module.exports = FormulasPlantilla;
