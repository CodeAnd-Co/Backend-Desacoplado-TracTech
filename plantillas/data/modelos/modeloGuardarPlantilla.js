//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const conexion = require('../../../util/servicios/bd.js');

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
      idPlantillaReporte = '',
      Nombre,
      Datos,
      FrecuenciaEnvio = '',
      CorreoDestino = '',
      NumeroDestino = ''
    }) {
      this.idPlantillaReporte = idPlantillaReporte;
      this.Nombre = Nombre;
      this.Datos = Datos;
      this.frecuenciaEnvio = FrecuenciaEnvio;
      this.correoDestino = CorreoDestino;
      this.numeroDestino = NumeroDestino;
    }

    static insertarPlantillaReporte(plantilla){
      const consulta = `
        INSERT INTO plantillareporte 
          (idPlantillaReporte, Nombre, Datos, FrecuenciaEnvio, CorreoDestino, NumeroDestino) 
        VALUES (?, ?, ?, ?, ?, ?)
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
            return rechazar(error);
          }

          resolver(resultado.insertId);
        });
      });
    }
  }
  
module.exports = PlantillaReporte;