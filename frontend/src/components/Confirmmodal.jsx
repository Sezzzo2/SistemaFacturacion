import "../assets/css/confirmmodal.css";

function ConfirmModal({ mostrar, titulo, mensaje, labelConfirmar = "Confirmar", variante = "danger", onConfirmar, onCancelar }) {
  if (!mostrar) return null;

  const colores = {
    danger:  { icono: "bi-exclamation-triangle-fill", iconoColor: "#e03131", btnClass: "confirm-btn-danger" },
    warning: { icono: "bi-exclamation-circle-fill",   iconoColor: "#f59e0b", btnClass: "confirm-btn-warning" },
    success: { icono: "bi-check-circle-fill",          iconoColor: "#16a34a", btnClass: "confirm-btn-success" },
  };

  const { icono, iconoColor, btnClass } = colores[variante] || colores.danger;

  return (
    <div className="confirm-overlay" onClick={onCancelar}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Ícono */}
        <div className="confirm-icono">
          <i className={`bi ${icono}`} style={{ color: iconoColor, fontSize: 32 }}></i>
        </div>

        {/* Texto */}
        <h5 className="confirm-titulo">{titulo}</h5>
        {mensaje && <p className="confirm-mensaje">{mensaje}</p>}

        {/* Botones */}
        <div className="confirm-botones">
          <button className="confirm-btn confirm-btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className={`confirm-btn ${btnClass}`} onClick={onConfirmar}>
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;