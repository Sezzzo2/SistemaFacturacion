const express = require("express");
const verificarToken = require("../middleware/authMiddleware");
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/login",

  authController.login,
);
router.get(
  "/perfil",
  verificarToken,

  (req, res) => {
    res.json({
      autenticado: true,
      usuario: req.usuario,
    });
  },
);
module.exports = router;
