import api from "./api";

export const crearFactura = async (facturaData) => {
  const response = await api.post("/facturas", facturaData);
  return response.data;
};

export const obtenerFacturas = async () => {
  const response = await api.get("/facturas");
  return response.data;
};

export const obtenerFacturasPorCliente = async (idCliente) => {
  const response = await api.get(`/facturas/${idCliente}`);
  return response.data;
};

export const obtenerSiguienteNumeroFactura = async () => {
  const response = await api.get("/facturas/siguiente-numero");
  return response.data;
};
