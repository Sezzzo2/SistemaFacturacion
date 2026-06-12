import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil } from "../../services/authService";
import MainLayout from "../../layouts/MainLayout";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfil();

        setUsuario(data.usuario);
      } catch {
        localStorage.removeItem("token");

        localStorage.removeItem("empleado");

        navigate("/");
      }
    };

    cargarPerfil();
  }, [navigate]);

  return (
    <MainLayout>
      <h2 className="dashboard-title mb-4">Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card dashboard-card shadow">
            <div className="card-body">
              <h5>Clientes</h5>

              <div className="dashboard-number">0</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card dashboard-card shadow h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/facturas")}
          >
            <div className="card-body text-center">

              <h5 className="mt-3">Nueva Factura</h5>

              <p className="text-muted">Crear una nueva factura</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card dashboard-card shadow">
            <div className="card-body">
              <h5>Total Facturado</h5>

              <div className="dashboard-number">$0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 mt-4">
        <div className="card-body">
          <h4>Bienvenido {usuario?.usuario}</h4>

          <p className="text-muted">
            Administra clientes, genera facturas y consulta reportes desde este
            panel.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
