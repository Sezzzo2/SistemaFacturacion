import api from "./api";

export const login = async (usuario, contrasena) => {
  const response = await api.post(
    "/auth/login",

    {
      usuario,

      contrasena,
    },
  );

  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await api.get("/auth/perfil");

  return response.data;
};
