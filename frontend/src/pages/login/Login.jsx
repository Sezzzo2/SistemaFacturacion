import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../services/authService";
import "../../assets/css/login.css";

function Login() {
  const [usuario, setUsuario] = useState("");

  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const iniciarSesion = async () => {
    try {
      const data = await login(usuario, contrasena);

      auth.login(data.token);

      localStorage.setItem(
        "empleado",

        JSON.stringify(data.empleado),
      );

      navigate("/dashboard");
    } catch {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-logo">🏢</div>

          <h3 className="login-title">Sistema de Facturación</h3>

          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <div className="login-body">
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>

            <input
              id="usuario"
              type="text"
              className="form-control"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>

            <input
              id="contrasena"
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            />
          </div>

          <button className="btn-login" onClick={iniciarSesion}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Ingresar
          </button>

          <p className="form-text">© 2025 Sistema de Facturación. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
