const normalizarIdentificacion = (identificacion) => {
  const valor = `${identificacion ?? ""}`.trim();

  if (!valor) {
    return `SIN_IDENTIFICACION_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  const valorNormalizado = valor.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const placeholders = [
    "-",
    "--",
    "—",
    "n/a",
    "na",
    "sin identificacion",
    "sin identificación",
    "sin documento",
    "s/d",
    "sd",
    "sin id",
    "sinidentificacion",
  ];

  if (placeholders.includes(valorNormalizado) || /^[\s.-]+$/.test(valor)) {
    return `SIN_IDENTIFICACION_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  return valor;
};

module.exports = {
  normalizarIdentificacion,
};
