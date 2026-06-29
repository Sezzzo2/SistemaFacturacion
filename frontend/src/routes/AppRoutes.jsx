import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Clientes from "../pages/Clientes/Clientes";
import Facturas from "../pages/Facturas/Facturas";
import HistorialFacturas from "../pages/historial-factura/HistorialFacturas";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login — si ya tiene token válido, redirige al dashboard */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes"  element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/facturas"  element={<PrivateRoute><Facturas /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><HistorialFacturas /></PrivateRoute>} />

        {/* Cualquier ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;