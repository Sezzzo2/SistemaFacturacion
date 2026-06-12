const express = require("express");
const facturaController = require("../controllers/facturaController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Crear factura (protegido)
router.post("/", authMiddleware, facturaController.crearFactura);

// Obtener todas las facturas (protegido)
router.get("/", authMiddleware, facturaController.obtenerFacturas);

// Obtener facturas por cliente (protegido)
router.get("/:idCliente", authMiddleware, facturaController.obtenerFacturasPorCliente);

module.exports = router;
