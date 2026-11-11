import React from "react";
import { Heart, MapPin, Eye } from "lucide-react";
import { urlArquivo } from "../../services/api";
import "./styles.scss";

export default function PetCard({
  animal,
  onDetalhes,
  selo = "Disponível para adoção",
  mostrarFavorito = true,
}) {
  return (
    <article className="pet-card-padrao">
      <div className="pet-card-padrao__imagem">
        <img src={urlArquivo(animal.imagem || animal.foto)} alt={animal.nome} />

        {selo && <span className="pet-card-padrao__selo">{selo}</span>}

        {mostrarFavorito && (
          <button
            className="pet-card-padrao__favorito"
            type="button"
            aria-label={`Favoritar ${animal.nome}`}
            onClick={(event) => {
              event.currentTarget.classList.toggle("favoritado");
            }}
          >
            <Heart size={15} />
          </button>
        )}
      </div>

      <div className="pet-card-padrao__info">
        <div className="pet-card-padrao__topo">
          <h3>{animal.nome}</h3>
          <span>{animal.idade}</span>
        </div>

        {animal.raca && <p className="pet-card-padrao__raca">{animal.raca}</p>}

        <div className="pet-card-padrao__tags">
          {animal.sexo && <span className="tag">{animal.sexo}</span>}
          {animal.porte && <span className="tag">{animal.porte}</span>}
        </div>

        {animal.cidade && (
          <div className="pet-card-padrao__local">
            <MapPin size={14} />
            <span>{animal.cidade}</span>
          </div>
        )}

        {onDetalhes && (
          <button
            className="pet-card-padrao__botao"
            type="button"
            onClick={() => onDetalhes(animal)}
          >
            <Eye size={16} />
            <span>Ver detalhes</span>
          </button>
        )}
      </div>
    </article>
  );
}
