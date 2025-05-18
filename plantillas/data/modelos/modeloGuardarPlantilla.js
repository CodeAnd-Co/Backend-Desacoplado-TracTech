/**
 * Clase para representar una plantilla de reporte
 */
class PlantillaReporte {
    /**
     * Constructor de la clase PlantillaReporte
     * @param {Object} props - Propiedades de la plantilla
     * @param {number|null} props.idPlantillaReporte - ID de la plantilla (null para nuevas)
     * @param {string} props.Nombre - Nombre de la plantilla
     * @param {string} props.datos - Contenido HTML de la plantilla
     * @param {number|null} props.frecuenciaEnvio - Frecuencia de envío en horas
     * @param {string|null} props.correoDestino - Correo electrónico de destino
     * @param {string|null} props.numeroDestino - Número telefónico de destino
     */
    constructor({
      idPlantillaReporte = null,
      Nombre,
      Datos,
      FrecuenciaEnvio = null,
      CorreoDestino = null,
      NumeroDestino = null
    }) {
      this.idPlantillaReporte = idPlantillaReporte;
      this.Nombre = Nombre;
      this.datos = Datos;
      this.frecuenciaEnvio = FrecuenciaEnvio;
      this.correoDestino = CorreoDestino;
      this.numeroDestino = NumeroDestino;
    }
  }
  
  module.exports = { PlantillaReporte };