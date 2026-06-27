import { useEffect, useState } from "react";
import { buscarClienteFactura } from "../../services/clienteService";
import CrearClienteModal from "../../pages/Clientes/CrearClienteModal";

function BuscarCliente({ setFactura, factura }) {
  const [texto, setTexto] = useState("");
  const [clientes, setClientes] = useState([]);
  const [mostrarCrearCliente, setMostrarCrearCliente] = useState(false);

  // Si ya hay un cliente cargado en la factura, mostrar su nombre en el input
  useEffect(() => {
    if (factura?.nombre) {
      setTexto(`${factura.nombre} ${factura.apellido || ""}`.trim());
    }
  }, []);

  useEffect(() => {
    if (texto.length < 2) {
      setClientes([]);
      return;
    }
    buscar();
  }, [texto]);

  const buscar = async () => {
    const data = await buscarClienteFactura(texto);
    setClientes(data.filter((c) => c.estado === true)); 
  };

  const limpiarCliente = () => {
    setTexto("");
    setClientes([]);
    setFactura((prev) => ({
      ...prev,
      idCliente: null,
      nombre: "",
      apellido: "",
      identificacion: "",
      telefono: "",
    }));
  };

  const clienteSeleccionado = !!factura?.idCliente;

  return (
    <div>
      <label>Buscar Cliente</label>

      <div className="input-group">
        <input
          className="form-control"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            // Si el usuario edita el texto, desvincula el cliente
            if (clienteSeleccionado) {
              setFactura((prev) => ({ ...prev, idCliente: null }));
            }
          }}
          placeholder="Nombre o identificación"
        />
        {clienteSeleccionado && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={limpiarCliente}
            title="Quitar cliente"
          >
            ✕
          </button>
        )}
      </div>

      {clientes.length > 0 && (
        <div className="list-group shadow">
          {clientes.map((cliente) => (
            <button
              key={cliente.id_cliente}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                setFactura((prev) => ({
                  ...prev,
                  idCliente: cliente.id_cliente,
                  nombre: cliente.nombre,
                  apellido: cliente.apellido,
                  identificacion: cliente.identificacion,
                  telefono: cliente.telefono || "",
                }));
                setTexto(`${cliente.nombre} ${cliente.apellido}`);
                setClientes([]);
              }}
            >
              <strong>
                {cliente.nombre} {cliente.apellido}
              </strong>
              <br />
              <small>{cliente.identificacion}</small>
            </button>
          ))}

          <button
            type="button"
            className="list-group-item list-group-item-action text-danger fw-bold"
            onClick={() => setMostrarCrearCliente(true)}
          >
            ➕ Crear nuevo cliente
          </button>
        </div>
      )}

      {mostrarCrearCliente && (
        <CrearClienteModal
          mostrar={mostrarCrearCliente}
          onClose={() => setMostrarCrearCliente(false)}
          onCrear={(nuevoCliente) => {
            setFactura((prev) => ({
              ...prev,
              nombre: nuevoCliente.nombre,
              apellido: nuevoCliente.apellido,
              identificacion: nuevoCliente.identificacion,
              telefono: nuevoCliente.telefono || "",
            }));
            setTexto(`${nuevoCliente.nombre} ${nuevoCliente.apellido}`);
          }}
        />
      )}
    </div>
  );
}

export default BuscarCliente;
