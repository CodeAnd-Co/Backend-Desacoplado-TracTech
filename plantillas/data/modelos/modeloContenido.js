const conexion = require('../../../util/bd.js');

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

   