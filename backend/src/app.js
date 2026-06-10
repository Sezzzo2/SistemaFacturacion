const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get('/health', (req, res) => {
    res.json({ message: 'Server is running' });
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));

module.exports = app;