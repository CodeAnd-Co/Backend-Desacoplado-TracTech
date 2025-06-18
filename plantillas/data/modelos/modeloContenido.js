//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const conexion = require('../../../util/servicios/bd.js');

/*
 * Modelo para manejar las operaciones relacionadas con el contenido de las plantillas.
 * Permite insertar nuevos contenidos en la base de datos.
 * @module Contenido
*/
class Contenido{
    static insertarContenido({ OrdenContenido, TipoContenido, IdPlantilla }) {
        const sql = `
            INSERT INTO contenido
            (OrdenContenido, TipoContenido, IdPlantilla)
            VALUES (?, ?, ?)
        `;
        const vals = [OrdenContenido, TipoContenido, IdPlantilla];

        return new Promise((res, rej) => {
            conexion.query(sql, vals, (err, result) => {
            if (err) return rej(err);
            res(result.insertId);
            });
        });
    }
}

module.exports = Contenido ;