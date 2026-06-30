import "../../assets/css/factura.css";
import logofactura1 from "../../assets/images/logofactura1.png";
import logofactura2 from "../../assets/images/logofactura2.png";
import logofactura3 from "../../assets/images/logofactura3.png";
import logofactura4 from "../../assets/images/logofactura4.png";

const TODAS_CATEGORIAS = [
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

function VistaPreviaFactura({ factura }) {
  const formatearFecha = (fecha) => {
    if (!fecha) return "---";

    const date = new Date(fecha + "T00:00:00");

    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const nombreCompleto = [factura.nombre, factura.apellido]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="recibo-wrapper">
      {/* ── CABECERA ── */}
      <div className="recibo-header">
        <img src={logofactura1} alt="" className="logo1" />
        <img src={logofactura2} alt="" className="logo2" />
        <img src={logofactura3} alt="" className="logo3" />
        <img src={logofactura4} alt="" className="logo4" />
      </div>

      {/* ── CUERPO PRINCIPAL (dos columnas) ── */}
      <div className="recibo-body">
        {/* COLUMNA IZQUIERDA: campos del recibo */}
        <div className="recibo-campos">
          {/* Señores */}
          <div className="recibo-fila">
            <span className="recibo-etiqueta">Señores:</span>
            <div className="recibo-campo-valor">
              <span>{nombreCompleto}</span>
              <div className="recibo-sublabel">
                {factura.identificacion && (
                  <small>CC/NIT: {factura.identificacion}</small>
                )}
                {factura.telefono && (
                  <small style={{ marginLeft: 12 }}>
                    Tel: {factura.telefono}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Título aviso */}
          <div className="recibo-fila">
            <span className="recibo-etiqueta">Título aviso:</span>
            <div className="recibo-campo-valor">
              <span>{factura.tituloAviso || ""}</span>
            </div>
          </div>

          {/* Fecha de publicación */}
          <div className="recibo-fila recibo-fila-fecha">
            <span className="recibo-etiqueta recibo-etiqueta-fecha">
              Fecha de publicación:
            </span>
            <div className="recibo-campo-valor recibo-campo-valor-fecha">
              <span>{formatearFecha(factura.fechaPublicacion)}</span>
            </div>
          </div>

          {/* Tabla Cant / Descripción / Valor */}
          <table className="recibo-tabla">
            <thead>
              <tr>
                <th className="recibo-th recibo-th-cant">Cant.</th>
                <th className="recibo-th recibo-th-desc">DESCRIPCIÓN</th>
                <th className="recibo-th recibo-th-val">VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="recibo-tr-main">
                <td className="recibo-td recibo-td-cant">
                  {factura.cantidad || 1}
                </td>
                <td className="recibo-td recibo-td-desc">
                  {factura.descripcion || ""}
                </td>
                <td className="recibo-td recibo-td-val">
                  {factura.valor
                    ? `$${Number(factura.valor).toLocaleString("es-CO")}`
                    : ""}
                </td>
              </tr>
              {/* fila de total */}
              <tr>
                <td
                  colSpan={2}
                  className="recibo-td recibo-td-total-label"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  TOTAL:
                </td>
                <td className="recibo-td recibo-td-total">
                  {factura.valor
                    ? `$${Number(factura.valor).toLocaleString("es-CO")}`
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pie: contacto */}
          <div className="recibo-footer-contacto">
            <div className="recibo-emails">
              <p>
                <strong>Correo electrónico:</strong>
              </p>
              <p>guillermogutierrezvargas@gmail.com</p>
              <p>auragv2005@hotmail.com</p>
            </div>
            <div className="recibo-telefonos">
              <p>
                <strong>Teléfonos:</strong>
              </p>
              <p>cel: 313 25 29 756</p>
              <p>cel: 310 810 77 30</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: categorías + firma + recibido */}
        <div className="recibo-lateral">
          {/* Lista de categorías con checkbox */}
          <div className="recibo-categorias">
            {TODAS_CATEGORIAS.map((cat) => {
              const marcado =
                factura.categorias && factura.categorias.includes(cat);
              return (
                <div
                  key={cat}
                  className={`recibo-cat-fila ${marcado ? "recibo-cat-activa" : ""}`}
                >
                  <span className="recibo-cat-nombre">{cat}</span>
                  <span className="recibo-cat-box">{marcado ? "✓" : ""}</span>
                </div>
              );
            })}
          </div>

          {/* Separador con "No" (valor literal del recibo físico) */}
          <div className="recibo-no-box">
            <span className="recibo-no-text">
              No {factura.numeroFactura || "------"}
            </span>
          </div>

          {/* Firma y sello */}
          <div className="recibo-firma-box">
            <span className="recibo-firma-label">FIRMA Y SELLO</span>
            <div className="recibo-firma-espacio"></div>
          </div>

          {/* Recibido */}
          <div className="recibo-recibido-box">
            <span className="recibo-recibido-label">RECIBIDO:</span>
            <div className="recibo-recibido-fecha">
              {formatearFecha(factura.fechaRecibido)}
            </div>
          </div>
        </div>
      </div>

      {/* ── PIE DE PÁGINA ── */}
      <div className="recibo-direccion">
        Calle 41 A # 31 31 PARQUE INFANTIL &nbsp;–&nbsp; VILLAVICENCIO
        &nbsp;–&nbsp; META
      </div>
    </div>
  );
}

export default VistaPreviaFactura;
