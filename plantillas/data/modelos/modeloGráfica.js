//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const conexion = require('../../../util/servicios/bd.js');

/**
 * Model: GraficaContenido (hija de contenido) - Versión mejorada para sistema de plantillas avanzado
 */
class Grafica {
  constructor({ 
    IdGrafica = null, 
    NombreGrafica, 
    TipoGrafica, 
    Parametros, 
    IdContenido,
    // Nuevos campos para sistema mejorado
    Color = null,
    TractorSeleccionado = null,
    TipoOrigen = null,
    ColumnaOrigen = null,
    FormulaAplicada = null,
    Filtros = null,
    ParametrosFormula = null,
    ConfiguracionAvanzada = null
  }) {
    this.IdGrafica              = IdGrafica;
    this.NombreGrafica          = NombreGrafica;
    this.TipoGrafica            = TipoGrafica;
    this.Parametros             = Parametros;
    this.IdContenido            = IdContenido;
    // Nuevos campos
    this.Color                  = Color;
    this.TractorSeleccionado    = TractorSeleccionado;
    this.TipoOrigen             = TipoOrigen;
    this.ColumnaOrigen          = ColumnaOrigen;
    this.FormulaAplicada        = FormulaAplicada;
    this.Filtros                = Filtros;
    this.ParametrosFormula      = ParametrosFormula;
    this.ConfiguracionAvanzada  = ConfiguracionAvanzada;
  }

  /**
   * Inserta una nueva gráfica con información completa del sistema mejorado
   * @returns {Promise<number>} insertId
   */
  static async insertar(props) {
    const sql = `
      INSERT INTO grafica
        (NombreGrafica, TipoGrafica, Parametros, IdContenido, Color, TractorSeleccionado, 
         TipoOrigen, ColumnaOrigen, FormulaAplicada, Filtros, ParametrosFormula, ConfiguracionAvanzada)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const vals = [
      props.NombreGrafica,
      props.TipoGrafica,
      JSON.stringify(props.Parametros || {}),
      props.IdContenido,
      props.Color,
      props.TractorSeleccionado,
      props.TipoOrigen,
      JSON.stringify(props.ColumnaOrigen || {}),
      JSON.stringify(props.FormulaAplicada || {}),
      JSON.stringify(props.Filtros || []),
      JSON.stringify(props.ParametrosFormula || []),
      JSON.stringify(props.ConfiguracionAvanzada || {})
    ];
    return new Promise((res, rej) => {
      conexion.query(sql, vals, (err, result) => err ? rej(err) : res(result.insertId));
    });
  }

  /**
   * Método auxiliar para validar estructura de datos de gráfica mejorada
   * @param {Object} datosGrafica - Datos de la gráfica desde el frontend
   * @returns {Object} - Datos validados y estructurados
   */
  static validarDatosGrafica(datosGrafica) {
    const resultado = {
      // Campos básicos (compatibilidad hacia atrás)
      NombreGrafica: datosGrafica.titulo || datosGrafica.nombreGrafica || 'Gráfica sin título',
      TipoGrafica: datosGrafica.tipoGrafica || 'bar',
      Parametros: datosGrafica.parametros || {},
      
      // Nuevos campos del sistema mejorado
      Color: datosGrafica.color || '#A61930',
      TractorSeleccionado: datosGrafica.tractorSeleccionado || null,
      TipoOrigen: datosGrafica.datos?.tipoOrigen || 'columna',
      ColumnaOrigen: datosGrafica.datos?.columna || {},
      FormulaAplicada: datosGrafica.datos?.formula || {},
      Filtros: datosGrafica.datos?.filtros || [],
      ParametrosFormula: datosGrafica.datos?.parametrosFormula || [],
      ConfiguracionAvanzada: datosGrafica.configuracionAvanzada || {}
    };

    return resultado;
  }

  /**
   * Obtiene información completa de una gráfica por su ID
   * @param {number} idGrafica - ID de la gráfica
   * @returns {Promise<Object>} - Datos completos de la gráfica
   */
  static async obtenerCompleta(idGrafica) {
    const sql = `
      SELECT g.*, c.OrdenContenido, c.TipoContenido 
      FROM grafica g
      JOIN contenido c ON g.IdContenido = c.IdContenido
      WHERE g.IdGrafica = ?
    `;
    
    return new Promise((res, rej) => {
      conexion.query(sql, [idGrafica], (err, results) => {
        if (err) return rej(err);
        if (results.length === 0) return res(null);
        
        const grafica = results[0];
        
        // Parsear campos JSON
        try {
          grafica.Parametros = JSON.parse(grafica.Parametros || '{}');
          grafica.ColumnaOrigen = JSON.parse(grafica.ColumnaOrigen || '{}');
          grafica.FormulaAplicada = JSON.parse(grafica.FormulaAplicada || '{}');
          grafica.Filtros = JSON.parse(grafica.Filtros || '[]');
          grafica.ParametrosFormula = JSON.parse(grafica.ParametrosFormula || '[]');
          grafica.ConfiguracionAvanzada = JSON.parse(grafica.ConfiguracionAvanzada || '{}');
        } catch (parseError) {
          // En caso de error al parsear, usar valores por defecto
          grafica.Parametros = {};
          grafica.ColumnaOrigen = {};
          grafica.FormulaAplicada = {};
          grafica.Filtros = [];
          grafica.ParametrosFormula = [];
          grafica.ConfiguracionAvanzada = {};
        }
        
        res(grafica);
      });
    });
  }
}

module.exports = Grafica;
