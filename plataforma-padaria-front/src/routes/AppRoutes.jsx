import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Home from "../pages/Home/Home";
import Perfil from "../pages/Perfil/Perfil";
import AppLayout from "../components/layout/AppLayout/AppLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<AppLayout area="cliente" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
