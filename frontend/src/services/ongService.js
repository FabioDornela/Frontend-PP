import api from "./api";

export const listarOngs = (params) => api.get("/ongs", { params }).then((r) => r.data);
export const obterOng = (id) => api.get(`/ongs/${id}`).then((r) => r.data);
export const listarOngsRecomendadas = (params) =>
  api.get("/ongs/recomendadas", { params }).then((r) => r.data);
