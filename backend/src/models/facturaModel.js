const pool = require("../config/db");

const crear = async (facturaData) => {
  const {
    numeroFactura,
    idCliente,
    idEmpleado,
    nombre,
    apellido,
    identificacion,
    telefono,
    tituloAviso,
    descripcion,
    categorias,
    cantidad,
    valor,
    fechaPublicacion,
    fechaRecibido,
  } = facturaData;

  const query = `
    INSERT INTO factura (
      numero_factura,
      id_cliente,
      id_empleado,
      titulo_aviso,
      descripcion,
      categoria_aviso,
      cantidad,
      valor,
      fecha_publicacion,
      fecha_recibido,
      estado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
    RETURNING *
  `;

  const values = [
    numeroFactura,
    idCliente,
    idEmpleado,
    tituloAviso,
    descripcion,
    JSON.stringify(categorias),
    cantidad || 1,
    valor,
    fechaPublicacion,
    fechaRecibido,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const obtenerTodasLasFacturas = async () => {
  const query = `
    SELECT *
    FROM factura
    WHERE estado = true
    ORDER BY id_factura DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const obtenerFacturasPorCliente = async (idCliente) => {
  const query = `
    SELECT *
    FROM factura
    WHERE id_cliente = $1 AND estado = true
    ORDER BY id_factura DESC
  `;

  const result = await pool.query(query, [idCliente]);
  return result.rows;
};

module.exports = {
  crear,
  obtenerTodasLasFacturas,
  obtenerFacturasPorCliente,
};
