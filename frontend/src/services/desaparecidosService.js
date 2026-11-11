import api from "./api";

export const listarDesaparecidos = (params) => api.get("/desaparecidos", { params }).then((r) => r.data);
export const listarMeusDesaparecidos = () => api.get("/desaparecidos/meus").then((r) => r.data);
export const obterDesaparecido = (id) => api.get(`/desaparecidos/${id}`).then((r) => r.data);

// "dados" é um FormData (campos + arquivo "foto" opcional)
export const criarDesaparecido = (dados) => api.post("/desaparecidos", dados).then((r) => r.data);
export const atualizarDesaparecido = (id, dados) =>
  api.put(`/desaparecidos/${id}`, dados).then((r) => r.data);
export const encerrarDesaparecido = (id) =>
  api.patch(`/desaparecidos/${id}/encerrar`).then((r) => r.data);
