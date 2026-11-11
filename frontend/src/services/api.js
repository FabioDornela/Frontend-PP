import axios from "axios";

const URL_API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const CHAVE_TOKEN = "portalpet_token";

export const tokenArmazenado = {
  ler: () => localStorage.getItem(CHAVE_TOKEN),
  salvar: (token) => localStorage.setItem(CHAVE_TOKEN, token),
  remover: () => localStorage.removeItem(CHAVE_TOKEN),
};

const api = axios.create({
  baseURL: URL_API,
  timeout: 10000,
});

// Envia o token em toda requisição, quando existir.
api.interceptors.request.use((config) => {
  const token = tokenArmazenado.ler();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Sessão expirada ou inválida: limpa o token e avisa a aplicação.
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const rotaDeAcesso = String(erro.config?.url || "").startsWith("/auth/login");
    if (erro.response?.status === 401 && tokenArmazenado.ler() && !rotaDeAcesso) {
      tokenArmazenado.remover();
      window.dispatchEvent(new Event("portalpet:sessao-expirada"));
    }
    return Promise.reject(erro);
  }
);

// Origem do servidor (sem /api), usada para montar o endereço das fotos enviadas.
const ORIGEM_API = URL_API.replace(/\/api\/?$/, "");

const IMAGEM_PADRAO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">' +
      '<rect width="600" height="450" fill="#e5e8ec"/>' +
      '<g fill="#9aa7ae"><ellipse cx="300" cy="260" rx="70" ry="55"/>' +
      '<ellipse cx="215" cy="190" rx="26" ry="34"/><ellipse cx="270" cy="150" rx="26" ry="34"/>' +
      '<ellipse cx="330" cy="150" rx="26" ry="34"/><ellipse cx="385" cy="190" rx="26" ry="34"/></g></svg>'
  );

// Converte o caminho guardado no banco em URL completa. Sem foto, devolve uma imagem padrão.
export function urlArquivo(caminho) {
  if (!caminho) return IMAGEM_PADRAO;
  if (/^(https?:|data:|blob:)/.test(caminho)) return caminho;
  return `${ORIGEM_API}${caminho}`;
}

// Extrai uma mensagem amigável de erros da API.
export function mensagemDeErro(erro, padrao = "Algo deu errado. Tente novamente.") {
  if (erro.response?.data?.detalhes) {
    const primeira = Object.values(erro.response.data.detalhes)[0];
    if (primeira) return primeira;
  }
  if (erro.response?.data?.erro) return erro.response.data.erro;
  if (erro.code === "ERR_NETWORK" || erro.code === "ECONNABORTED") {
    return "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
  }
  return padrao;
}

export default api;
