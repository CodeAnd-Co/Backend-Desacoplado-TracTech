const conexion = require('../../../util/servicios/bd');

function consultarUsuarios(rolAExcluir) {
    const consulta = `
    SELECT 
        u.idUsuario, 
        u.Nombre, 
        u.Correo, 
        r.Nombre as 'Rol',
        CASE 
            WHEN d.id IS NOT NULL THEN TRUE 
            ELSE FALSE 
        END as 'TieneDispositivo',
        d.id as 'DispositivoId',
        d.estado as 'DispositivoActivo'
    FROM usuario u
    JOIN rol r ON u.idRol_FK = r.idRol
    LEFT JOIN dispositivos d ON u.idUsuario = d.id_usuario_FK
    WHERE r.Nombre <> ?
    ORDER BY u.idUsuario
  `;
    return new Promise((resolve, reject) => {
        conexion.query(consulta, [rolAExcluir], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

module.exports ={
    consultarUsuarios,
} 