import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Adocao from "../pages/Adocao";
import MeuPerfil from "../pages/MeuPerfil";
import MeusAnimais from "../pages/MeusAnimais";
import SaibaMais from "../pages/SaibaMais";
import Desaparecidos from "../pages/Desaparecidos";
import Ongs from "../pages/Ongs";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adocao" element={<Adocao />} />
          <Route path="/desaparecidos" element={<Desaparecidos />} />
          <Route path="/ongs" element={<Ongs />} />
          <Route path="/saiba-mais" element={<SaibaMais />} />
          <Route
            path="/meu-perfil"
            element={
              <PrivateRoute>
                <MeuPerfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/meus-animais"
            element={
              <PrivateRoute>
                <MeusAnimais />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
