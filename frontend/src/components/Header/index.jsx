import React from "react";
import "./styles.scss";

export default function Header({ titulo, subtitulo, acao }) {
  return (
    <header className="page-header-component">
      <div className="page-header-component__text">
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {acao && <div className="page-header-component__action">{acao}</div>}
    </header>
  );
}
