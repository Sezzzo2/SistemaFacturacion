const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        mensaje: "API funcionando correctamente"
    });
});

module.exports = router;