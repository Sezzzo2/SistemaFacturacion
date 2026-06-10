const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const clienteController = require("../controllers/clienteController");

router.get("/", verificarToken, clienteController.listar);

router.get("/buscar", verificarToken, clienteController.buscar);

router.post("/", verificarToken, clienteController.crear);

router.put("/:id", verificarToken, clienteController.actualizar);

module.exports = router;
