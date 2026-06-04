require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

pool.connect()
    .then(() => {
        console.log("PostgreSQL conectado");
        
        app.listen(PORT, () => {
            console.log(`Servidor en puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });