const pool = require("../config/db");

const buscarPorUsuario = async (usuario) => {

    const query = `
        SELECT *
        FROM empleado
        WHERE usuario=$1
        AND estado=true
    `;

    const result = await pool.query(query, [usuario]);

    return result.rows[0];
};

module.exports = {
    buscarPorUsuario
};