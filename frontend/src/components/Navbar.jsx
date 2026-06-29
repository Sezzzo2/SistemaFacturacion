import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const empleado = (() => {
    try {
      const raw = localStorage.getItem("empleado");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const nombreUsuario = empleado?.usuario || empleado?.nombre || "Usuario";
  const iniciales = nombreUsuario.slice(0, 2).toUpperCase();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empleado");
    navigate("/");
  };

  return (
    <nav className="navbar-custom">
      {/* Marca */}
      <div className="navbar-brand-custom">
        <i className="bi bi-receipt-cutoff"></i>
        <span>La República</span>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "navbar-link-active" : ""}`
            }
          >
            <i className="bi bi-speedometer2"></i>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "navbar-link-active" : ""}`
            }
          >
            <i className="bi bi-people"></i>
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/facturas"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "navbar-link-active" : ""}`
            }
          >
            <i className="bi bi-receipt"></i>
            Facturación
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/historial"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "navbar-link-active" : ""}`
            }
          >
            <i className="bi bi-bar-chart"></i>
            Historial facturas
          </NavLink>
        </li>
      </ul>

      {/* Usuario + cerrar sesión */}
      <div className="navbar-user">
        <div className="navbar-avatar">{iniciales}</div>
        <span className="navbar-username">{nombreUsuario}</span>
        <button
          className="navbar-logout"
          onClick={cerrarSesion}
          title="Cerrar sesión"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
