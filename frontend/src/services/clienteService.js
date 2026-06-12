import api from "./api";

export const obtenerClientes = async () => {
  const response = await api.get("/clientes");

  return response.data;
};

export const buscarClientes = async (texto) => {
  const response = await api.get(`/clientes/buscar?texto=${texto}`);

  return response.data;
};


export const crearCliente = async (clienteData) => {
  const response = await api.post("/clientes", clienteData);

  return response.data;
};

export const actualizarCliente = async (id, clienteData) => {
  const response = await api.put(`/clientes/${id}`, clienteData);

  return response.data;
};

export const desactivarCliente = async (id) => {
  const response = await api.put(`/clientes/${id}`, { estado: false });

  return response.data;
};
export const buscarClienteFactura = async (texto) => {
  const response = await api.get(`/clientes/buscar?texto=${texto}`);

  return response.data;
};
