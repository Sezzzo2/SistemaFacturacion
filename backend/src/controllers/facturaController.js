const pool = require("../config/db");
const facturaModel = require("../models/facturaModel");

const crearFactura = async (req, res) => {
  try {
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
      fechaRecibido,
      idCliente,
    } = req.body;

    // Obtener id_empleado del token JWT
    const idEmpleado = req.usuario?.id || req.usuario?.id_empleado;

    if (!idEmpleado) {
      return res.status(401).json({
        mensaje: "No se pudo identificar al empleado",
      });
    }

    // Validaciones
    if (
      !nombre ||
      !apellido ||
      !identificacion ||
      !telefono ||
      !tituloAviso ||
      !descripcion ||
      !categorias ||
      !Array.isArray(categorias) ||
      categorias.length === 0 ||
      !valor ||
      !fechaPublicacion ||
      !fechaRecibido
    ) {
      return res.status(400).json({
        mensaje: "Faltan campos requeridos o las categorías están vacías",
      });
    }

    let clienteId = idCliente;

    // Si no hay clienteId, crear un nuevo cliente
    if (!clienteId) {
      const clienteExistente = await pool.query(
        "SELECT id_cliente FROM cliente WHERE identificacion = $1 AND estado = true",
        [identificacion]
      );

      if (clienteExistente.rows.length > 0) {
        clienteId = clienteExistente.rows[0].id_cliente;
      } else {
        // Crear nuevo cliente
        const resultadoCliente = await pool.query(
          `INSERT INTO cliente (identificacion, nombre, apellido, telefono, estado)
           VALUES ($1, $2, $3, $4, true)
           RETURNING id_cliente`,
          [identificacion, nombre, apellido, telefono]
        );

        clienteId = resultadoCliente.rows[0].id_cliente;
      }
    }

    // Generar número de factura auto-incremental
    const resultadoMaximo = await pool.query(
      "SELECT MAX(numero_factura) as max_numero FROM factura"
    );

    const maxNumero = resultadoMaximo.rows[0].max_numero || 0;
    const nuevoNumeroFactura = maxNumero + 1;

    // Crear factura con el número generado automáticamente
    const factura = await facturaModel.crear({
      numeroFactura: nuevoNumeroFactura,
      idCliente: clienteId,
      idEmpleado,
      tituloAviso,
      descripcion,
      categorias,
      cantidad,
      valor,
      fechaPublicacion,
      fechaRecibido,
    });

    res.status(201).json({
      mensaje: "Factura creada exitosamente",
      factura,
    });
  } catch (error) {
    console.error("Error al crear factura:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        mensaje: "El número de factura ya existe",
      });
    }

    res.status(500).json({
      mensaje: "Error al crear la factura",
      error: error.message,
    });
  }
};

const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await facturaModel.obtenerTodasLasFacturas();

    // Parsear las categorías de JSON a array
    const facturasConCategorias = facturas.map((factura) => ({
      ...factura,
      categoria_aviso: factura.categoria_aviso
        ? (typeof factura.categoria_aviso === 'string' ? JSON.parse(factura.categoria_aviso) : factura.categoria_aviso)
        : [],
    }));

    res.json(facturasConCategorias);
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({
      mensaje: "Error al obtener las facturas",
    });
  }
};

const obtenerFacturasPorCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;

    const facturas = await facturaModel.obtenerFacturasPorCliente(idCliente);

    // Parsear las categorías de JSON a array
    const facturasConCategorias = facturas.map((factura) => ({
      ...factura,
      categoria_aviso: factura.categoria_aviso
        ? (typeof factura.categoria_aviso === 'string' ? JSON.parse(factura.categoria_aviso) : factura.categoria_aviso)
        : [],
    }));

    res.json(facturasConCategorias);
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({
      mensaje: "Error al obtener las facturas",
    });
  }
};

module.exports = {
  crearFactura,
  obtenerFacturas,
  obtenerFacturasPorCliente,
};
