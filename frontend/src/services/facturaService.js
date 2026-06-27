import api from "./api";

export const crearFactura = async (facturaData) => {
  const response = await api.post("/facturas", facturaData);
  return response.data;
};

export const obtenerSiguienteNumeroFactura = async () => {
  const response = await api.get("/facturas/siguiente-numero");
  return response.data;
};

export const obtenerFacturas = async () => {
  const response = await api.get("/facturas");
  return response.data;
};

export const obtenerFacturasInactivas = async () => {
  const response = await api.get("/facturas/inactivas");
  return response.data;
};

export const actualizarFactura = async (id, datos) => {
  const response = await api.put(`/facturas/${id}`, datos);
  return response.data;
};

export const desactivarFactura = async (id) => {
  const response = await api.put(`/facturas/${id}/desactivar`);
  return response.data;
};

export const activarFactura = async (id) => {
  const response = await api.put(`/facturas/${id}/activar`);
  return response.data;
};
