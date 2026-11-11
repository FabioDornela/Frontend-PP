import React, { useState } from "react";
import {
  Home,
  Dog,
  Heart,
  Search,
  Building2,
  User,
  Info,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./styles.scss";

export function Sidebar({ itemAtivo, setItemAtivo, setPetSelecionado }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const selecionarItem = (chave) => {
    if (setItemAtivo) setItemAtivo(chave);
    if (setPetSelecionado) setPetSelecionado(null);
    setMenuAberto(false);
  };

  return (
    <>
      <button
        className="btn-hamburguer"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {menuAberto && (
        <div
          className="menu-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`sidebar ${menuAberto ? "open" : ""}`}>
        <div className="header-container">
          <img
            className="logo"
            src="/images/logo.png"
            alt="Logo PortalPet"
          />

          <div className="texto-header">
            <h1 className="titulomenu">PortalPet</h1>
            <p className="subtitulomenu">Adoção &amp; Cuidado</p>
          </div>
        </div>

        <nav className="menu-nav">
          <Link
            to="/"
            className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => selecionarItem("inicio")}
          >
            <Home className="icon" size={20} />
            <span>Início</span>
          </Link>

          <Link
            to="/meus-animais"
            className={`menu-item ${location.pathname === "/meus-animais" ? "active" : ""}`}
            onClick={() => selecionarItem("meus-animais")}
          >
            <Dog className="icon" size={20} />
            <span>Meus Animais</span>
          </Link>

          <Link
            to="/adocao"
            className={`menu-item ${location.pathname === "/adocao" ? "active" : ""}`}
            onClick={() => selecionarItem("adocao")}
          >
            <Heart className="icon" size={20} />
            <span>Adoção</span>
          </Link>

          <Link
            to="/desaparecidos"
            className={`menu-item ${location.pathname === "/desaparecidos" ? "active" : ""}`}
            onClick={() => selecionarItem("desaparecidos")}
          >
            <Search className="icon" size={20} />
            <span>Desaparecidos</span>
          </Link>

          <Link
            to="/ongs"
            className={`menu-item ${location.pathname === "/ongs" ? "active" : ""}`}
            onClick={() => selecionarItem("ongs")}
          >
            <Building2 className="icon" size={20} />
            <span>ONGs</span>
          </Link>

          <Link
            to="/meu-perfil"
            className={`menu-item ${location.pathname === "/meu-perfil" ? "active" : ""}`}
            onClick={() => selecionarItem("meu-perfil")}
          >
            <User className="icon" size={20} />
            <span>Meu Perfil</span>
          </Link>

          <Link
            to="/saiba-mais"
            className={`menu-item ${location.pathname === "/saiba-mais" ? "active" : ""}`}
            onClick={() => selecionarItem("saiba-mais")}
          >
            <Info className="icon" size={20} />
            <span>Saiba Mais</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}

export { Sidebar as Menu };
export default Sidebar;
