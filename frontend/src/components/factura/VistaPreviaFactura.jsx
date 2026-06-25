import "../../assets/css/factura.css";

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
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const nombreCompleto = [factura.nombre, factura.apellido]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="recibo-wrapper">
      {/* ── CABECERA ── */}
      <div className="recibo-header">
        {/* Columna izquierda: logo + datos empresa */}
        <div className="recibo-header-left">
          <img src="/logo.png" alt="Logo" className="recibo-logo" />
          <div className="recibo-empresa-info">
            <p className="recibo-nit">NIT: 17.336.537-8</p>
            <p className="recibo-regimen">RÉGIMEN SIMPLIFICADO</p>
          </div>
        </div>

        {/* Columna central: imagen periódicos (decorativa) */}
        <div className="recibo-header-center">
          <img
            src="/periodicos.png"
            alt="Periódicos"
            className="recibo-periodicos"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Columna derecha: QR / número factura */}
        <div className="recibo-header-right">
          <p className="recibo-factura-num">
            No. <strong>{factura.numeroFactura || "------"}</strong>
          </p>
        </div>
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
                ></td>
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
