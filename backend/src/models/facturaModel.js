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
      numero_factura, id_cliente, id_empleado,
      nombre, apellido, identificacion, telefono,
      titulo_aviso, descripcion, categoria_aviso,
      cantidad, valor, fecha_publicacion, fecha_recibido, estado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true)
    RETURNING *
  `;

  const values = [
    numeroFactura,
    idCliente,
    idEmpleado,
    nombre,
    apellido,
    identificacion,
    telefono,
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
    SELECT
      f.id_factura,
      f.numero_factura,
      f.titulo_aviso,
      f.descripcion,
      f.categoria_aviso,
      f.cantidad,
      f.valor,
      f.fecha_publicacion,
      f.fecha_recibido,
      f.estado,
      c.nombre        AS cliente_nombre,
      c.apellido      AS cliente_apellido,
      c.identificacion AS cliente_identificacion,
      c.telefono      AS cliente_telefono
    FROM factura f
    LEFT JOIN cliente c ON f.id_cliente = c.id_cliente
    WHERE f.estado = true
    ORDER BY f.id_factura DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const obtenerFacturasInactivas = async () => {
  const query = `
    SELECT
      f.id_factura,
      f.numero_factura,
      f.titulo_aviso,
      f.descripcion,
      f.categoria_aviso,
      f.cantidad,
      f.valor,
      f.fecha_publicacion,
      f.fecha_recibido,
      f.estado,
      c.nombre        AS cliente_nombre,
      c.apellido      AS cliente_apellido,
      c.identificacion AS cliente_identificacion,
      c.telefono      AS cliente_telefono
    FROM factura f
    LEFT JOIN cliente c ON f.id_cliente = c.id_cliente
    WHERE f.estado = false
    ORDER BY f.id_factura DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const obtenerFacturasPorCliente = async (idCliente) => {
  const query = `
    SELECT
      f.*,
      c.nombre        AS cliente_nombre,
      c.apellido      AS cliente_apellido,
      c.identificacion AS cliente_identificacion,
      c.telefono      AS cliente_telefono
    FROM factura f
    LEFT JOIN cliente c ON f.id_cliente = c.id_cliente
    WHERE f.id_cliente = $1 AND f.estado = true
    ORDER BY f.id_factura DESC
  `;
  const result = await pool.query(query, [idCliente]);
  return result.rows;
};

const actualizarFactura = async (id, datos) => {
  const {
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
  } = datos;

  // Verificar cuántas facturas tiene ese cliente
  const conteo = await pool.query(
    `SELECT COUNT(*) FROM factura 
     WHERE id_cliente = (SELECT id_cliente FROM factura WHERE id_factura = $1)
     AND estado = true`,
    [id],
  );

  // Solo actualizar el cliente si esta es su única factura
  if (parseInt(conteo.rows[0].count) <= 1) {
    await pool.query(
      `UPDATE cliente SET nombre=$1, apellido=$2, identificacion=$3, telefono=$4
       WHERE id_cliente = (SELECT id_cliente FROM factura WHERE id_factura=$5)`,
      [nombre, apellido, identificacion, telefono, id],
    );
  }

  const result = await pool.query(
    `UPDATE factura SET
      titulo_aviso=$1, descripcion=$2, categoria_aviso=$3,
      cantidad=$4, valor=$5, fecha_publicacion=$6
     WHERE id_factura=$7 RETURNING *`,
    [
      tituloAviso,
      descripcion,
      JSON.stringify(categorias),
      cantidad,
      valor,
      fechaPublicacion,
      id,
    ],
  );
  return result.rows[0];
};

const desactivarFactura = async (id) => {
  const result = await pool.query(
    "UPDATE factura SET estado = false WHERE id_factura = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

const activarFactura = async (id) => {
  const result = await pool.query(
    "UPDATE factura SET estado = true WHERE id_factura = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

module.exports = {
  crear,
  obtenerTodasLasFacturas,
  obtenerFacturasInactivas,
  obtenerFacturasPorCliente,
  actualizarFactura,
  desactivarFactura,
  activarFactura,
};
