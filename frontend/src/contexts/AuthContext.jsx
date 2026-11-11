import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tokenArmazenado } from "../services/api";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(tokenArmazenado.ler()));

  const sair = useCallback(() => {
    tokenArmazenado.remover();
    setUsuario(null);
  }, []);

  // Ao abrir o site, valida o token salvo e recupera o usuário.
  useEffect(() => {
    if (!tokenArmazenado.ler()) return;

    authService
      .buscarUsuarioLogado()
      .then(setUsuario)
      .catch(() => tokenArmazenado.remover())
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    window.addEventListener("portalpet:sessao-expirada", sair);
    return () => window.removeEventListener("portalpet:sessao-expirada", sair);
  }, [sair]);

  const registrarSessao = useCallback(({ token, usuario: dados }) => {
    tokenArmazenado.salvar(token);
    setUsuario(dados);
  }, []);

  const entrar = useCallback(
    async (credenciais) => registrarSessao(await authService.entrar(credenciais)),
    [registrarSessao]
  );

  const cadastrar = useCallback(
    async (dados) => registrarSessao(await authService.cadastrar(dados)),
    [registrarSessao]
  );

  const valor = useMemo(
    () => ({ usuario, carregando, autenticado: Boolean(usuario), entrar, cadastrar, sair, setUsuario }),
    [usuario, carregando, entrar, cadastrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return contexto;
}
