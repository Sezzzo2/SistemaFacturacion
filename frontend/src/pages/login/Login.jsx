import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../services/authService";
import { obtenerPerfil } from "../../services/authService";
import logo from "../../assets/images/logo.png";
import "../../assets/css/login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  // Si ya hay sesión activa, redirigir directo al dashboard
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setVerificando(false);
        return;
      }
      try {
        await obtenerPerfil();
        navigate("/dashboard", { replace: true }); // token válido → dashboard
      } catch {
        // Token inválido o expirado → mostrar login
        localStorage.removeItem("token");
        localStorage.removeItem("empleado");
        setVerificando(false);
      }
    };
    verificarSesion();
  }, [navigate]);

  const iniciarSesion = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setCargando(true);
    try {
      const data = await login(usuario, contrasena);
      auth.login(data.token);
      localStorage.setItem("empleado", JSON.stringify(data.empleado));
      navigate("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  // Mientras verifica la sesión, no mostrar nada
  if (verificando) return null;

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ── Franja superior ── */}
        <div className="login-top">
          <div className="login-logo">
            <img src={logo} alt="Logo La República" />
          </div>
          <h1 className="login-titulo">La República</h1>
          <p className="login-subtitulo">Sistema de Facturación</p>
        </div>

        {/* ── Formulario ── */}
        <div className="login-body">
          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="login-campo">
            <label className="login-label" htmlFor="usuario">
              Usuario
            </label>
            <div className="login-input-wrap">
              <i className="bi bi-person login-input-icon"></i>
              <input
                id="usuario"
                type="text"
                className="login-input"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && iniciarSesion()}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-campo">
            <label className="login-label" htmlFor="contrasena">
              Contraseña
            </label>
            <div className="login-input-wrap">
              <i className="bi bi-lock login-input-icon"></i>
              <input
                id="contrasena"
                type={verContrasena ? "text" : "password"}
                className="login-input"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && iniciarSesion()}
                autoComplete="current-password"
              />
              <button
                className="login-ver"
                onClick={() => setVerContrasena((v) => !v)}
                tabIndex={-1}
                type="button"
              >
                <i
                  className={`bi ${verContrasena ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            className="login-btn"
            onClick={iniciarSesion}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <i className="bi bi-arrow-repeat login-spin"></i>
                Ingresando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Ingresar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
