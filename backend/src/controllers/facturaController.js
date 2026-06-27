const pool = require("../config/db");
const facturaModel = require("../models/facturaModel");

const crearFactura = async (req, res) => {
  try {
    const {
      nombre, apellido, identificacion, telefono,
      tituloAviso, descripcion, categorias,
      cantidad, valor, fechaPublicacion, fechaRecibido, idCliente,
    } = req.body;

    const idEmpleado = req.usuario?.id || req.usuario?.id_empleado;
    if (!idEmpleado) return res.status(401).json({ mensaje: "No se pudo identificar al empleado" });

    if (!nombre || !apellido || !identificacion || !telefono || !tituloAviso ||
        !descripcion || !categorias || !Array.isArray(categorias) ||
        categorias.length === 0 || !valor || !fechaPublicacion || !fechaRecibido) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos o las categorías están vacías" });
    }

    let clienteId = idCliente;
    if (!clienteId) {
      const clienteExistente = await pool.query(
        "SELECT id_cliente FROM cliente WHERE identificacion = $1 AND estado = true",
        [identificacion]
      );
      if (clienteExistente.rows.length > 0) {
        clienteId = clienteExistente.rows[0].id_cliente;
      } else {
        const resultadoCliente = await pool.query(
          `INSERT INTO cliente (identificacion, nombre, apellido, telefono, estado)
           VALUES ($1, $2, $3, $4, true) RETURNING id_cliente`,
          [identificacion, nombre, apellido, telefono]
        );
        clienteId = resultadoCliente.rows[0].id_cliente;
      }
    }

    const resultadoSecuencia = await pool.query(
      `SELECT nextval('factura_numero_factura_seq') AS numero_factura`
    );
    const nuevoNumeroFactura = resultadoSecuencia.rows[0].numero_factura;

    const factura = await facturaModel.crear({
      numeroFactura: nuevoNumeroFactura, idCliente: clienteId, idEmpleado,
      tituloAviso, descripcion, categorias, cantidad, valor, fechaPublicacion, fechaRecibido,
    });

    res.status(201).json({ mensaje: "Factura creada exitosamente", factura });
  } catch (error) {
    console.error("Error al crear factura:", error);
    if (error.code === "23505") return res.status(409).json({ mensaje: "El número de factura ya existe" });
    res.status(500).json({ mensaje: "Error al crear la factura", error: error.message });
  }
};

const parsearCategorias = (facturas) =>
  facturas.map((f) => ({
    ...f,
    categoria_aviso: f.categoria_aviso
      ? typeof f.categoria_aviso === "string"
        ? JSON.parse(f.categoria_aviso)
        : f.categoria_aviso
      : [],
  }));

const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await facturaModel.obtenerTodasLasFacturas();
    res.json(parsearCategorias(facturas));
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({ mensaje: "Error al obtener las facturas" });
  }
};

const obtenerFacturasInactivas = async (req, res) => {
  try {
    const facturas = await facturaModel.obtenerFacturasInactivas();
    res.json(parsearCategorias(facturas));
  } catch (error) {
    console.error("Error al obtener facturas inactivas:", error);
    res.status(500).json({ mensaje: "Error al obtener las facturas inactivas" });
  }
};

const obtenerFacturasPorCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const facturas = await facturaModel.obtenerFacturasPorCliente(idCliente);
    res.json(parsearCategorias(facturas));
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({ mensaje: "Error al obtener las facturas" });
  }
};

const actualizarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.actualizarFactura(id, req.body);
    if (!factura) return res.status(404).json({ mensaje: "Factura no encontrada" });
    res.json({ mensaje: "Factura actualizada", factura });
  } catch (error) {
    console.error("Error al actualizar factura:", error);
    res.status(500).json({ mensaje: "Error al actualizar la factura" });
  }
};

const desactivarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.desactivarFactura(id);
    if (!factura) return res.status(404).json({ mensaje: "Factura no encontrada" });
    res.json({ mensaje: "Factura desactivada", factura });
  } catch (error) {
    console.error("Error al desactivar factura:", error);
    res.status(500).json({ mensaje: "Error al desactivar la factura" });
  }
};

const activarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.activarFactura(id);
    if (!factura) return res.status(404).json({ mensaje: "Factura no encontrada" });
    res.json({ mensaje: "Factura activada", factura });
  } catch (error) {
    console.error("Error al activar factura:", error);
    res.status(500).json({ mensaje: "Error al activar la factura" });
  }
};

const obtenerSiguienteNumeroFactura = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT COALESCE(MAX(numero_factura), 45000) + 1 AS numero_factura FROM factura`
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error obteniendo consecutivo" });
  }
};

module.exports = {
  crearFactura,
  obtenerFacturas,
  obtenerFacturasInactivas,
  obtenerFacturasPorCliente,
  actualizarFactura,
  desactivarFactura,
  activarFactura,
  obtenerSiguienteNumeroFactura,
};