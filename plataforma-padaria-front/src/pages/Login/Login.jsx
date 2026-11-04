import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
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

        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>

            <a href="#">Esqueci minha senha</a>
          </div>

          <button type="submit" className="login-button">
            Entrar
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