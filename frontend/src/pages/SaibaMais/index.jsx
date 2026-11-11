import React, { useState } from "react";
import {
  PawPrint,
  ClipboardList,
  Search,
  Phone,
  Home,
  ArrowRight,
  Heart,
} from "lucide-react";

import { Menu } from "../../components/Sidebar";
import "./styles.scss";

const etapas = [
  {
    numero: "1",
    titulo: "Cadastre um animal",
    texto: "Adicione informações e fotos do seu animal na plataforma.",
    icone: <ClipboardList size={26} strokeWidth={1.8} />,
  },
  {
    numero: "2",
    titulo: "Encontre ou disponibilize",
    texto: "Procure seu novo companheiro e combine através de detalhes.",
    icone: (
      <div className="composite-icon">
        <Search size={28} strokeWidth={1.8} />
        <PawPrint size={11} className="inner-paw" />
      </div>
    ),
  },
  {
    numero: "3",
    titulo: "Entre em contato",
    texto: "Converse ou visite o responsável e combine detalhes para adoção.",
    icone: <Phone size={25} strokeWidth={1.8} />,
  },
  {
    numero: "4",
    titulo: "Dê um novo lar",
    texto: "Receba o animal com carinho, comece uma nova história.",
    icone: (
      <div className="composite-icon">
        <Home size={28} strokeWidth={1.8} />
        <PawPrint size={11} className="inner-paw-home" />
      </div>
    ),
  },
];

// DICA: Você pode exportar a imagem única dos 5 cachorros do Figma em PNG transparente
// ou usar cada cachorro separadamente abaixo:
const cachorros = [
  {
    nome: "Labrador",
    imagem: "/images/pets/labrador.png",
  },
  {
    nome: "Golden Retriever",
    imagem: "/images/pets/golden.png",
  },
  {
    nome: "Boiadeiro Australiano",
    imagem: "/images/pets/boiadeiro-australiano.png",
  },
  {
    nome: "Fiapo de Manga",
    imagem: "/images/pets/fiapo-de-manga.png",
  },
  {
    nome: "Orelha",
    imagem: "/images/pets/orelha.png",
  },
];

export default function SaibaMais() {
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [itemAtivo, setItemAtivo] = useState("inicio");

  return (
    <div className="app-layout">
      <Menu
        itemAtivo={itemAtivo}
        setItemAtivo={setItemAtivo}
        setPetSelecionado={setPetSelecionado}
      />

      <main className="main-content saiba-mais-page">
        {/* ================= HERO & COMO FUNCIONA ================= */}
        <section className="saiba-hero">
          <div className="saiba-hero-header">
            <h1>
              COMO <span>FUNCIONA?</span>
            </h1>

            <p className="saiba-subtitle">
              Adotar é um ato de amor.
              <br />
              Veja como é simples dar
              <br />
              um lar para um animal e<br />
              transformar uma vida!
            </p>
          </div>

          <div className="saiba-card-wrapper">
            {/* Cachorro espiando por cima do card (substitua pelo PNG exportado do Figma se tiver) */}
            <div className="saiba-peeking-dog">
              <img
                src="/images/banners/cachorro.png"
                alt="Cachorro espiando"
              />
            </div>

            {/* Patinhas decorativas ao redor do card */}
            <PawPrint className="paw-decor paw-orange-top-right" />
            <PawPrint className="paw-decor paw-outline-right" />
            <PawPrint className="paw-decor paw-orange-left-top" />
            <PawPrint className="paw-decor paw-outline-left" />
            <PawPrint className="paw-decor paw-dark-left-mid" />
            <PawPrint className="paw-decor paw-orange-left-small" />
            <PawPrint className="paw-decor paw-dark-left-bottom" />
            <PawPrint className="paw-decor paw-dark-bottom-right" />
            <PawPrint className="paw-decor paw-outline-bottom-right" />

            {/* Card Escuro das 4 Etapas */}
            <div className="saiba-steps">
              {etapas.map((etapa) => (
                <article
                  className={`saiba-step step-${etapa.numero}`}
                  key={etapa.numero}
                >
                  <div className="saiba-step-icon">
                    {etapa.icone}
                    <span className="step-badge">{etapa.numero}</span>
                  </div>

                  <div className="saiba-step-body">
                    <h3>
                      <span>{etapa.numero}.</span> {etapa.titulo}
                    </h3>
                    <p>{etapa.texto}</p>
                  </div>
                </article>
              ))}

              <button type="button" className="saiba-journey-btn">
                Começar a jornada
              </button>
            </div>
          </div>
        </section>

        {/* ================= SEÇÃO ONDULADA DOS CACHORROS + CTA ================= */}
        <section className="saiba-middle-wave">
          {/* Curva clara superior */}
          <div className="wave-top-Assigned" />

          <div className="saiba-dogs-container">
            {/* Detalhe de tracinhos na esquerda */}
            <div className="doodle-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="saiba-dogs-row">
              {cachorros.map((cachorro) => (
                <div className="saiba-dog-item" key={cachorro.nome}>
                  <img src={cachorro.imagem} alt={cachorro.nome} />
                </div>
              ))}
            </div>

            {/* Coraçõezinhos na direita */}
            <div className="doodle-hearts" aria-hidden="true">
              <Heart size={15} />
              <Heart size={11} />
            </div>
          </div>

          {/* Faixa ondulada pêssego com o CTA dentro */}
          <div className="saiba-cta-band">
            <div className="saiba-cta">
              <div className="saiba-cta-icon">
                <PawPrint size={38} />
              </div>

              <div className="saiba-cta-text">
                <h2>
                  Pronto para encontrar <span>seu companheiro?</span>
                </h2>
                <p>
                  Junte-se a nós e descubra como é fácil mudar uma vida,
                  <br />
                  incluindo a sua.
                </p>
              </div>

              <button
                type="button"
                className="saiba-cta-action"
                aria-label="Avançar"
              >
                <PawPrint size={24} className="cta-mini-paw" />
                <ArrowRight size={28} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* ================= RODAPÉ ================= */}
          <footer className="saiba-footer">
            <PawPrint className="footer-watermark-paw left" size={34} />

            <div className="footer-center-line">
              <span className="line" />
              <span className="word">ADOTE</span>
              <span className="dot">•</span>
              <span className="word">CUIDE</span>
              <span className="dot">•</span>
              <span className="word">TRANSFORME</span>
              <span className="line" />
            </div>

            <PawPrint className="footer-watermark-paw right" size={34} />
          </footer>
        </section>
      </main>
    </div>
  );
}