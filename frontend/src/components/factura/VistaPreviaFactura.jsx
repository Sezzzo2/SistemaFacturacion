import "../../assets/css/factura.css";

function VistaPreviaFactura({ factura }) {
  const formatearFecha = (fecha) => {
    if (!fecha) return "---";
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="preview-card shadow">
      {/* Encabezado */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <img src="/logo.png" alt="Logo" className="logo-preview" />
        </div>

        <div className="text-end">
          <h2 className="titulo-factura">DIARIO LA REPÚBLICA</h2>

          <small>
            Factura No.
            <strong>{factura.numeroFactura || "------"}</strong>
          </small>
        </div>
      </div>

      <hr />

      {/* Datos del cliente */}

      <div className="mb-3">
        <h5 className="text-danger">Datos del Cliente</h5>

        <table className="table table-bordered">
          <tbody>
            <tr>
              <th width="30%">Nombre</th>

              <td>
                {factura.nombre} {factura.apellido}
              </td>
            </tr>

            <tr>
              <th>Identificación</th>

              <td>{factura.identificacion}</td>
            </tr>

            <tr>
              <th>Teléfono</th>

              <td>{factura.telefono}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Datos del aviso */}

      <div className="mb-3">
        <h5 className="text-danger">Información del Aviso</h5>

        <table className="table table-bordered">
          <tbody>
            <tr>
              <th width="30%">Título</th>

              <td>{factura.tituloAviso}</td>
            </tr>

            <tr>
              <th>Fecha de publicación</th>

              <td>{formatearFecha(factura.fechaPublicacion)}</td>
            </tr>

            <tr>
              <th>Fecha del recibido</th>

              <td>{formatearFecha(factura.fechaRecibido)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabla */}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th width="10%">Cant.</th>

            <th>Descripción</th>

            <th width="20%">Valor</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="text-center">{factura.cantidad || 1}</td>

            <td>{factura.descripcion}</td>

            <td>${Number(factura.valor || 0).toLocaleString("es-CO")}</td>
          </tr>
        </tbody>
      </table>

      {/* Categorías */}

      <div className="mt-4">
        <h5 className="text-danger">Categorías Seleccionadas</h5>

        {factura.categorias && factura.categorias.length > 0 ? (
          <div className="categorias-preview">
            {factura.categorias.map((categoria) => (
              <span key={categoria} className="categoria-badge">
                ✓ {categoria}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            <em>No hay categorías seleccionadas</em>
          </p>
        )}
      </div>

      {/* Total */}

      <div className="mt-5 text-end">
        <h2 className="text-danger">TOTAL</h2>

        <h1>${Number(factura.valor || 0).toLocaleString("es-CO")}</h1>
      </div>
    </div>
  );
}

export default VistaPreviaFactura;
