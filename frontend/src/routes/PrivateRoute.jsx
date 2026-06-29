import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { obtenerPerfil } from "../services/authService";

function PrivateRoute({ children }) {
  const [estado, setEstado] = useState("verificando");

  useEffect(() => {
    const verificar = async () => {
      const token = localStorage.getItem("token");

      // Sin token → directo al login
      if (!token) {
        setEstado("invalido");
        return;
      }

      try {
        await obtenerPerfil();
        setEstado("ok");
      } catch (error) {
        // Solo sacar al login si el token es inválido (401)
        // Errores de red (500, sin conexión) mantienen la sesión
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("empleado");
          setEstado("invalido");
        } else {
          // Error de red o servidor caído — dejar pasar con el token que tiene
          setEstado("ok");
        }
      }
    };

    verificar();
  }, []);

  if (estado === "verificando") return null;
  if (estado === "invalido") return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;