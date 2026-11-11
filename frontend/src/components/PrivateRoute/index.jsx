import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Só renderiza a página se houver login. O backend também valida o token em cada chamada.
export default function PrivateRoute({ children }) {
  const { autenticado, carregando } = useAuth();
  const local = useLocation();

  if (carregando) return <p style={{ padding: 24 }}>Carregando...</p>;

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ de: local.pathname }} />;
  }

  return children;
}
