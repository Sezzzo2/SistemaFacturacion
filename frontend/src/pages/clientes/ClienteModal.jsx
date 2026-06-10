import { useEffect, useState } from "react";
import { actualizarCliente } from "../../services/clienteService";

function ClienteModal({ cliente, mostrar, onClose, onActualizar }) {
  const [formData, setFormData] = useState({
    identificacion: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        identificacion: cliente.identificacion,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
      });
    }
  }, [cliente, mostrar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarCliente(cliente.id_cliente, formData);
      onActualizar();
      onClose();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Error al actualizar el cliente");
    }
  };

  if (!mostrar) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cliente</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="identificacion" className="form-label">
                  Identificación
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="identificacion"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteModal;
