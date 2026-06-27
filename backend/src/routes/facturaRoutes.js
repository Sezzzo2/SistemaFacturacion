const express = require("express");
const facturaController = require("../controllers/facturaController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",                authMiddleware, facturaController.crearFactura);
router.get("/siguiente-numero", authMiddleware, facturaController.obtenerSiguienteNumeroFactura);
router.get("/",                 authMiddleware, facturaController.obtenerFacturas);
router.get("/inactivas",        authMiddleware, facturaController.obtenerFacturasInactivas);
router.put("/:id/desactivar",   authMiddleware, facturaController.desactivarFactura);
router.put("/:id/activar",      authMiddleware, facturaController.activarFactura);
router.put("/:id",              authMiddleware, facturaController.actualizarFactura);
router.get("/:idCliente",       authMiddleware, facturaController.obtenerFacturasPorCliente);

module.exports = router;