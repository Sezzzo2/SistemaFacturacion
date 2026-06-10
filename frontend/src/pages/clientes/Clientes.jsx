import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { obtenerClientes, buscarClientes, desactivarCliente } from "../../services/clienteService";
import ClienteModal from "./ClienteModal";
import CrearClienteModal from "./CrearClienteModal";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const data = await obtenerClientes();

    setClientes(data);
  };

  const buscar = async (texto) => {
    setBusqueda(texto);

    if (texto.trim() === "") {
      cargarClientes();

      return;
    }

    const data = await buscarClientes(texto);

    setClientes(data);
  };

  const abrirModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteSeleccionado(null);
  };

  const abrirModalCrear = () => {
    setMostrarModalCrear(true);
  };

  const cerrarModalCrear = () => {
    setMostrarModalCrear(false);
  };

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas desactivar este cliente?")) {
      try {
        await desactivarCliente(id);
        cargarClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Error al desactivar el cliente");
      }
    }
  };

  return (
    <MainLayout>
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Buscar por identificación, nombre o apellido"
              value={busqueda}
              onChange={(e) => buscar(e.target.value)}
            />
            <button className="btn btn-primary" type="button">
              <i className="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-success"
            onClick={abrirModalCrear}
          >
            <i className="bi bi-plus-circle"></i> Agregar Cliente
          </button>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">
          <h3>Clientes</h3>

          <table className="table table-hover">
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
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>

                  <td>{cliente.identificacion}</td>

                  <td>{cliente.nombre}</td>

                  <td>{cliente.apellido}</td>

                  <td>{cliente.telefono}</td>

                  <td>
                    {cliente.estado ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-danger">Inactivo</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => abrirModal(cliente)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarCliente(cliente.id_cliente)}
                      title="Desactivar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
