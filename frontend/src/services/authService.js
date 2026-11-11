import api from "./api";

export const cadastrar = (dados) => api.post("/auth/cadastro", dados).then((r) => r.data);
export const entrar = (dados) => api.post("/auth/login", dados).then((r) => r.data);
export const buscarUsuarioLogado = () => api.get("/auth/me").then((r) => r.data);
