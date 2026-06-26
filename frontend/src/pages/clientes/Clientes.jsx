import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  obtenerClientes,
  buscarClientes,
  desactivarCliente,
} from "../../services/clienteService";
import ClienteModal from "./ClienteModal";
import CrearClienteModal from "./CrearClienteModal";
import "../../assets/css/cliente.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 7;
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

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

  const indiceUltimoCliente = paginaActual * clientesPorPagina;
  const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;
  const clientesPagina = clientes.slice(indicePrimerCliente, indiceUltimoCliente);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  const abrirModal = (cliente) => { setClienteSeleccionado(cliente); setMostrarModal(true); };
  const cerrarModal = () => { setMostrarModal(false); setClienteSeleccionado(null); };
  const abrirModalCrear = () => setMostrarModalCrear(true);
  const cerrarModalCrear = () => setMostrarModalCrear(false);

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Desactivar este cliente?")) {
      try {
        await desactivarCliente(id);
        await cargarClientes();
        const nuevasPaginas = Math.ceil((clientes.length - 1) / clientesPorPagina);
        if (paginaActual > nuevasPaginas && nuevasPaginas > 0) setPaginaActual(nuevasPaginas);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Error al desactivar el cliente");
      }
    }
  };

  // Páginas visibles en la paginación (máx 5)
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
            <h2 className="clientes-titulo">Clientes</h2>
            <p className="clientes-subtitulo">{clientes.length} registros encontrados</p>
          </div>
          <button className="btn-agregar" onClick={abrirModalCrear}>
            <i className="bi bi-plus"></i>
            Agregar cliente
          </button>
        </div>

        {/* ── BARRA DE BÚSQUEDA ── */}
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
                <th>Estado</th>
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
                      <span className={`clientes-badge ${cliente.estado ? "clientes-badge-activo" : "clientes-badge-inactivo"}`}>
                        <span className="clientes-badge-dot"></span>
                        {cliente.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="clientes-acciones">
                        <button
                          className="clientes-btn-accion clientes-btn-editar"
                          onClick={() => abrirModal(cliente)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="clientes-btn-accion clientes-btn-eliminar"
                          onClick={() => eliminarCliente(cliente.id_cliente)}
                          title="Desactivar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="clientes-empty">
                    <i className="bi bi-people" style={{ fontSize: 32, display: "block", marginBottom: 8, opacity: 0.3 }}></i>
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINACIÓN ── */}
        {totalPaginas > 1 && (
          <div className="clientes-paginacion">
            <span className="clientes-pag-info">
              Página {paginaActual} de {totalPaginas}
            </span>
            <div className="clientes-pag-botones">
              <button
                className="clientes-pag-btn"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => p - 1)}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {getPaginas().map((p) => (
                <button
                  key={p}
                  className={`clientes-pag-btn ${paginaActual === p ? "clientes-pag-activo" : ""}`}
                  onClick={() => setPaginaActual(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="clientes-pag-btn"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

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