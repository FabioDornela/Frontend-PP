import api from "./api";

export const manifestarInteresse = (animalId, mensagem) =>
  api.post("/adocao/interesses", { animal_id: animalId, mensagem }).then((r) => r.data);
export const listarMeusInteresses = () => api.get("/adocao/meus-interesses").then((r) => r.data);
export const listarInteressesDoAnimal = (animalId) =>
  api.get(`/adocao/animais/${animalId}/interesses`).then((r) => r.data);
export const atualizarStatusInteresse = (id, status) =>
  api.patch(`/adocao/interesses/${id}/status`, { status }).then((r) => r.data);
