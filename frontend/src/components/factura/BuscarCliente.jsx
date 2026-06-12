import { useEffect, useState } from "react";
import { buscarClienteFactura } from "../../services/clienteService";
import CrearClienteModal from "../../pages/Clientes/CrearClienteModal";

function BuscarCliente({ setFactura }) {
  const [texto, setTexto] = useState("");
  const [clientes, setClientes] = useState([]);
  const [mostrarCrearCliente, setMostrarCrearCliente] = useState(false);
  useEffect(() => {
    if (texto.length < 2) {
      setClientes([]);

      return;
    }

    buscar();
  }, [texto]);

  const buscar = async () => {
    const data = await buscarClienteFactura(texto);

    setClientes(data);
  };

  return (
    <div>
      <label>Buscar Cliente</label>

      <input
        className="form-control"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nombre o identificación"
      />
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

                setTexto(cliente.nombre + " " + cliente.apellido);

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
            setTexto(nuevoCliente.nombre + " " + nuevoCliente.apellido);
          }}
        />
      )}
    </div>
  );
}

export default BuscarCliente;
