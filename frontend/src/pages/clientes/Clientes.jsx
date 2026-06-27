import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  obtenerClientes,
  buscarClientes,
  desactivarCliente,
  activarCliente,
} from "../../services/clienteService";
import ClienteModal from "./ClienteModal";
import CrearClienteModal from "./CrearClienteModal";
import ConfirmModal from "../../components/Confirmmodal";
import "../../assets/css/cliente.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [vistaInactivos, setVistaInactivos] = useState(false);
  const clientesPorPagina = 7;
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // ── Confirm modal ──
  const [confirm, setConfirm] = useState({ mostrar: false, titulo: "", mensaje: "", labelConfirmar: "", variante: "danger", onConfirmar: null });

  const abrirConfirm = (opciones) => setConfirm({ mostrar: true, ...opciones });
  const cerrarConfirm = () => setConfirm((prev) => ({ ...prev, mostrar: false }));

  useEffect(() => { cargarClientes(); }, []);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const buscar = async (texto) => {
    setBusqueda(texto);
    setPaginaActual(1);
    if (texto.trim() === "") { await cargarClientes(); return; }
    try {
      const data = await buscarClientes(texto);
      setClientes(data);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
    }
  };

  const cambiarVista = (inactivos) => {
    setVistaInactivos(inactivos);
    setPaginaActual(1);
    setBusqueda("");
    cargarClientes();
  };

  const clientesFiltrados = clientes.filter((c) =>
    vistaInactivos ? !c.estado : c.estado
  );

  const indiceUltimo = paginaActual * clientesPorPagina;
  const indicePrimero = indiceUltimo - clientesPorPagina;
  const clientesPagina = clientesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const abrirModal = (cliente) => { setClienteSeleccionado(cliente); setMostrarModal(true); };
  const cerrarModal = () => { setMostrarModal(false); setClienteSeleccionado(null); };
  const abrirModalCrear = () => setMostrarModalCrear(true);
  const cerrarModalCrear = () => setMostrarModalCrear(false);

  const eliminarCliente = (cliente) => {
    abrirConfirm({
      titulo: "¿Desactivar cliente?",
      mensaje: `${cliente.nombre} ${cliente.apellido} quedará inactivo y no aparecerá en la lista principal.`,
      labelConfirmar: "Desactivar",
      variante: "danger",
      onConfirmar: async () => {
        cerrarConfirm();
        try {
          await desactivarCliente(cliente.id_cliente);
          await cargarClientes();
          const nuevasPaginas = Math.ceil((clientesFiltrados.length - 1) / clientesPorPagina);
          if (paginaActual > nuevasPaginas && nuevasPaginas > 0) setPaginaActual(nuevasPaginas);
        } catch (error) {
          console.error("Error al desactivar:", error);
        }
      },
    });
  };

  const reactivarCliente = (cliente) => {
    abrirConfirm({
      titulo: "¿Activar cliente?",
      mensaje: `${cliente.nombre} ${cliente.apellido} volverá a aparecer como cliente activo.`,
      labelConfirmar: "Activar",
      variante: "success",
      onConfirmar: async () => {
        cerrarConfirm();
        try {
          await activarCliente(cliente.id_cliente);
          await cargarClientes();
          const nuevasPaginas = Math.ceil((clientesFiltrados.length - 1) / clientesPorPagina);
          if (paginaActual > nuevasPaginas && nuevasPaginas > 0) setPaginaActual(nuevasPaginas);
        } catch (error) {
          console.error("Error al activar:", error);
        }
      },
    });
  };

  const getPaginas = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, paginaActual - delta); i <= Math.min(totalPaginas, paginaActual + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <MainLayout>
      <div className="clientes-page">

        {/* ── ENCABEZADO ── */}
        <div className="clientes-header">
          <div>
            <h2 className="clientes-titulo">
              {vistaInactivos ? "Clientes inactivos" : "Clientes"}
            </h2>
            <p className="clientes-subtitulo">
              {clientesFiltrados.length} registros encontrados
            </p>
          </div>
          <div className="clientes-header-acciones">
            <button
              className={`btn-vista ${vistaInactivos ? "btn-vista-activo" : ""}`}
              onClick={() => cambiarVista(!vistaInactivos)}
            >
              <i className={`bi ${vistaInactivos ? "bi-people-fill" : "bi-person-slash"}`}></i>
              {vistaInactivos ? "Ver activos" : "Clientes inactivos"}
            </button>
            {!vistaInactivos && (
              <button className="btn-agregar" onClick={abrirModalCrear}>
                <i className="bi bi-plus"></i>
                Agregar cliente
              </button>
            )}
          </div>
        </div>

        {/* ── BÚSQUEDA ── */}
        <div className="clientes-busqueda">
          <i className="bi bi-search clientes-busqueda-icon"></i>
          <input
            className="clientes-input"
            placeholder="Buscar por nombre, apellido o identificación..."
            value={busqueda}
            onChange={(e) => buscar(e.target.value)}
          />
          {busqueda && (
            <button className="clientes-clear" onClick={() => buscar("")}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        {/* ── TABLA ── */}
        <div className="clientes-tabla-wrapper">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesPagina.length > 0 ? (
                clientesPagina.map((cliente) => (
                  <tr key={cliente.id_cliente}>
                    <td className="clientes-td-id">#{cliente.id_cliente}</td>
                    <td>{cliente.identificacion}</td>
                    <td className="clientes-td-nombre">{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td className="clientes-td-muted">{cliente.telefono}</td>
                    <td>
                      <div className="clientes-acciones">
                        {vistaInactivos ? (
                          <button
                            className="clientes-btn-accion clientes-btn-activar"
                            onClick={() => reactivarCliente(cliente)}
                            title="Activar cliente"
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Activar
                          </button>
                        ) : (
                          <>
                            <button
                              className="clientes-btn-accion clientes-btn-editar"
                              onClick={() => abrirModal(cliente)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="clientes-btn-accion clientes-btn-eliminar"
                              onClick={() => eliminarCliente(cliente)}
                              title="Desactivar"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="clientes-empty">
                    <i className="bi bi-people" style={{ fontSize: 32, display: "block", marginBottom: 8, opacity: 0.3 }}></i>
                    {vistaInactivos ? "No hay clientes inactivos" : "No se encontraron clientes"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINACIÓN ── */}
        {totalPaginas > 1 && (
          <div className="clientes-paginacion">
            <span className="clientes-pag-info">Página {paginaActual} de {totalPaginas}</span>
            <div className="clientes-pag-botones">
              <button className="clientes-pag-btn" disabled={paginaActual === 1} onClick={() => setPaginaActual((p) => p - 1)}>
                <i className="bi bi-chevron-left"></i>
              </button>
              {getPaginas().map((p) => (
                <button key={p} className={`clientes-pag-btn ${paginaActual === p ? "clientes-pag-activo" : ""}`} onClick={() => setPaginaActual(p)}>
                  {p}
                </button>
              ))}
              <button className="clientes-pag-btn" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual((p) => p + 1)}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALES ── */}
      <ConfirmModal
        mostrar={confirm.mostrar}
        titulo={confirm.titulo}
        mensaje={confirm.mensaje}
        labelConfirmar={confirm.labelConfirmar}
        variante={confirm.variante}
        onConfirmar={confirm.onConfirmar}
        onCancelar={cerrarConfirm}
      />
      <ClienteModal
        cliente={clienteSeleccionado}
        mostrar={mostrarModal}
        onClose={cerrarModal}
        onActualizar={cargarClientes}
      />
      <CrearClienteModal
        mostrar={mostrarModalCrear}
        onClose={cerrarModalCrear}
        onCrear={cargarClientes}
      />
    </MainLayout>
  );
}

export default Clientes;