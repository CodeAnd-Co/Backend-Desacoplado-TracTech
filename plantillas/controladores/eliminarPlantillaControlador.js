//RF21 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF21

// Se importa un módulo personalizado que establece la conexión con la base de datos
const conexion = require('../../util/bd.js');

// Se exporta una función asíncrona que maneja la consulta de plantillas
exports.eliminarPlantilla = async (pet, res) => {
    // Se extrae el idPlantilla del cuerpo de la petición
    const { idPlantilla } = pet.body;

    // Si no se proporciona idPlantilla, se devuelve un error 400 (Bad Request)
    if (!idPlantilla || idPlantilla == 'null') {
        return res.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }

    // Se llama a una función auxiliar para obtener la plantilla desde la base de datos
    const plantillaConsultada = await eliminarPlantilla(idPlantilla);

    // Se responde con un mensaje de éxito y se devuelve la primera plantilla encontrada
    if (!plantillaConsultada) {
        return res.status(500).json({
            mensaje: 'Error al eliminar la plantilla',
        });
    } else {
        res.status(200).json({
        mensaje: 'Eliminacion de plantilla exitosa',
    });
    }
}

// Función auxiliar que realiza la consulta a la base de datos
async function eliminarPlantilla(idPlantillaReporte) {
  const conn = conexion;
  return new Promise((resolve, reject) => {
    conn.beginTransaction(err => {
      if (err) return reject(err);
      // 1) Borrar gráficas → texto (si hace falta)
      conn.query(
        `DELETE g FROM grafica g
         JOIN contenido c ON g.IdContenido = c.IdContenido
         WHERE c.IdPlantilla = ?`,
        [idPlantillaReporte],
        err => {
          if (err) return conn.rollback(() => reject(err));
          // 2) Borrar texto
          conn.query(
            `DELETE t FROM texto t
             JOIN contenido c ON t.IdContenido = c.IdContenido
             WHERE c.IdPlantilla = ?`,
            [idPlantillaReporte],
            err => {
              if (err) return conn.rollback(() => reject(err));
              // 3) Borrar contenido
              conn.query(
                `DELETE FROM contenido WHERE IdPlantilla = ?`,
                [idPlantillaReporte],
                err => {
                  if (err) return conn.rollback(() => reject(err));
                  // 4) Borrar plantilla padre
                  conn.query(
                    `DELETE FROM plantillareporte WHERE idPlantillaReporte = ?`,
                    [idPlantillaReporte],
                    (err, result) => {
                      if (err) return conn.rollback(() => reject(err));
                      conn.commit(cErr => {
                        if (cErr) return conn.rollback(() => reject(cErr));
                        resolve(result);
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}
