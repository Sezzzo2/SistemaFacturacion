import { useNavigate } from "react-router-dom";
import "../assets/css/sidebar.css";

function Navbar() {
  const navigate = useNavigate();

  const empleado = JSON.parse(localStorage.getItem("empleado"));

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empleado");

    navigate("/");
  };

  return (
    <div className="top-navbar">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="m-0">Sistema de Facturación</h4>

        <div>
          <span className="user-badge">
            <i className="bi bi-person-circle"></i>
            {empleado?.nombre || "Usuario"}
          </span>

          <button className="btn btn-outline-danger ms-3" onClick={cerrarSesion}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
