import React, { useEffect, useState } from "react";
import {
  Search,
  Heart,
  MapPin,
  PawPrint,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Menu } from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { mensagemDeErro, urlArquivo } from "../../services/api";
import { listarDisponiveis, obterAnimal } from "../../services/animalService";
import { manifestarInteresse } from "../../services/adocaoService";
import { listarOngsRecomendadas } from "../../services/ongService";
import "./styles.scss";

const filtrosVazios = {
  busca: "",
  porte: "",
  cidade: "",
  raca: "",
  sexo: "",
};

export default function Adocao() {
  const [itemAtivo, setItemAtivo] = useState("adocao");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [mensagemInteresse, setMensagemInteresse] = useState({ tipo: "", texto: "" });
  const [enviandoInteresse, setEnviandoInteresse] = useState(false);
  const [ongsRegiao, setOngsRegiao] = useState([]);
  const { autenticado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    listarDisponiveis()
      .then(setAnimais)
      .catch((erro) => setErroLista(mensagemDeErro(erro, "Não foi possível carregar os animais.")))
      .finally(() => setCarregando(false));
  }, []);

  // Detalhes vêm da API; ONGs recomendadas consideram a cidade do animal.
  function abrirDetalhes(animal) {
    setPetSelecionado(animal);
    setMensagemInteresse({ tipo: "", texto: "" });
    setOngsRegiao([]);

    obterAnimal(animal.id)
      .then(setPetSelecionado)
      .catch(() => {});
    listarOngsRecomendadas({ cidade: animal.cidade || "" })
      .then(setOngsRegiao)
      .catch(() => setOngsRegiao([]));
  }

  async function tenhoInteresse() {
    if (!autenticado) {
      navigate("/login", { state: { de: "/adocao" } });
      return;
    }

    setEnviandoInteresse(true);
    setMensagemInteresse({ tipo: "", texto: "" });
    try {
      await manifestarInteresse(petSelecionado.id);
      setMensagemInteresse({
        tipo: "sucesso",
        texto: "Interesse enviado! O responsável poderá entrar em contato com você.",
      });
    } catch (erro) {
      setMensagemInteresse({ tipo: "erro", texto: mensagemDeErro(erro) });
    } finally {
      setEnviandoInteresse(false);
    }
  }

  const [busca, setBusca] = useState("");
  const [porte, setPorte] = useState("");
  const [cidade, setCidade] = useState("");
  const [raca, setRaca] = useState("");
  const [sexo, setSexo] = useState("");

  const [filtrosAplicados, setFiltrosAplicados] =
    useState(filtrosVazios);

  function filtrarAnimais(event) {
    event.preventDefault();

    setFiltrosAplicados({
      busca: busca.trim().toLowerCase(),
      porte,
      cidade: cidade.trim().toLowerCase(),
      raca: raca.trim().toLowerCase(),
      sexo,
    });
  }

  function limparFiltros() {
    setBusca("");
    setPorte("");
    setCidade("");
    setRaca("");
    setSexo("");
    setFiltrosAplicados({ ...filtrosVazios });
  }

  const animaisFiltrados = animais.filter((animal) => {
    const correspondeBusca =
      `${animal.nome} ${animal.raca ?? ""} ${animal.cidade ?? ""}`
        .toLowerCase()
        .includes(filtrosAplicados.busca);

    const correspondePorte =
      !filtrosAplicados.porte ||
      animal.porte === filtrosAplicados.porte;

    const correspondeCidade =
      !filtrosAplicados.cidade ||
      String(animal.cidade ?? "").toLowerCase().includes(filtrosAplicados.cidade);

    const correspondeRaca =
      !filtrosAplicados.raca ||
      String(animal.raca ?? "").toLowerCase().includes(filtrosAplicados.raca);

    const correspondeSexo =
      !filtrosAplicados.sexo ||
      animal.sexo === filtrosAplicados.sexo;

    return (
      correspondeBusca &&
      correspondePorte &&
      correspondeCidade &&
      correspondeRaca &&
      correspondeSexo
    );
  });

  return (
    <div className="app-layout adocao-layout">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content adocao-page">
        <div className="adocao-conteudo">
          <form className="adocao-filtros" onSubmit={filtrarAnimais}>
            <div className="adocao-filtros-topo">
              <div className="adocao-titulo">
                <h1>ENCONTRE SEU COMPANHEIRO!</h1>
                <p>Animais disponíveis para adoção</p>
              </div>
            </div>

            <div className="adocao-filtros-campos">
              <div className="adocao-busca">
                <input
                  type="text"
                  placeholder="Buscar animal..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
                <Search size={17} />
              </div>

              <label>
                <span className="sr-only">Porte</span>
                <select
                  value={porte}
                  onChange={(event) => setPorte(event.target.value)}
                >
                  <option value="">Porte</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </label>

              <label>
                <span className="sr-only">Cidade</span>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(event) => setCidade(event.target.value)}
                />
              </label>

              <label>
                <span className="sr-only">Raça</span>
                <input
                  type="text"
                  placeholder="Raça"
                  value={raca}
                  onChange={(event) => setRaca(event.target.value)}
                />
              </label>

              <label>
                <span className="sr-only">Sexo</span>
                <select
                  value={sexo}
                  onChange={(event) => setSexo(event.target.value)}
                >
                  <option value="">Sexo</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </label>
            </div>

            <div className="adocao-acoes-filtro">
              <button
                className="adocao-limpar"
                type="button"
                onClick={limparFiltros}
              >
                <X size={14} />
                Limpar
              </button>

              <button className="adocao-filtrar" type="submit">
                <SlidersHorizontal size={14} />
                Filtrar
              </button>
            </div>
          </form>

          <section className="adocao-listagem">
            <div className="adocao-listagem-titulo">
              <div>
                <PawPrint size={17} />
                <span>Animais disponíveis</span>
              </div>

              <span className="adocao-contagem">
                {animaisFiltrados.length} animais
              </span>
            </div>

            {petSelecionado ? (
              <div className="adocao-detalhe">
                <button
                  className="adocao-voltar"
                  type="button"
                  onClick={() => setPetSelecionado(null)}
                >
                  ← Voltar aos animais
                </button>

                <img
                  src={urlArquivo(petSelecionado.imagem)}
                  alt={petSelecionado.nome}
                />

                <div className="adocao-detalhe-info">
                  <span className="adocao-disponivel">
                    Disponível para adoção
                  </span>

                  <h2>{petSelecionado.nome}</h2>
                  <p>{petSelecionado.raca}</p>

                  <div className="adocao-detalhe-dados">
                    <span>{petSelecionado.idade}</span>
                    <span>{petSelecionado.porte}</span>
                    <span>{petSelecionado.sexo}</span>
                  </div>

                  <p className="adocao-detalhe-cidade">
                    <MapPin size={15} />
                    {petSelecionado.cidade}
                  </p>

                  {petSelecionado.eh_meu ? (
                    <p className="adocao-aviso">
                      Este é um animal seu. Veja os interesses recebidos em Meus Animais.
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="adocao-botao-interesse"
                      onClick={tenhoInteresse}
                      disabled={enviandoInteresse}
                    >
                      <Heart size={16} />
                      {enviandoInteresse ? "Enviando..." : "Tenho interesse em adotar"}
                    </button>
                  )}

                  {mensagemInteresse.texto && (
                    <p
                      role="alert"
                      className={`adocao-feedback ${mensagemInteresse.tipo}`}
                    >
                      {mensagemInteresse.texto}
                    </p>
                  )}

                  <div className="adocao-ongs">
                    <strong>ONGs que atendem esta região</strong>
                    {ongsRegiao.length > 0 ? (
                      <ul>
                        {ongsRegiao.map((ong) => (
                          <li key={ong.id}>
                            {ong.nome} — {ong.telefone || ong.email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nenhuma ONG cadastrada para esta região.</p>
                    )}
                    <Link to="/ongs">Ver todas as ONGs</Link>
                  </div>
                </div>
              </div>
            ) : carregando ? (
              <p className="adocao-vazio-texto">Carregando animais...</p>
            ) : erroLista ? (
              <p className="adocao-feedback erro" role="alert">{erroLista}</p>
            ) : (
              <div className="adocao-grid">
                {animaisFiltrados.map((animal) => (
                  <article className="adocao-card" key={animal.id}>
                    <div className="adocao-card-imagem">
                      <img src={urlArquivo(animal.imagem)} alt={animal.nome} />

                      <button
                        className="adocao-favorito"
                        type="button"
                        aria-label={`Favoritar ${animal.nome}`}
                        onClick={(event) => {
                          event.currentTarget.classList.toggle("favoritado");
                        }}
                      >
                        <Heart size={15} />
                      </button>
                    </div>

                    <div className="adocao-card-info">
                      <div className="adocao-card-nome">
                        <h2>{animal.nome}</h2>
                        <span>{animal.idade}</span>
                      </div>

                      <div className="adocao-card-tags">
                        <span>{animal.porte}</span>
                        <span>•</span>
                        <span>{animal.sexo}</span>
                      </div>

                      <button
                        className="adocao-card-botao"
                        type="button"
                        onClick={() => abrirDetalhes(animal)}
                      >
                        Ver detalhes...
                      </button>
                    </div>
                  </article>
                ))}

                {animaisFiltrados.length === 0 && (
                  <div className="adocao-vazio">
                    <PawPrint size={35} />
                    <h2>Nenhum animal encontrado</h2>
                    <p>Tente alterar os filtros da busca.</p>

                    <button type="button" onClick={limparFiltros}>
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}