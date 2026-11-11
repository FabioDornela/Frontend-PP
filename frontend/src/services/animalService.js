import api from "./api";

export const listarDisponiveis = (params) => api.get("/animais", { params }).then((r) => r.data);
export const listarMeusAnimais = () => api.get("/animais/meus").then((r) => r.data);
export const obterAnimal = (id) => api.get(`/animais/${id}`).then((r) => r.data);

// "dados" é um FormData (campos + arquivo "foto" opcional)
export const criarAnimal = (dados) => api.post("/animais", dados).then((r) => r.data);
export const atualizarAnimal = (id, dados) => api.put(`/animais/${id}`, dados).then((r) => r.data);
export const excluirAnimal = (id) => api.delete(`/animais/${id}`);
export const atualizarStatusAnimal = (id, status) =>
  api.patch(`/animais/${id}/status`, { status }).then((r) => r.data);
