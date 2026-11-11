import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Search, SlidersHorizontal, Plus, X } from "lucide-react";
import { Menu } from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { mensagemDeErro, urlArquivo } from "../../services/api";
import {
  atualizarDesaparecido,
  criarDesaparecido,
  encerrarDesaparecido,
  listarDesaparecidos,
  listarMeusDesaparecidos,
} from "../../services/desaparecidosService";
import "./styles.scss";

const formularioInicial = {
  tipo_ocorrencia: "Desaparecido",
  nome: "",
  raca: "",
  sexo: "",
  porte: "",
  idade: "",
  cidade: "",
  bairro: "",
  data_ocorrencia: "",
  contato: "",
  descricao: "",
};

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function CardAnimal({ animal, onEditar, onEncerrar }) {
  const encerrado = animal.status !== "Ativo";

  return (
    <article className="desaparecidos-card">
      <div className="desaparecidos-moldura">
        <img className="desaparecidos-foto" src={urlArquivo(animal.foto)} alt={animal.nome} />
        <span className="desaparecidos-selo">
          {encerrado ? "Encerrado" : animal.tipo_ocorrencia}
        </span>
      </div>
      <div className="desaparecidos-info">
        <div className="desaparecidos-titulo-card">
          <h2>{animal.nome}</h2>
          <span>{animal.idade}</span>
        </div>
        <p className="desaparecidos-local">
          {[animal.porte, animal.cidade].filter(Boolean).join(" · ")}
        </p>
        {animal.data_ocorrencia && (
          <p className="desaparecidos-detalhe">
            {animal.tipo_ocorrencia} em {formatarData(animal.data_ocorrencia)}
            {animal.bairro ? ` · ${animal.bairro}` : ""}
          </p>
        )}
        {animal.descricao && <p className="desaparecidos-detalhe">{animal.descricao}</p>}
        {animal.contato && (
          <p className="desaparecidos-detalhe">
            <strong>Contato:</strong> {animal.contato}
          </p>
        )}

        {animal.eh_meu && !encerrado && (
          <div className="desaparecidos-acoes-card">
            <button type="button" onClick={() => onEditar(animal)}>Editar</button>
            <button type="button" onClick={() => onEncerrar(animal)}>Encerrar</button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Desaparecidos() {
  const [itemAtivo, setItemAtivo] = useState("desaparecidos");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const { autenticado } = useAuth();
  const navigate = useNavigate();

  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [visao, setVisao] = useState("todos");

  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("");
  const [raca, setRaca] = useState("");
  const [sexo, setSexo] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    busca: "",
    cidade: "",
    raca: "",
    sexo: "",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState("");
  const [removerFoto, setRemoverFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroLista("");
    try {
      const dados =
        visao === "meus" ? await listarMeusDesaparecidos() : await listarDesaparecidos();
      setAnimais(dados);
    } catch (erro) {
      setErroLista(mensagemDeErro(erro, "Não foi possível carregar as ocorrências."));
    } finally {
      setCarregando(false);
    }
  }, [visao]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function filtrarAnimais(event) {
    event.preventDefault();
    setFiltrosAplicados({
      busca: busca.trim().toLowerCase(),
      cidade: cidade.trim().toLowerCase(),
      raca: raca.trim().toLowerCase(),
      sexo,
    });
  }

  const animaisFiltrados = animais.filter((animal) => {
    const correspondeBusca = `${animal.nome} ${animal.raca ?? ""} ${animal.cidade ?? ""}`
      .toLowerCase()
      .includes(filtrosAplicados.busca);
    const correspondeCidade = String(animal.cidade ?? "")
      .toLowerCase()
      .includes(filtrosAplicados.cidade);
    const correspondeRaca = String(animal.raca ?? "")
      .toLowerCase()
      .includes(filtrosAplicados.raca);
    const correspondeSexo = !filtrosAplicados.sexo || animal.sexo === filtrosAplicados.sexo;

    return correspondeBusca && correspondeCidade && correspondeRaca && correspondeSexo;
  });

  function exigirLogin() {
    if (autenticado) return true;
    navigate("/login", { state: { de: "/desaparecidos" } });
    return false;
  }

  function abrirCadastro() {
    if (!exigirLogin()) return;
    setFormulario({ ...formularioInicial });
    setEditandoId(null);
    setArquivoFoto(null);
    setFotoAtual("");
    setRemoverFoto(false);
    setErroForm("");
    setMostrarFormulario(true);
  }

  function abrirEdicao(animal) {
    setFormulario({
      tipo_ocorrencia: animal.tipo_ocorrencia,
      nome: animal.nome || "",
      raca: animal.raca || "",
      sexo: animal.sexo || "",
      porte: animal.porte || "",
      idade: animal.idade || "",
      cidade: animal.cidade || "",
      bairro: animal.bairro || "",
      data_ocorrencia: animal.data_ocorrencia || "",
      contato: animal.contato || "",
      descricao: animal.descricao || "",
    });
    setEditandoId(animal.id);
    setArquivoFoto(null);
    setFotoAtual(animal.foto ? urlArquivo(animal.foto) : "");
    setRemoverFoto(false);
    setErroForm("");
    setMostrarFormulario(true);
  }

  function fecharFormulario() {
    setMostrarFormulario(false);
    setEditandoId(null);
  }

  function atualizarCampo(event) {
    setFormulario((anterior) => ({ ...anterior, [event.target.name]: event.target.value }));
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/") || arquivo.size > 5 * 1024 * 1024) {
      setErroForm("Escolha uma imagem de até 5 MB.");
      event.target.value = "";
      return;
    }

    setErroForm("");
    setArquivoFoto(arquivo);
    setRemoverFoto(false);
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErroForm("");

    const dados = new FormData();
    Object.entries(formulario).forEach(([campo, valor]) => dados.append(campo, valor));
    if (arquivoFoto) dados.append("foto", arquivoFoto);
    else if (removerFoto) dados.append("remover_foto", "true");

    try {
      if (editandoId !== null) await atualizarDesaparecido(editandoId, dados);
      else await criarDesaparecido(dados);

      fecharFormulario();
      await carregar();
    } catch (erro) {
      setErroForm(mensagemDeErro(erro, "Não foi possível salvar a ocorrência."));
    } finally {
      setSalvando(false);
    }
  }

  async function encerrar(animal) {
    if (!window.confirm(`Encerrar a ocorrência de ${animal.nome}?`)) return;

    try {
      await encerrarDesaparecido(animal.id);
      await carregar();
    } catch (erro) {
      setErroLista(mensagemDeErro(erro, "Não foi possível encerrar a ocorrência."));
    }
  }

  const previaArquivo = useMemo(
    () => (arquivoFoto ? URL.createObjectURL(arquivoFoto) : ""),
    [arquivoFoto]
  );
  const previaFoto = previaArquivo || (removerFoto ? "" : fotoAtual);

  return (
    <div className="app-layout desaparecidos-layout">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content desaparecidos-page">
        <div className="desaparecidos-conteudo">
          <form className="desaparecidos-filtros" onSubmit={filtrarAnimais}>
            <div className="desaparecidos-filtros-topo">
              <div className="desaparecidos-cabecalho">
                <h1>ANIMAIS DESAPARECIDOS</h1>
                <p>Ajude um pet a voltar para casa.</p>
              </div>
            </div>

            <div className="desaparecidos-campos">
              <div className="desaparecidos-busca">
                <input
                  type="search"
                  placeholder="Buscar animal..."
                  aria-label="Buscar animal"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
                <Search size={17} aria-hidden="true" />
              </div>

              <label>
                <span className="desaparecidos-sr-only">Cidade</span>
                <input
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(event) => setCidade(event.target.value)}
                />
              </label>

              <label>
                <span className="desaparecidos-sr-only">Raça</span>
                <input
                  type="text"
                  placeholder="Raça"
                  value={raca}
                  onChange={(event) => setRaca(event.target.value)}
                />
              </label>

              <label>
                <span className="desaparecidos-sr-only">Sexo</span>
                <select value={sexo} onChange={(event) => setSexo(event.target.value)}>
                  <option value="">Sexo</option>
                  <option value="Fêmea">Fêmea</option>
                  <option value="Macho">Macho</option>
                </select>
              </label>

              <div className="desaparecidos-acoes-filtro">
                <button type="submit">
                  <SlidersHorizontal size={14} aria-hidden="true" />
                  Filtrar
                </button>
              </div>
            </div>
          </form>

          <div className="desaparecidos-barra">
            <button type="button" className="desaparecidos-registrar" onClick={abrirCadastro}>
              <Plus size={15} aria-hidden="true" />
              Registrar ocorrência
            </button>

            {autenticado && (
              <button
                type="button"
                className="desaparecidos-alternar"
                onClick={() => setVisao(visao === "meus" ? "todos" : "meus")}
              >
                {visao === "meus" ? "Ver todas as ocorrências" : "Minhas ocorrências"}
              </button>
            )}
          </div>

          {mostrarFormulario ? (
            <section className="desaparecidos-formulario">
              <header>
                <h2>{editandoId !== null ? "Editar ocorrência" : "Registrar ocorrência"}</h2>
                <button type="button" onClick={fecharFormulario} aria-label="Fechar formulário">
                  <X size={18} />
                </button>
              </header>

              <form onSubmit={salvar}>
                <div className="desaparecidos-grade-form">
                  <label>
                    Tipo *
                    <select name="tipo_ocorrencia" value={formulario.tipo_ocorrencia} onChange={atualizarCampo}>
                      <option value="Desaparecido">Desaparecido</option>
                      <option value="Encontrado">Encontrado</option>
                    </select>
                  </label>
                  <label>
                    Nome do animal *
                    <input name="nome" value={formulario.nome} onChange={atualizarCampo} required maxLength={80} />
                  </label>
                  <label>
                    Raça
                    <input name="raca" value={formulario.raca} onChange={atualizarCampo} maxLength={80} />
                  </label>
                  <label>
                    Sexo
                    <select name="sexo" value={formulario.sexo} onChange={atualizarCampo}>
                      <option value="">Não informado</option>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </label>
                  <label>
                    Porte
                    <select name="porte" value={formulario.porte} onChange={atualizarCampo}>
                      <option value="">Não informado</option>
                      <option value="Pequeno">Pequeno</option>
                      <option value="Médio">Médio</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </label>
                  <label>
                    Idade
                    <input name="idade" value={formulario.idade} onChange={atualizarCampo} maxLength={30} />
                  </label>
                  <label>
                    Cidade *
                    <input name="cidade" value={formulario.cidade} onChange={atualizarCampo} required maxLength={100} />
                  </label>
                  <label>
                    Bairro
                    <input name="bairro" value={formulario.bairro} onChange={atualizarCampo} maxLength={100} />
                  </label>
                  <label>
                    Data da ocorrência *
                    <input
                      type="date"
                      name="data_ocorrencia"
                      value={formulario.data_ocorrencia}
                      onChange={atualizarCampo}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                    />
                  </label>
                  <label>
                    Contato (telefone ou e-mail) *
                    <input name="contato" value={formulario.contato} onChange={atualizarCampo} required maxLength={120} />
                  </label>
                </div>

                <label className="desaparecidos-campo-largo">
                  Descrição
                  <textarea name="descricao" rows={3} value={formulario.descricao} onChange={atualizarCampo} maxLength={2000} />
                </label>

                <div className="desaparecidos-foto-form">
                  <label>
                    Foto (JPG, PNG, WEBP ou GIF, até 5 MB)
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={selecionarFoto} />
                  </label>
                  {previaFoto && (
                    <div>
                      <img src={previaFoto} alt="Prévia" />
                      <button
                        type="button"
                        onClick={() => {
                          setArquivoFoto(null);
                          setRemoverFoto(true);
                        }}
                      >
                        Remover foto
                      </button>
                    </div>
                  )}
                </div>

                {erroForm && <p className="desaparecidos-erro" role="alert">{erroForm}</p>}

                <div className="desaparecidos-botoes-form">
                  <button type="button" onClick={fecharFormulario}>Cancelar</button>
                  <button type="submit" disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <section className="desaparecidos-listagem">
              <div className="desaparecidos-listagem-titulo">
                <div>
                  <PawPrint size={17} aria-hidden="true" />
                  <h2>{visao === "meus" ? "Minhas ocorrências" : "Pets para localizar"}</h2>
                </div>
                <span>{animaisFiltrados.length} animais</span>
              </div>

              {carregando ? (
                <p className="desaparecidos-vazio">Carregando ocorrências...</p>
              ) : erroLista ? (
                <p className="desaparecidos-erro" role="alert">{erroLista}</p>
              ) : animaisFiltrados.length > 0 ? (
                <div className="desaparecidos-grid">
                  {animaisFiltrados.map((animal) => (
                    <CardAnimal
                      key={animal.id}
                      animal={animal}
                      onEditar={abrirEdicao}
                      onEncerrar={encerrar}
                    />
                  ))}
                </div>
              ) : (
                <p className="desaparecidos-vazio">
                  {animais.length === 0
                    ? "Nenhuma ocorrência registrada até agora."
                    : "Nenhum animal encontrado com esses filtros."}
                </p>
              )}
            </section>
          )}

          <aside className="desaparecidos-dica">
            <h2>Dica do dia</h2>
            <p>Mantenha os dados de contato e as fotos do seu pet sempre atualizados.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
