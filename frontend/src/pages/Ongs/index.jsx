import { useCallback, useEffect, useState } from "react";
import { Building2, Search, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Menu } from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { mensagemDeErro } from "../../services/api";
import { listarOngs, listarOngsRecomendadas } from "../../services/ongService";
import "./styles.scss";

function CartaoOng({ ong }) {
  return (
    <article className="ongs-card">
      <div className="ongs-card-topo">
        <Building2 size={22} aria-hidden="true" />
        <h2>{ong.nome}</h2>
      </div>

      {ong.eh_demonstracao && (
        <span className="ongs-selo-demo">Dados de demonstração</span>
      )}

      {ong.descricao && <p className="ongs-descricao">{ong.descricao}</p>}

      <ul className="ongs-contatos">
        {(ong.endereco || ong.cidade) && (
          <li>
            <MapPin size={14} aria-hidden="true" />
            {[ong.endereco, [ong.cidade, ong.estado].filter(Boolean).join("/")]
              .filter(Boolean)
              .join(" — ")}
          </li>
        )}
        {ong.telefone && (
          <li>
            <Phone size={14} aria-hidden="true" />
            {ong.telefone}
          </li>
        )}
        {ong.email && (
          <li>
            <Mail size={14} aria-hidden="true" />
            {ong.email}
          </li>
        )}
        {ong.site && (
          <li>
            <Globe size={14} aria-hidden="true" />
            {ong.site}
          </li>
        )}
      </ul>

      {ong.informacoes_atendimento && (
        <p className="ongs-descricao">{ong.informacoes_atendimento}</p>
      )}

      {ong.regioes.length > 0 && (
        <div className="ongs-regioes">
          <strong>Regiões atendidas</strong>
          <ul>
            {ong.regioes.map((regiao) => (
              <li key={`${ong.id}-${regiao.cidade_atendida}`}>
                <b>{regiao.cidade_atendida}:</b> {regiao.regiao_atendida}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function Ongs() {
  const [itemAtivo, setItemAtivo] = useState("ongs");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const { usuario } = useAuth();
  const [ongs, setOngs] = useState([]);
  const [recomendadas, setRecomendadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [cidade, setCidade] = useState("");

  // Lista completa (ou filtrada pela cidade digitada)
  const carregar = useCallback((cidadeBusca) => {
    setCarregando(true);
    setErro("");
    listarOngs(cidadeBusca ? { cidade: cidadeBusca } : undefined)
      .then(setOngs)
      .catch((e) => setErro(mensagemDeErro(e, "Não foi possível carregar as ONGs.")))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar("");
  }, [carregar]);

  // Recomendações pela cidade/estado do perfil do usuário logado
  useEffect(() => {
    if (!usuario?.cidade && !usuario?.estado) {
      setRecomendadas([]);
      return;
    }
    listarOngsRecomendadas({ cidade: usuario.cidade || "", estado: usuario.estado || "" })
      .then(setRecomendadas)
      .catch(() => setRecomendadas([]));
  }, [usuario?.cidade, usuario?.estado]);

  function filtrar(event) {
    event.preventDefault();
    carregar(cidade.trim());
  }

  return (
    <div className="app-layout ongs-layout">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content ongs-page">
        <div className="ongs-conteudo">
          <form className="ongs-filtros" onSubmit={filtrar}>
            <h1>ONGs PARCEIRAS</h1>
            <p>Encontre organizações de proteção animal perto de você.</p>
            <div className="ongs-busca">
              <input
                type="search"
                placeholder="Buscar por cidade atendida..."
                aria-label="Buscar ONG por cidade"
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
              />
              <button type="submit">
                <Search size={15} aria-hidden="true" />
                Buscar
              </button>
            </div>
          </form>

          {recomendadas.length > 0 && (
            <section>
              <h2 className="ongs-subtitulo">Recomendadas para a sua região</h2>
              <div className="ongs-grid">
                {recomendadas.map((ong) => (
                  <CartaoOng key={`rec-${ong.id}`} ong={ong} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="ongs-subtitulo">Todas as ONGs</h2>

            {carregando ? (
              <p className="ongs-vazio">Carregando ONGs...</p>
            ) : erro ? (
              <p className="ongs-vazio" role="alert">{erro}</p>
            ) : ongs.length > 0 ? (
              <div className="ongs-grid">
                {ongs.map((ong) => (
                  <CartaoOng key={ong.id} ong={ong} />
                ))}
              </div>
            ) : (
              <p className="ongs-vazio">
                {cidade.trim()
                  ? "Nenhuma ONG encontrada para essa cidade."
                  : "Ainda não há ONGs cadastradas."}
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
