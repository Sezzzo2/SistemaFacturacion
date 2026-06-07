const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const empleadoModel = require("../models/empleadoModel");

const login = async (usuario, contrasena) => {

    const empleado = await empleadoModel.buscarPorUsuario(usuario);

    if (!empleado) {
        throw new Error("Usuario no encontrado");
    }

    const coincide = await bcrypt.compare(
        contrasena,
        empleado.contrasena
    );

    if (!coincide) {
        throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(

        {
            id: empleado.id_empleado,
            usuario: empleado.usuario
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    );

    return {

        token,

        empleado: {

            id: empleado.id_empleado,
            nombre: empleado.nombre,
            usuario: empleado.usuario

        }

    };

};

module.exports = {

    login

};