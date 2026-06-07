const authService = require("../services/authService");

const login = async (req, res) => {

    console.log("BODY RECIBIDO:", req.body);

    try {

        const { usuario, contrasena } = req.body;

        const resultado = await authService.login(
            usuario,
            contrasena
        );

        res.json(resultado);

    } catch (error) {

        res.status(401).json({
            mensaje: error.message
        });

    }

};

module.exports = {
    login
};