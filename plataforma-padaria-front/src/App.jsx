import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import moduleName from 'module';
import  Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";

function AnimatedRoutes() {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  return (
    <div
      key={location.pathname}
      className={isInitialLoad ? "" : "page-transition"}
    >
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;