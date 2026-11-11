import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import { Menu } from "../../components/Sidebar";
import { mensagemDeErro, urlArquivo } from "../../services/api";
import {
  atualizarAnimal,
  atualizarStatusAnimal,
  criarAnimal,
  excluirAnimal as excluirAnimalApi,
  listarMeusAnimais,
} from "../../services/animalService";
import {
  atualizarStatusInteresse,
  listarInteressesDoAnimal,
} from "../../services/adocaoService";
import "./styles.scss";

const formularioInicial = {
  nome: "",
  idade: "",
  raca: "",
  sexo: "Macho",
  peso: "",
  porte: "Médio",
  cidade: "",
  status: "Comigo",
  descricao: "",
  imagem: "",
};

export default function MeusAnimais() {
  const [itemAtivo, setItemAtivo] = useState("meus-animais");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [removerFoto, setRemoverFoto] = useState(false);
  const [interesses, setInteresses] = useState([]);
  const [erroInteresses, setErroInteresses] = useState("");

  useEffect(() => {
    listarMeusAnimais()
      .then(setAnimais)
      .catch((erro) =>
        setErroApi(mensagemDeErro(erro, "Não foi possível carregar seus animais."))
      )
      .finally(() => setCarregando(false));
  }, []);

  // Interesses de adoção recebidos pelo animal aberto nos detalhes.
  useEffect(() => {
    setInteresses([]);
    setErroInteresses("");
    if (!petSelecionado) return;

    listarInteressesDoAnimal(petSelecionado.id)
      .then(setInteresses)
      .catch((erro) =>
        setErroInteresses(mensagemDeErro(erro, "Não foi possível carregar os interesses."))
      );
  }, [petSelecionado?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  function abrirCadastro() {
    setArquivoFoto(null);
    setRemoverFoto(false);
    setFormulario({ ...formularioInicial });
    setEditandoId(null);
    setPetSelecionado(null);
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setArquivoFoto(null);
    setRemoverFoto(false);
    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario({ ...formularioInicial });
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    setArquivoFoto(arquivo);
    setRemoverFoto(false);

    const leitor = new FileReader();

    leitor.onload = () => {
      setFormulario((anterior) => ({
        ...anterior,
        imagem: leitor.result,
      }));
    };

    leitor.readAsDataURL(arquivo);
  }

  async function salvarAnimal(event) {
    event.preventDefault();
    setErroApi("");
    setSalvando(true);

    // Multipart: campos de texto + foto (arquivo) opcional.
    const dados = new FormData();
    dados.append("nome", formulario.nome.trim());
    dados.append("idade", formulario.idade.trim());
    dados.append("raca", formulario.raca.trim());
    dados.append("sexo", formulario.sexo);
    dados.append("porte", formulario.porte);
    dados.append("cidade", formulario.cidade.trim());
    dados.append("status", formulario.status);
    dados.append("descricao", formulario.descricao.trim());
    if (formulario.peso.trim()) dados.append("peso", `${formulario.peso.trim()} kg`);
    if (arquivoFoto) dados.append("foto", arquivoFoto);
    else if (removerFoto) dados.append("remover_foto", "true");

    try {
      const animalFinal =
        editandoId !== null
          ? await atualizarAnimal(editandoId, dados)
          : await criarAnimal(dados);

      if (editandoId !== null) {
        setAnimais((anteriores) =>
          anteriores.map((animal) => (animal.id === editandoId ? animalFinal : animal))
        );
      } else {
        setAnimais((anteriores) => [animalFinal, ...anteriores]);
      }

      setMostrarFormulario(false);
      setEditandoId(null);
      setArquivoFoto(null);
      setRemoverFoto(false);
      setFormulario({ ...formularioInicial });
      setPetSelecionado(null);
    } catch (erro) {
      setErroApi(mensagemDeErro(erro, "Não foi possível salvar o animal."));
    } finally {
      setSalvando(false);
    }
  }

  function abrirEdicao(animal) {
    setFormulario({
      nome: animal.nome || "",
      idade: animal.idade || "",
      raca: animal.raca || "",
      sexo: animal.sexo || "Macho",
      peso: String(animal.peso || "").replace(/\s*kg$/i, ""),
      porte: animal.porte || "Médio",
      cidade: animal.cidade || "",
      status: animal.status || "Comigo",
      descricao: animal.descricao || "",
      imagem: animal.imagem ? urlArquivo(animal.imagem) : "",
    });
    setArquivoFoto(null);
    setRemoverFoto(false);
    setErroApi("");
    setEditandoId(animal.id);
    setPetSelecionado(null);
    setMostrarFormulario(true);
  }

  async function excluirAnimal(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este animal?"
    );

    if (!confirmar) return;

    setErroApi("");
    try {
      await excluirAnimalApi(id);
      setAnimais((anteriores) => anteriores.filter((animal) => animal.id !== id));
      if (petSelecionado?.id === id) setPetSelecionado(null);
    } catch (erro) {
      setErroApi(mensagemDeErro(erro, "Não foi possível excluir o animal."));
    }
  }

  async function alterarSituacao(status) {
    setErroApi("");
    try {
      const atualizado = await atualizarStatusAnimal(petSelecionado.id, status);
      setPetSelecionado(atualizado);
      setAnimais((anteriores) =>
        anteriores.map((animal) => (animal.id === atualizado.id ? atualizado : animal))
      );
    } catch (erro) {
      setErroApi(mensagemDeErro(erro, "Não foi possível alterar a situação."));
    }
  }

  async function responderInteresse(id, status) {
    setErroInteresses("");
    try {
      const atualizado = await atualizarStatusInteresse(id, status);
      setInteresses((anteriores) =>
        anteriores.map((item) =>
          item.id === id ? { ...item, status: atualizado.status } : item
        )
      );
    } catch (erro) {
      setErroInteresses(mensagemDeErro(erro, "Não foi possível atualizar o interesse."));
    }
  }

  return (
    <div className="pagina-animais">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content conteudo-animais">
        {erroApi && (
          <p role="alert" className="erro-api">
            {erroApi}
          </p>
        )}
        {mostrarFormulario ? (
          <section className="formulario-animal">
            <button
              type="button"
              className="voltar-detalhes"
              onClick={cancelarFormulario}
            >
              <ArrowLeft size={18} />
              Voltar para meus animais
            </button>

            <header className="cabecalho-formulario">
              <div>
                <h1>
                  {editandoId !== null
                    ? "Editar animal"
                    : "Cadastrar animal"}
                </h1>
                <p>
                  {editandoId !== null
                    ? "Atualize as informações do seu animal."
                    : "Preencha as informações para cadastrar seu animal."}
                </p>
              </div>

              <button
                type="button"
                className="fechar-formulario"
                onClick={cancelarFormulario}
                aria-label="Fechar formulário"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={salvarAnimal}>
              <div className="formulario-layout">
                <section className="bloco-foto">
                  <h2>Foto do animal</h2>
                  <p>Adicione uma foto para identificar seu animal.</p>

                  <label className="area-upload">
                    {formulario.imagem ? (
                      <img
                        className="previa-foto"
                        src={formulario.imagem}
                        alt="Prévia do animal"
                      />
                    ) : (
                      <div className="conteudo-upload">
                        <span className="icone-upload">
                          <Upload size={28} />
                        </span>
                        <strong>Adicionar foto</strong>
                        <span>Clique aqui para escolher uma imagem</span>
                        <small>JPG, PNG ou outro formato de imagem</small>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={selecionarFoto}
                    />
                  </label>

                  {formulario.imagem && (
                    <button
                      type="button"
                      className="remover-foto"
                      onClick={() => {
                        setFormulario((anterior) => ({
                          ...anterior,
                          imagem: "",
                        }));
                        setArquivoFoto(null);
                        setRemoverFoto(true);
                      }}
                    >
                      <X size={15} />
                      Remover foto
                    </button>
                  )}
                </section>

                <section className="bloco-campos">
                  <h2>Informações do animal</h2>
                  <p>Informe os dados do seu cão ou gato.</p>

                  <div className="campos-formulario">
                    <div className="campo-formulario campo-completo">
                      <label htmlFor="nome">Nome do animal *</label>
                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Ex.: Thor"
                        value={formulario.nome}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="idade">Idade *</label>
                      <input
                        id="idade"
                        name="idade"
                        type="text"
                        placeholder="Ex.: 2 anos"
                        value={formulario.idade}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="raca">Raça *</label>
                      <input
                        id="raca"
                        name="raca"
                        type="text"
                        placeholder="Ex.: Golden Retriever"
                        value={formulario.raca}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="sexo">Sexo *</label>
                      <select
                        id="sexo"
                        name="sexo"
                        value={formulario.sexo}
                        onChange={atualizarCampo}
                        required
                      >
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="peso">Peso (kg) *</label>
                      <input
                        id="peso"
                        name="peso"
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="Ex.: 12"
                        value={formulario.peso}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="porte">Porte *</label>
                      <select
                        id="porte"
                        name="porte"
                        value={formulario.porte}
                        onChange={atualizarCampo}
                        required
                      >
                        <option value="Pequeno">Pequeno</option>
                        <option value="Médio">Médio</option>
                        <option value="Grande">Grande</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label htmlFor="cidade">Cidade *</label>
                      <input
                        id="cidade"
                        name="cidade"
                        type="text"
                        placeholder="Ex.: São Paulo"
                        value={formulario.cidade}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>

                    <div className="campo-formulario campo-completo">
                      <label htmlFor="status">Situação do animal *</label>
                      <select
                        id="status"
                        name="status"
                        value={formulario.status}
                        onChange={atualizarCampo}
                        required
                      >
                        <option value="Comigo">Comigo</option>
                        <option value="Disponível para adoção">
                          Disponível para adoção
                        </option>
                        <option value="Desaparecido">Desaparecido</option>
                        <option value="Adotado">Adotado</option>
                      </select>
                    </div>

                    <div className="campo-formulario campo-completo">
                      <label htmlFor="descricao">Descrição</label>
                      <textarea
                        id="descricao"
                        name="descricao"
                        placeholder="Conte um pouco sobre a personalidade e os cuidados do animal..."
                        value={formulario.descricao}
                        onChange={atualizarCampo}
                        rows="4"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="acoes-formulario">
                <button
                  type="button"
                  className="botao-cancelar-formulario"
                  onClick={cancelarFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="botao-salvar-formulario"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : editandoId !== null
                    ? "Salvar alterações"
                    : "Cadastrar animal"}
                </button>
              </div>
            </form>
          </section>
        ) : petSelecionado ? (
          <section className="detalhes-animal">
            <button
              className="voltar-detalhes"
              onClick={() => setPetSelecionado(null)}
            >
              <ArrowLeft size={18} />
              Voltar para meus animais
            </button>

            <div className="detalhes-corpo">
              <div className="detalhes-foto">
                <img
                  src={urlArquivo(petSelecionado.imagem)}
                  alt={petSelecionado.nome}
                />
                <span className="status-animal">
                  {petSelecionado.status}
                </span>
              </div>

              <div className="detalhes-informacoes">
                <h1>{petSelecionado.nome}</h1>
                <p className="detalhes-raca">{petSelecionado.raca}</p>

                <div className="detalhes-dados">
                  <p>
                    <span>Idade</span>
                    <strong>{petSelecionado.idade}</strong>
                  </p>
                  <p>
                    <span>Sexo</span>
                    <strong>{petSelecionado.sexo}</strong>
                  </p>
                  <p>
                    <span>Peso</span>
                    <strong>{petSelecionado.peso}</strong>
                  </p>
                  <p>
                    <span>Porte</span>
                    <strong>{petSelecionado.porte || "Não informado"}</strong>
                  </p>
                  <p>
                    <span>Cidade</span>
                    <strong>{petSelecionado.cidade}</strong>
                  </p>
                </div>

                <div className="detalhes-descricao">
                  <h2>Sobre o animal</h2>
                  <p>
                    {petSelecionado.descricao ||
                      "Nenhuma descrição informada."}
                  </p>
                </div>

                <div className="detalhes-situacao">
                  <label htmlFor="situacao-rapida">Situação do animal</label>
                  <select
                    id="situacao-rapida"
                    value={petSelecionado.status}
                    onChange={(event) => alterarSituacao(event.target.value)}
                  >
                    <option value="Comigo">Comigo</option>
                    <option value="Disponível para adoção">Disponível para adoção</option>
                    <option value="Desaparecido">Desaparecido</option>
                    <option value="Adotado">Adotado</option>
                  </select>
                </div>

                <div className="detalhes-interesses">
                  <h2>Interesses recebidos</h2>
                  {erroInteresses && <p className="erro-api" role="alert">{erroInteresses}</p>}
                  {!erroInteresses && interesses.length === 0 && (
                    <p>Nenhum interesse recebido até agora.</p>
                  )}
                  {interesses.map((item) => (
                    <div className="interesse-item" key={item.id}>
                      <div>
                        <strong>{item.interessado_nome}</strong>
                        <span className="interesse-status">{item.status}</span>
                        <p>
                          {[item.interessado_email, item.interessado_telefone]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {item.mensagem && <p>“{item.mensagem}”</p>}
                      </div>
                      {item.status === "Pendente" && (
                        <div className="interesse-acoes">
                          <button type="button" onClick={() => responderInteresse(item.id, "Aceito")}>
                            Aceitar
                          </button>
                          <button type="button" onClick={() => responderInteresse(item.id, "Recusado")}>
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="botoes-detalhes">
                  <button
                    className="botao-editar-detalhes"
                    onClick={() => abrirEdicao(petSelecionado)}
                  >
                    <Pencil size={17} />
                    Editar animal
                  </button>

                  <button
                    className="botao-excluir-detalhes"
                    onClick={() => excluirAnimal(petSelecionado.id)}
                  >
                    <Trash2 size={17} />
                    Excluir animal
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <header className="cabecalho-animais">
              <div>
                <h1>Meus Animais</h1>
                <p>Gerencie os animais que você cadastrou</p>
              </div>

              <button
                className="botao-cadastrar"
                onClick={abrirCadastro}
              >
                <span className="mais">+</span>
                Cadastrar animal
              </button>
            </header>

            {carregando && <p className="aviso-lista">Carregando seus animais...</p>}
            {!carregando && animais.length === 0 && (
              <p className="aviso-lista">
                Você ainda não cadastrou nenhum animal. Clique em “Cadastrar animal”.
              </p>
            )}

            <section className="grade-animais">
              {animais.map((animal) => (
                <article className="card-animal" key={animal.id}>
                  <div className="imagem-animal">
                    <img src={urlArquivo(animal.imagem)} alt={animal.nome} />
                    <span className="status-animal">{animal.status}</span>
                  </div>

                  <div className="informacoes-animal">
                    <div className="nome-idade">
                      <h2>{animal.nome}</h2>
                      <span>{animal.idade}</span>
                    </div>

                    <p className="raca-animal">{animal.raca}</p>

                    <div className="etiquetas">
                      <span>{animal.sexo}</span>
                      <span>{animal.peso}</span>
                      <span>{animal.cidade}</span>
                    </div>

                    <div className="acoes-animal">
                      <button
                        className="botao-detalhes"
                        onClick={() => setPetSelecionado(animal)}
                      >
                        <Eye size={16} />
                        Detalhes
                      </button>

                      <div className="grupo-acoes">
                        <button
                          className="botao-acao"
                          title="Editar animal"
                          aria-label={`Editar ${animal.nome}`}
                          onClick={() => abrirEdicao(animal)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="botao-acao excluir"
                          title="Excluir animal"
                          aria-label={`Excluir ${animal.nome}`}
                          onClick={() => excluirAnimal(animal.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
