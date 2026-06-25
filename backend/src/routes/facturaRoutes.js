const express = require("express");
const facturaController = require("../controllers/facturaController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Crear factura
router.post("/", authMiddleware, facturaController.crearFactura);

// Obtener siguiente número
router.get(
  "/siguiente-numero",
  authMiddleware,
  facturaController.obtenerSiguienteNumeroFactura,
);

// Obtener todas las facturas
router.get("/", authMiddleware, facturaController.obtenerFacturas);

// Obtener facturas por cliente
router.get(
  "/:idCliente",
  authMiddleware,
  facturaController.obtenerFacturasPorCliente,
);

module.exports = router;
