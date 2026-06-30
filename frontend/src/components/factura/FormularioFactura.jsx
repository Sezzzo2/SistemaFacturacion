import BuscarCliente from "./BuscarCliente";
import { crearFactura } from "../../services/facturaService";
import { useState } from "react";
import html2pdf from "html2pdf.js";

const CATEGORIAS = [
  "PRENSA",
  "RADIO",
  "AVISO DE LEY",
  "LICITACIÓN",
  "EDICTO DE NOTARIA",
  "EDICTO DE JUZGADO",
  "REMATE",
  "CORMACARENA",
  "CURADURÍA",
];

function FormularioFactura({ factura, setFactura, cargarNumeroFactura }) {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cambiarValor = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const manejarCategorias = (categoria) => {
    setFactura({
      ...factura,
      categorias: factura.categorias.includes(categoria)
        ? factura.categorias.filter((cat) => cat !== categoria)
        : [...factura.categorias, categoria],
    });
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + "T00:00:00");
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const obtenerFechaColombiana = () => {
    const ahora = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const partes = formatter.formatToParts(ahora);
    return `${partes.find((p) => p.type === "year").value}-${partes.find((p) => p.type === "month").value}-${partes.find((p) => p.type === "day").value}`;
  };

  const limpiarFormulario = (nuevoNumeroFactura) => {
    setFactura({
      numeroFactura: nuevoNumeroFactura,
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
      fechaRecibido: obtenerFechaColombiana(),
      idCliente: null,
    });
  };

  const validarFormulario = () => {
    if (!factura.nombre.trim()) return "El nombre es requerido";
    if (!factura.apellido.trim()) return "El apellido es requerido";
    if (!factura.identificacion.trim()) return "La identificación es requerida";
    if (!factura.telefono.trim()) return "El teléfono es requerido";
    if (!factura.tituloAviso.trim()) return "El título del aviso es requerido";
    if (!factura.descripcion.trim()) return "La descripción es requerida";
    if (factura.categorias.length === 0)
      return "Debe seleccionar al menos una categoría";
    if (!factura.valor || parseFloat(factura.valor) <= 0)
      return "El valor debe ser mayor a 0";
    if (!factura.cantidad || parseInt(factura.cantidad) <= 0)
      return "La cantidad debe ser mayor a 0";
    if (!factura.fechaPublicacion)
      return "La fecha de publicación es requerida";
    return null;
  };

  const guardar = async () => {
    const error = validarFormulario();
    if (error) {
      setMensaje(error);
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const fechaRecibidoActual = obtenerFechaColombiana();
      const datosFactura = {
        nombre: factura.nombre,
        apellido: factura.apellido,
        identificacion: factura.identificacion,
        telefono: factura.telefono,
        tituloAviso: factura.tituloAviso,
        descripcion: factura.descripcion,
        categorias: factura.categorias,
        cantidad: parseInt(factura.cantidad),
        valor: parseFloat(factura.valor),
        fechaPublicacion: factura.fechaPublicacion,
        fechaRecibido: fechaRecibidoActual,
        idCliente: factura.idCliente || null,
      };

      await crearFactura(datosFactura);
      setMensaje(
        `✓ Factura No. ${factura.numeroFactura} guardada exitosamente`,
      );

      setTimeout(async () => {
        const data = await cargarNumeroFactura();
        limpiarFormulario(data.numero_factura);
        setMensaje("");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar factura:", error);
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al guardar la factura. Intenta de nuevo.",
      );
    } finally {
      setCargando(false);
    }
  };

  const guardarEImprimir = async () => {
    const error = validarFormulario();
    if (error) {
      setMensaje(error);
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const fechaRecibidoActual = obtenerFechaColombiana();
      const datosFactura = {
        nombre: factura.nombre,
        apellido: factura.apellido,
        identificacion: factura.identificacion,
        telefono: factura.telefono,
        tituloAviso: factura.tituloAviso,
        descripcion: factura.descripcion,
        categorias: factura.categorias,
        cantidad: parseInt(factura.cantidad),
        valor: parseFloat(factura.valor),
        fechaPublicacion: factura.fechaPublicacion,
        fechaRecibido: fechaRecibidoActual,
        idCliente: factura.idCliente || null,
      };

      await crearFactura(datosFactura);
      setMensaje(
        `✓ Factura No. ${factura.numeroFactura} guardada. Abriendo impresión...`,
      );

      setTimeout(() => {
        const elemento = document.querySelector(".recibo-wrapper");
        html2pdf()
          .set({
            margin: [5, 5, 5, 5],
            filename: `factura${factura.numeroFactura}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "letter", orientation: "landscape" },
          })
          .from(elemento)
          .save();
      }, 400);

      setTimeout(async () => {
        const data = await cargarNumeroFactura();
        limpiarFormulario(data.numero_factura);
        setMensaje("");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar factura:", error);
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al guardar la factura. Intenta de nuevo.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card formulario-card shadow border-0">
      <div className="card-body">
        <h3 className="text-danger mb-4">Nueva Factura</h3>

        <div className="mb-3">
          <BuscarCliente setFactura={setFactura} factura={factura} />
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              name="nombre"
              value={factura.nombre}
              onChange={cambiarValor}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellido</label>
            <input
              className="form-control"
              name="apellido"
              value={factura.apellido}
              onChange={cambiarValor}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Identificación</label>
            <input
              className="form-control"
              name="identificacion"
              value={factura.identificacion}
              onChange={cambiarValor}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control"
              name="telefono"
              value={factura.telefono}
              onChange={cambiarValor}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Título del aviso</label>
          <input
            className="form-control"
            name="tituloAviso"
            value={factura.tituloAviso}
            onChange={cambiarValor}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            rows="4"
            className="form-control"
            name="descripcion"
            value={factura.descripcion}
            onChange={cambiarValor}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Categorías{" "}
            <span className="text-muted">(Selecciona una o más)</span>
          </label>
          <div className="border p-3 rounded bg-white">
            {CATEGORIAS.map((categoria) => (
              <div className="form-check mb-2" key={categoria}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`categoria-${categoria}`}
                  checked={factura.categorias.includes(categoria)}
                  onChange={() => manejarCategorias(categoria)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`categoria-${categoria}`}
                >
                  {categoria}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Valor</label>
            <input
              type="number"
              className="form-control"
              name="valor"
              value={factura.valor}
              onChange={cambiarValor}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              className="form-control"
              name="cantidad"
              value={factura.cantidad}
              onChange={cambiarValor}
              min="1"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de publicación</label>
          <input
            type="date"
            className="form-control"
            name="fechaPublicacion"
            value={factura.fechaPublicacion}
            onChange={cambiarValor}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha del recibido</label>
          <div className="p-3 bg-light rounded border">
            <strong>{formatearFecha(factura.fechaRecibido)}</strong>
            <small className="d-block text-muted mt-1">
              Fecha del día actual - Hora local Colombia
            </small>
          </div>
        </div>

        {mensaje && (
          <div
            className={`alert ${mensaje.includes("Error") || mensaje.includes("debe") || mensaje.includes("requerido") ? "alert-danger" : "alert-success"} mb-3`}
          >
            {mensaje}
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger flex-fill"
            onClick={guardar}
            disabled={cargando}
          >
            {cargando ? "⏳ Guardando..." : "💾 Guardar"}
          </button>
          <button
            className="btn btn-danger flex-fill"
            onClick={guardarEImprimir}
            disabled={cargando}
          >
            {cargando ? "⏳ Guardando..." : "🖨️ Guardar e imprimir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormularioFactura;
