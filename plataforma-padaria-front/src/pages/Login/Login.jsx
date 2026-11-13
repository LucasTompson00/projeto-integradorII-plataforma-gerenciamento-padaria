import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../config";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if(!email.trim() || !password.trim()) {
      setErro("Preencha todos os campos.");
      return ;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({email: email, senha: password})
      });

      if(!response.ok) {
        throw new Error("Não foi possível logar na conta.");
      }

      navigate("/Home");

    } catch(err) {
      setErro("Erro ao logar. Tente novamente.");
    } finally {
      setLoading(false);
    }

  }

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-content">
          <h1>Panificadora</h1>

          <span className="brand-symbol">GAVA</span>

          <p>
            Gestão simples e eficiente para o dia a dia da sua padaria.
          </p>
        </div>

        <div className="brand-decoration decoration-one"></div>
        <div className="brand-decoration decoration-two"></div>
        <div className="brand-decoration decoration-three"></div>
      </section>

      <section className="login-container">
        <div className="login-header">
          <span>Bem-vindo</span>
          <h2>Faça seu login</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <a href="#">Esqueci minha senha</a>
          </div>

          <p className="erro-form">
            {erro}
          </p>

          <button type="submit" className="login-button" disable={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Ainda não possui uma conta? {" "} <Link to="/cadastro">Cadastrar-se</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;