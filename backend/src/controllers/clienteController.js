const pool = require("../config/db");

const listar = async (req, res) => {
  try {
    const resultado = await pool.query(
      `
            SELECT
                id_cliente,
                identificacion,
                nombre,
                apellido,
                telefono,
                estado
            FROM cliente
            ORDER BY id_cliente DESC
            `,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
};

const buscar = async (req, res) => {
  try {
    const { texto } = req.query;

    const resultado = await pool.query(
      `
            SELECT
                id_cliente,
                identificacion,
                nombre,
                apellido,
                telefono,
                estado
            FROM cliente
            WHERE
                identificacion ILIKE $1
                OR nombre ILIKE $1
                OR apellido ILIKE $1
            ORDER BY nombre
            `,
      [`%${texto}%`],
    );

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: "Error al buscar clientes",
    });
  }
};

const crear = async (req, res) => {
  try {
    const { identificacion, nombre, apellido, telefono } = req.body;

    if (!identificacion || !nombre || !apellido || !telefono) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const resultado = await pool.query(
      `
            INSERT INTO cliente (identificacion, nombre, apellido, telefono, estado)
            VALUES ($1, $2, $3, $4, true)
            RETURNING *
            `,
      [identificacion, nombre, apellido, telefono],
    );

    res.status(201).json({
      mensaje: "Cliente creado exitosamente",
      cliente: resultado.rows[0],
    });
  } catch (error) {
    console.log(error);

    if (error.code === "23505") {
      return res.status(409).json({
        mensaje: "La identificación ya existe",
      });
    }

    res.status(500).json({
      mensaje: "Error al crear cliente",
    });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { identificacion, nombre, apellido, telefono, estado } = req.body;

    const resultado = await pool.query(
      `
            UPDATE cliente
            SET
                identificacion = COALESCE($1, identificacion),
                nombre = COALESCE($2, nombre),
                apellido = COALESCE($3, apellido),
                telefono = COALESCE($4, telefono),
                estado = COALESCE($5, estado)
            WHERE id_cliente = $6
            RETURNING *
            `,
      [identificacion, nombre, apellido, telefono, estado, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json({
      mensaje: "Cliente actualizado exitosamente",
      cliente: resultado.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: "Error al actualizar cliente",
    });
  }
};

module.exports = {
  listar,
  buscar,
  crear,
  actualizar,
};
