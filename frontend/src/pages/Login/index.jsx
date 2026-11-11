import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { mensagemDeErro } from "../../services/api";
import "./styles.scss";

export default function Login() {
  const { autenticado, entrar, cadastrar } = useAuth();
  const navigate = useNavigate();
  const local = useLocation();
  const destino = local.state?.de || "/";

  const [modo, setModo] = useState("entrar");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", telefone: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to={destino} replace />;

  function atualizar(event) {
    setForm((atual) => ({ ...atual, [event.target.name]: event.target.value }));
    setErro("");
  }

  async function enviar(event) {
    event.preventDefault();
    setEnviando(true);
    setErro("");

    try {
      if (modo === "entrar") {
        await entrar({ email: form.email, senha: form.senha });
      } else {
        await cadastrar(form);
      }
      navigate(destino, { replace: true });
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível concluir. Tente novamente."));
    } finally {
      setEnviando(false);
    }
  }

  const cadastro = modo === "cadastro";

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-marca">
          <PawPrint size={28} aria-hidden="true" />
          <h1>PortalPet</h1>
        </div>

        <div className="login-abas" role="tablist">
          <button type="button" role="tab" aria-selected={!cadastro}
            className={!cadastro ? "ativa" : ""} onClick={() => { setModo("entrar"); setErro(""); }}>
            Entrar
          </button>
          <button type="button" role="tab" aria-selected={cadastro}
            className={cadastro ? "ativa" : ""} onClick={() => { setModo("cadastro"); setErro(""); }}>
            Criar conta
          </button>
        </div>

        <form onSubmit={enviar}>
          {cadastro && (
            <label>
              Nome completo
              <input name="nome" value={form.nome} onChange={atualizar} required minLength={2} maxLength={120} />
            </label>
          )}

          <label>
            E-mail
            <input name="email" type="email" value={form.email} onChange={atualizar}
              required autoComplete="email" />
          </label>

          {cadastro && (
            <label>
              Telefone (opcional)
              <input name="telefone" value={form.telefone} onChange={atualizar} maxLength={25} />
            </label>
          )}

          <label>
            Senha
            <input name="senha" type="password" value={form.senha} onChange={atualizar}
              required minLength={cadastro ? 8 : 1} maxLength={72}
              autoComplete={cadastro ? "new-password" : "current-password"} />
            {cadastro && <small>Use pelo menos 8 caracteres.</small>}
          </label>

          {erro && <p className="login-erro" role="alert">{erro}</p>}

          <button className="login-enviar" type="submit" disabled={enviando}>
            {enviando ? "Aguarde..." : cadastro ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <Link className="login-voltar" to="/">Voltar ao início</Link>
      </section>
    </main>
  );
}
