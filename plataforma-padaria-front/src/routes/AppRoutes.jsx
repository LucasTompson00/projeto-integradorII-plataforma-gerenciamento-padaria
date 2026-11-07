import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Home from "../pages/Home/Home";
import Perfil from "../pages/Perfil/Perfil";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/home" element={<Home />} />

      <Route path="/perfil" element={<Perfil />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
