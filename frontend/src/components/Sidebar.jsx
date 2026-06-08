import { NavLink } from "react-router-dom";
import "../assets/css/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <i className="bi bi-calculator"></i>
        Facturación
      </div>

      <div className="p-3">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-speedometer2"></i>
          Dashboard
        </NavLink>

        <NavLink to="/clientes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people"></i>
          Clientes
        </NavLink>

        <NavLink to="/facturas" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-receipt"></i>
          Facturación
        </NavLink>

        <NavLink to="/reportes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-bar-chart"></i>
          Reportes
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
