import "./Cadastro.css";
import { Link } from "react-router-dom";

function Cadastro() {
  return (
    <main className="register-page">
      <section className="register-brand">
        <div className="brand-content">

          <h1>Panificadora</h1>
          <span className="brand-symbol">GAVA</span>

          <p>
            Crie sua conta e tenha acesso ao sistema de gestão da sua padaria.
          </p>
        </div>

        <div className="brand-decoration decoration-one"></div>
        <div className="brand-decoration decoration-two"></div>
        <div className="brand-decoration decoration-three"></div>
      </section>

      <section className="register-container">
        <div className="register-header">
          <span>Comece agora</span>
          <h2>Crie sua conta</h2>
          <p>Preencha os dados para realizar seu cadastro</p>
        </div>

        <form className="register-form">
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              id="name"
              placeholder="Digite seu nome"
            />
          </div>

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

          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Digite sua senha novamente"
            />
          </div>

          <button type="submit" className="register-button">
            Criar conta
          </button>
        </form>

        <div className="register-footer">
          <p>
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;