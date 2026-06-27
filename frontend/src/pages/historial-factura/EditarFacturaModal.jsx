import { useState, useEffect } from "react";
import { actualizarFactura } from "../../services/facturaService";
import "../../assets/css/editarfacturamodal.css";

const CATEGORIAS = [
  "PRENSA", "RADIO", "AVISO DE LEY", "LICITACIÓN",
  "EDICTO DE NOTARIA", "EDICTO DE JUZGADO", "REMATE",
  "CORMACARENA", "CURADURÍA",
];

function EditarFacturaModal({ factura, mostrar, onClose, onActualizar }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    telefono: "",
    tituloAviso: "",
    descripcion: "",
    categorias: [],
    cantidad: 1,
    valor: "",
    fechaPublicacion: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (factura) {
      setForm({
        nombre: factura.cliente_nombre || "",
        apellido: factura.cliente_apellido || "",
        identificacion: factura.cliente_identificacion || "",
        telefono: factura.cliente_telefono || "",
        tituloAviso: factura.titulo_aviso || "",
        descripcion: factura.descripcion || "",
        categorias: factura.categoria_aviso || [],
        cantidad: factura.cantidad || 1,
        valor: factura.valor || "",
        fechaPublicacion: factura.fecha_publicacion?.split("T")[0] || "",
      });
      setError("");
    }
  }, [factura]);

  if (!mostrar || !factura) return null;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCategoria = (cat) => {
    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter((c) => c !== cat)
        : [...prev.categorias, cat],
    }));
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.apellido.trim() || !form.identificacion.trim()) {
      setError("Nombre, apellido e identificación son requeridos"); return;
    }
    if (!form.tituloAviso.trim() || !form.descripcion.trim()) {
      setError("Título y descripción son requeridos"); return;
    }
    if (form.categorias.length === 0) {
      setError("Selecciona al menos una categoría"); return;
    }
    if (!form.valor || parseFloat(form.valor) <= 0) {
      setError("El valor debe ser mayor a 0"); return;
    }
    if (!form.fechaPublicacion) {
      setError("La fecha de publicación es requerida"); return;
    }

    setCargando(true);
    setError("");
    try {
      await actualizarFactura(factura.id_factura, form);
      await onActualizar();
      onClose();
    } catch (err) {
      setError("Error al guardar los cambios");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="efm-overlay" onClick={onClose}>
      <div className="efm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="efm-header">
          <div>
            <h5 className="efm-titulo">Editar Factura</h5>
            <span className="efm-subtitulo">No. {factura.numero_factura}</span>
          </div>
          <button className="efm-cerrar" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="efm-body">

          {/* Datos del cliente */}
          <p className="efm-seccion">Datos del cliente</p>
          <div className="efm-row">
            <div className="efm-campo">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={cambiar} />
            </div>
            <div className="efm-campo">
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={cambiar} />
            </div>
          </div>
          <div className="efm-row">
            <div className="efm-campo">
              <label>Identificación</label>
              <input name="identificacion" value={form.identificacion} onChange={cambiar} />
            </div>
            <div className="efm-campo">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={cambiar} />
            </div>
          </div>

          {/* Datos del aviso */}
          <p className="efm-seccion">Datos del aviso</p>
          <div className="efm-campo">
            <label>Título del aviso</label>
            <input name="tituloAviso" value={form.tituloAviso} onChange={cambiar} />
          </div>
          <div className="efm-campo">
            <label>Descripción</label>
            <textarea name="descripcion" rows={3} value={form.descripcion} onChange={cambiar} />
          </div>

          {/* Categorías */}
          <div className="efm-campo">
            <label>Categorías</label>
            <div className="efm-categorias">
              {CATEGORIAS.map((cat) => (
                <label key={cat} className={`efm-cat ${form.categorias?.includes(cat) ? "efm-cat-activa" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.categorias?.includes(cat) || false}
                    onChange={() => toggleCategoria(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="efm-row">
            <div className="efm-campo">
              <label>Valor</label>
              <input type="number" name="valor" value={form.valor} onChange={cambiar} />
            </div>
            <div className="efm-campo">
              <label>Cantidad</label>
              <input type="number" name="cantidad" value={form.cantidad} onChange={cambiar} min="1" />
            </div>
            <div className="efm-campo">
              <label>Fecha de publicación</label>
              <input type="date" name="fechaPublicacion" value={form.fechaPublicacion} onChange={cambiar} />
            </div>
          </div>

          {error && <p className="efm-error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="efm-footer">
          <button className="efm-btn-cancelar" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
          <button className="efm-btn-guardar" onClick={guardar} disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarFacturaModal;