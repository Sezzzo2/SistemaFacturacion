import { useEffect, useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  obtenerFacturas,
  obtenerFacturasInactivas,
  desactivarFactura,
  activarFactura,
} from "../../services/facturaService";
import ConfirmModal from "../../components/Confirmmodal";
import VistaPreviaFactura from "../../components/factura/VistaPreviaFactura";
import EditarFacturaModal from "./EditarFacturaModal";
import "../../assets/css/historial.css";
import html2pdf from "html2pdf.js";

const FACTURAS_POR_PAGINA = 5;

const handleImprimir = (factura) => {
  setFacturaImprimir({
    numeroFactura: factura.numero_factura,
    nombre: factura.cliente_nombre,
    apellido: factura.cliente_apellido,
    identificacion: factura.cliente_identificacion,
    telefono: factura.cliente_telefono,
    tituloAviso: factura.titulo_aviso,
    descripcion: factura.descripcion,
    categorias: factura.categoria_aviso || [],
    cantidad: factura.cantidad,
    valor: factura.valor,
    fechaPublicacion: factura.fecha_publicacion?.split("T")[0] || "",
    fechaRecibido: factura.fecha_recibido?.split("T")[0] || "",
  });

  const tituloOriginal = document.title;
  const tituloFactura = `Factura${factura.numero_factura}`;

  const ponerTituloFactura = () => {
    document.title = tituloFactura;
  };
  const restaurarTitulo = () => {
    document.title = tituloOriginal;
    window.removeEventListener("afterprint", restaurarTitulo);
    window.removeEventListener("beforeprint", ponerTituloFactura);
  };

  window.addEventListener("beforeprint", ponerTituloFactura);
  window.addEventListener("afterprint", restaurarTitulo);

  setTimeout(() => {
    document.title = tituloFactura;
    window.print();
  }, 300);
};

useEffect(() => {
  cargar();
}, [vistaInactivas]);

const cargar = async () => {
  try {
    const data = vistaInactivas
      ? await obtenerFacturasInactivas()
      : await obtenerFacturas();
    setFacturas(data);
    setPaginaActual(1);
  } catch (error) {
    console.error("Error al cargar facturas:", error);
  }
};

const facturasFiltradas = facturas.filter((f) => {
  const texto = busqueda.toLowerCase();
  return (
    String(f.numero_factura).includes(texto) ||
    `${f.cliente_nombre} ${f.cliente_apellido}`.toLowerCase().includes(texto) ||
    f.cliente_identificacion?.toLowerCase().includes(texto) ||
    f.titulo_aviso?.toLowerCase().includes(texto)
  );
});

const totalPaginas = Math.ceil(facturasFiltradas.length / FACTURAS_POR_PAGINA);
const inicio = (paginaActual - 1) * FACTURAS_POR_PAGINA;
const facturasPagina = facturasFiltradas.slice(
  inicio,
  inicio + FACTURAS_POR_PAGINA,
);

const getPaginas = () => {
  const range = [];
  for (
    let i = Math.max(1, paginaActual - 2);
    i <= Math.min(totalPaginas, paginaActual + 2);
    i++
  ) {
    range.push(i);
  }
  return range;
};

const abrirConfirm = (opciones) => setConfirm({ mostrar: true, ...opciones });
const cerrarConfirm = () => setConfirm((p) => ({ ...p, mostrar: false }));

const handleDesactivar = (factura) => {
  abrirConfirm({
    titulo: "¿Anular factura?",
    mensaje: `La factura No. ${factura.numero_factura} de ${factura.cliente_nombre} ${factura.cliente_apellido} pasará a inactiva.`,
    labelConfirmar: "Anular",
    variante: "danger",
    onConfirmar: async () => {
      cerrarConfirm();
      await desactivarFactura(factura.id_factura);
      await cargar();
    },
  });
};

const handleActivar = (factura) => {
  abrirConfirm({
    titulo: "¿Restaurar factura?",
    mensaje: `La factura No. ${factura.numero_factura} volverá a estar activa.`,
    labelConfirmar: "Restaurar",
    variante: "success",
    onConfirmar: async () => {
      cerrarConfirm();
      await activarFactura(factura.id_factura);
      await cargar();
    },
  });
};

const handleImprimir = (factura) => {
  setFacturaImprimir({
    numeroFactura: factura.numero_factura,
    nombre: factura.cliente_nombre,
    apellido: factura.cliente_apellido,
    identificacion: factura.cliente_identificacion,
    telefono: factura.cliente_telefono,
    tituloAviso: factura.titulo_aviso,
    descripcion: factura.descripcion,
    categorias: factura.categoria_aviso || [],
    cantidad: factura.cantidad,
    valor: factura.valor,
    fechaPublicacion: factura.fecha_publicacion?.split("T")[0] || "",
    fechaRecibido: factura.fecha_recibido?.split("T")[0] || "",
  });

  setTimeout(() => {
    const elemento = document.querySelector(".recibo-wrapper");
    html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: `factura${factura.numero_factura}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "letter", orientation: "landscape" },
      })
      .from(elemento)
      .save();
  }, 400);
};

const formatearFecha = (fecha) => {
  if (!fecha) return "---";
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

return (
  <MainLayout>
    {/* Vista oculta para impresión */}
    {facturaImprimir && (
      <div className="solo-impresion" ref={imprimirRef}>
        <VistaPreviaFactura factura={facturaImprimir} />
      </div>
    )}

    <div className="historial-page">
      {/* ── ENCABEZADO ── */}
      <div className="historial-header">
        <div>
          <h2 className="historial-titulo">
            {vistaInactivas ? "Facturas anuladas" : "Historial de facturas"}
          </h2>
          <p className="historial-subtitulo">
            {facturasFiltradas.length} registros encontrados
          </p>
        </div>
        <div className="historial-header-acciones">
          <button
            className={`btn-anuladas ${vistaInactivas ? "btn-vista-activo" : ""}`}
            onClick={() => {
              setVistaInactivas((v) => !v);
              setBusqueda("");
            }}
          >
            <i
              className={`bi ${vistaInactivas ? "bi-receipt" : "bi-archive"}`}
            ></i>
            {vistaInactivas ? "Ver activas" : "Facturas anuladas"}
          </button>
        </div>
      </div>

      {/* ── BÚSQUEDA ── */}
      <div className="historial-busqueda">
        <i className="bi bi-search historial-busqueda-icon"></i>
        <input
          className="historial-input"
          placeholder="Buscar por N° factura, cliente, cédula o título..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />
        {busqueda && (
          <button className="historial-clear" onClick={() => setBusqueda("")}>
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>

      {/* ── TABLA ── */}
      <div className="historial-tabla-wrapper">
        <table className="historial-tabla">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Cliente</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Título aviso</th>
              <th>Valor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasPagina.length > 0 ? (
              facturasPagina.map((f) => (
                <tr key={f.id_factura}>
                  <td className="historial-td-numero">#{f.numero_factura}</td>
                  <td className="historial-td-cliente">
                    {f.cliente_nombre} {f.cliente_apellido}
                  </td>
                  <td className="historial-td-cedula">
                    {f.cliente_identificacion}
                  </td>
                  <td className="historial-td-telefono">
                    {f.cliente_telefono}
                  </td>
                  <td className="historial-td-titulo">{f.titulo_aviso}</td>
                  <td className="historial-td-valor">
                    ${Number(f.valor || 0).toLocaleString("es-CO")}
                  </td>
                  <td>
                    <div className="historial-acciones">
                      {vistaInactivas ? (
                        <button
                          className="historial-btn-accion clientes-btn-activar"
                          onClick={() => handleActivar(f)}
                          title="Restaurar factura"
                        >
                          <i className="bi bi-arrow-counterclockwise"></i>
                          Restaurar
                        </button>
                      ) : (
                        <>
                          <button
                            className="historial-btn-accion historial-btn-editar"
                            onClick={() => setFacturaEditar(f)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="historial-btn-accion historial-btn-imprimir"
                            onClick={() => handleImprimir(f)}
                            title="Imprimir"
                          >
                            <i className="bi bi-printer"></i>
                          </button>
                          <button
                            className="historial-btn-accion historial-btn-eliminar"
                            onClick={() => handleDesactivar(f)}
                            title="Anular factura"
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
                <td colSpan="7" className="historial-empty">
                  <i
                    className="bi bi-receipt"
                    style={{
                      fontSize: 32,
                      display: "block",
                      marginBottom: 8,
                      opacity: 0.3,
                    }}
                  ></i>
                  {vistaInactivas
                    ? "No hay facturas anuladas"
                    : "No se encontraron facturas"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINACIÓN ── */}
      {totalPaginas > 1 && (
        <div className="historial-paginacion">
          <span className="historial-pag-info">
            Página {paginaActual} de {totalPaginas}
          </span>
          <div className="historial-pag-botones">
            <button
              className="historial-pag-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {getPaginas().map((p) => (
              <button
                key={p}
                className={`historial-pag-btn ${paginaActual === p ? "historial-pag-activo" : ""}`}
                onClick={() => setPaginaActual(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="historial-pag-btn"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>

    <EditarFacturaModal
      factura={facturaEditar}
      mostrar={!!facturaEditar}
      onClose={() => setFacturaEditar(null)}
      onActualizar={cargar}
    />
    <ConfirmModal
      mostrar={confirm.mostrar}
      titulo={confirm.titulo}
      mensaje={confirm.mensaje}
      labelConfirmar={confirm.labelConfirmar}
      variante={confirm.variante}
      onConfirmar={confirm.onConfirmar}
      onCancelar={cerrarConfirm}
    />
  </MainLayout>
);

export default HistorialFacturas;
