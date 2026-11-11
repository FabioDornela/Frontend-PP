import api from "./api";

export const obterPerfil = () => api.get("/usuarios/perfil").then((r) => r.data);
export const atualizarPerfil = (dados) => api.put("/usuarios/perfil", dados).then((r) => r.data);
