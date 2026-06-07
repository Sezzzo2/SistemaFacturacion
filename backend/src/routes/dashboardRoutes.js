const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

router.get("/", verificarToken, (req, res) => {

    res.json({
        mensaje: "Bienvenido al Dashboard",
        usuario: req.usuario
    });

});

module.exports = router;