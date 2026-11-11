import React, { useEffect, useState } from "react";
import {
  Dog,
  Heart,
  User,
  PawPrint,
  Eye,
  ArrowRight,
  MapPin,
  Cat,
  Rabbit,
  Calendar,
  Scale,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/Sidebar";
import { listarDisponiveis } from "../../services/animalService";
import { mensagemDeErro, urlArquivo } from "../../services/api";
import "./styles.scss";

export default function Home() {
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [itemAtivo, setItemAtivo] = useState("inicio");
  const navigate = useNavigate();
  const [animaisDisponiveis, setAnimaisDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroAnimais, setErroAnimais] = useState("");

  useEffect(() => {
    listarDisponiveis({ limite: 4 })
      .then(setAnimaisDisponiveis)
      .catch((erro) =>
        setErroAnimais(mensagemDeErro(erro, "Não foi possível carregar os animais."))
      )
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="app-layout">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content">
        {petSelecionado ? (
          <div className="pet-details-container">
            <div className="breadcrumb">
              <button
                type="button"
                onClick={() => {
                  setPetSelecionado(null);
                  setItemAtivo("inicio");
                }}
              >
                Início
              </button>

              <span className="separator">&gt;</span>
              <span className="current">{petSelecionado.nome}</span>
            </div>

            <div className="pet-details-grid">
              <div className="pet-details-image-wrapper">
                <img
                  src={urlArquivo(petSelecionado.imagem)}
                  alt={petSelecionado.nome}
                />

                <button
                  className="btn-favorito-large"
                  type="button"
                  aria-label="Favoritar animal"
                >
                  <Heart
                    size={20}
                    fill={petSelecionado.favorito ? "#ef7d3b" : "none"}
                  />
                </button>
              </div>

              <div className="pet-details-info">
                <div className="title-row">
                  <h1>{petSelecionado.nome}</h1>
                  <span className="badge-adocao-tag">
                    Disponível para adoção
                  </span>
                </div>

                <div className="attributes-grid">
                  <div className="attr-card">
                    <Calendar className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Idade</span>
                      <strong>{petSelecionado.idade}</strong>
                    </div>
                  </div>

                  <div className="attr-card">
                    <Dog className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Raça</span>
                      <strong>{petSelecionado.raca}</strong>
                    </div>
                  </div>

                  <div className="attr-card">
                    <Dog className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Sexo</span>
                      <strong>{petSelecionado.sexo}</strong>
                    </div>
                  </div>

                  <div className="attr-card">
                    <Scale className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Peso</span>
                      <strong>{petSelecionado.peso}</strong>
                    </div>
                  </div>

                  <div className="attr-card">
                    <MapPin className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Cidade</span>
                      <strong>{petSelecionado.cidade}</strong>
                    </div>
                  </div>

                  <div className="attr-card">
                    <User className="attr-icon" size={22} />
                    <div>
                      <span className="attr-label">Responsável</span>
                      <strong>{petSelecionado.tutor_nome}</strong>
                    </div>
                  </div>
                </div>

                <div className="description-section">
                  <h3>DESCRIÇÃO</h3>
                  <p>{petSelecionado.descricao}</p>
                </div>

                <div className="details-actions">
                  <button
                    className="btn-voltar"
                    type="button"
                    onClick={() => {
                      setPetSelecionado(null);
                      setItemAtivo("inicio");
                    }}
                  >
                    <ArrowLeft size={18} />
                    <span>Voltar</span>
                  </button>

                  <button
                    className="btn-interesse"
                    type="button"
                    onClick={() => navigate("/adocao")}
                  >
                    <Heart size={18} />
                    <span>Tenho interesse em adotar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <section className="hero-card">
              <div className="hero-content">
                <div className="badge-tag">
                  <PawPrint size={16} />
                  <span>Plataforma de adoção</span>
                </div>

                <h1 className="hero-title">
                  Encontre um <br />
                  novo melhor <br />
                  amigo.
                </h1>

                <p className="hero-description">
                  Ajude um animal a encontrar um lar cheio de carinho ou
                  encontre seu próximo companheiro.
                </p>

                <div className="hero-buttons">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => navigate("/adocao")}
                  >
                    <Heart size={18} />
                    <span>Quero Adotar</span>
                  </button>

                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => navigate("/meus-animais")}
                  >
                    <PawPrint size={18} />
                    <span>Quero colocar para adoção</span>
                  </button>
                </div>
              </div>

              <div className="hero-image-wrapper">
                <img
                  src="/images/banners/cachorro-e-gato.avif"
                  alt="Cão e gato juntos"
                  className="hero-image"
                />

                <div className="floating-badge">
                  <div className="heart-icon-wrapper">
                    <Heart size={20} className="heart-icon" />
                  </div>

                  <div className="badge-text">
                    <strong>+200 animais</strong>
                    <span>encontraram um lar</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="pets-section">
              <div className="pets-header">
                <div>
                  <h2>Animais esperando por um lar</h2>
                  <p>
                    Conheça alguns dos animais disponíveis para adoção
                  </p>
                </div>

                <button
                  type="button"
                  className="ver-todos"
                  onClick={() => navigate("/adocao")}
                >
                  <span>Ver todos</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {carregando && <p className="pets-aviso">Carregando animais...</p>}
              {!carregando && erroAnimais && (
                <p className="pets-aviso" role="alert">{erroAnimais}</p>
              )}
              {!carregando && !erroAnimais && animaisDisponiveis.length === 0 && (
                <p className="pets-aviso">
                  Ainda não há animais disponíveis para adoção.
                </p>
              )}

              <div className="pets-grid">
                {animaisDisponiveis.map((pet) => (
                  <div key={pet.id} className="pet-card">
                    <div className="pet-image-container">
                      <img src={urlArquivo(pet.imagem)} alt={pet.nome} />

                      <span className="badge-adocao">
                        Disponível para adoção
                      </span>

                      <button
                        className={`btn-favorito ${
                          pet.favorito ? "active" : ""
                        }`}
                        type="button"
                        aria-label={`Favoritar ${pet.nome}`}
                      >
                        <Heart
                          size={16}
                          fill={pet.favorito ? "#ef7d3b" : "none"}
                        />
                      </button>
                    </div>

                    <div className="pet-info">
                      <div className="pet-title-row">
                        <h3>{pet.nome}</h3>
                        <span className="pet-idade">{pet.idade}</span>
                      </div>

                      <p className="pet-raca">{pet.raca}</p>

                      <div className="pet-tags">
                        <span className="tag">{pet.sexo}</span>
                        <span className="tag">{pet.porte}</span>
                      </div>

                      <div className="pet-location">
                        <MapPin size={14} />
                        <span>{pet.cidade}</span>
                      </div>

                      <button
                        className="btn-detalhes"
                        type="button"
                        onClick={() => {
                          setPetSelecionado(pet);
                          setItemAtivo("inicio");
                        }}
                      >
                        <Eye size={16} />
                        <span>Ver detalhes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="cta-banner">
              <div className="cta-icons">
                <Dog size={28} />
                <Cat size={28} />
                <Rabbit size={28} />
              </div>

              <h2 className="cta-title">
                Pronto para encontrar seu companheiro?
              </h2>

              <p className="cta-description">
                Junte-se a centenas de pessoas que já encontraram um novo
                amigo através do PortalPet.
              </p>

              <div className="cta-buttons">
                <button
                  type="button"
                  className="btn-cta-white"
                  onClick={() => navigate("/adocao")}
                >
                  <Heart size={18} />
                  <span>Ver animais para adoção</span>
                </button>

                <button
                  type="button"
                  className="btn-cta-outline"
                  onClick={() => navigate("/meus-animais")}
                >
                  <PawPrint size={18} />
                  <span>Cadastrar um animal</span>
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
