import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil } from "../../services/authService";
import { obtenerClientes } from "../../services/clienteService";
import { obtenerFacturas } from "../../services/facturaService";
import MainLayout from "../../layouts/MainLayout";
import "../../assets/css/dashboard.css";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function GraficaBarras({ datos, meses }) {
  const max = Math.max(...datos, 1);
  return (
    <div className="db-grafica-wrapper">
      <div className="db-grafica-barras">
        {datos.map((val, i) => (
          <div key={i} className="db-barra-col">
            <div className="db-barra-label-valor">
              {val > 0 ? `$${(val / 1000).toFixed(0)}k` : ""}
            </div>
            <div className="db-barra-contenedor">
              <div
                className="db-barra"
                style={{ height: `${(val / max) * 100}%` }}
                title={`$${val.toLocaleString("es-CO")}`}
              />
            </div>
            <div className="db-barra-mes">{meses[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalFacturado, setTotalFacturado] = useState(0);
  const [totalFacturas, setTotalFacturas] = useState(0);
  const [ventasPorMes, setVentasPorMes] = useState(Array(12).fill(0));
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfilData, clientes, facturas] = await Promise.all([
          obtenerPerfil(),
          obtenerClientes(),
          obtenerFacturas(),
        ]);

        setUsuario(perfilData.usuario);

        // Total clientes activos
        const clientesActivos = clientes.filter((c) => c.estado !== false);
        setTotalClientes(clientesActivos.length);

        // Total facturado y cantidad de facturas
        const totalValor = facturas.reduce((sum, f) => sum + Number(f.valor || 0), 0);
        setTotalFacturado(totalValor);
        setTotalFacturas(facturas.length);

        // Ventas agrupadas por mes del año actual
        const anioActual = new Date().getFullYear();
        const porMes = Array(12).fill(0);
        facturas.forEach((f) => {
          const fecha = f.fecha_publicacion || f.fecha_recibido;
          if (!fecha) return;
          const d = new Date(fecha);
          if (d.getFullYear() === anioActual) {
            porMes[d.getMonth()] += Number(f.valor || 0);
          }
        });
        setVentasPorMes(porMes);

        // Últimas 5 facturas ordenadas por número
        const recientes = [...facturas]
          .sort((a, b) => b.numero_factura - a.numero_factura)
          .slice(0, 5);
        setFacturasRecientes(recientes);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("empleado");
        navigate("/");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [navigate]);

  const mesActual = new Date().getMonth();
  const ventasMesActual = ventasPorMes[mesActual];

  return (
    <MainLayout>
      <div className="db-page">

        {/* ── ENCABEZADO ── */}
        <div className="db-header">
          <div>
            <h2 className="db-titulo">Resumen general</h2>
            <p className="db-subtitulo">
              Bienvenido, {usuario?.usuario}
            </p>
          </div>
          <button className="db-btn-nueva" onClick={() => navigate("/facturas")}>
            <i className="bi bi-plus-lg"></i>
            Nueva factura
          </button>
        </div>

        {cargando ? (
          <div className="db-cargando">
            <i className="bi bi-arrow-repeat"></i> Cargando datos...
          </div>
        ) : (
          <>
            {/* ── TARJETAS ── */}
            <div className="db-cards">
              <div className="db-card">
                <div className="db-card-icon db-icon-clientes">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="db-card-info">
                  <span className="db-card-label">Clientes</span>
                  <span className="db-card-valor">{totalClientes}</span>
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-icon db-icon-facturado">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <div className="db-card-info">
                  <span className="db-card-label">Total facturado</span>
                  <span className="db-card-valor">
                    ${totalFacturado.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-icon db-icon-facturas">
                  <i className="bi bi-receipt"></i>
                </div>
                <div className="db-card-info">
                  <span className="db-card-label">Facturas emitidas</span>
                  <span className="db-card-valor">{totalFacturas}</span>
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-icon db-icon-mes">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <div className="db-card-info">
                  <span className="db-card-label">Ventas este mes</span>
                  <span className="db-card-valor">
                    ${ventasMesActual.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>

            {/* ── SECCIÓN CENTRAL ── */}
            <div className="db-centro">

              <div className="db-panel db-panel-grafica">
                <div className="db-panel-header">
                  <span className="db-panel-titulo">Ventas por mes</span>
                  <span className="db-panel-anio">{new Date().getFullYear()}</span>
                </div>
                <GraficaBarras datos={ventasPorMes} meses={MESES} />
              </div>

              <div className="db-panel db-panel-recientes">
                <div className="db-panel-header">
                  <span className="db-panel-titulo">Últimas facturas</span>
                  <button className="db-link" onClick={() => navigate("/historial")}>
                    Ver todas <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
                <div className="db-recientes-lista">
                  {facturasRecientes.length === 0 ? (
                    <p className="db-vacio">No hay facturas aún</p>
                  ) : (
                    facturasRecientes.map((f) => (
                      <div key={f.id_factura} className="db-reciente-item">
                        <div className="db-reciente-avatar">
                          {f.cliente_nombre?.[0]}{f.cliente_apellido?.[0]}
                        </div>
                        <div className="db-reciente-info">
                          <span className="db-reciente-nombre">
                            {f.cliente_nombre} {f.cliente_apellido}
                          </span>
                          <span className="db-reciente-titulo">{f.titulo_aviso}</span>
                        </div>
                        <div className="db-reciente-derecha">
                          <span className="db-reciente-valor">
                            ${Number(f.valor).toLocaleString("es-CO")}
                          </span>
                          <span className="db-reciente-num">#{f.numero_factura}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;