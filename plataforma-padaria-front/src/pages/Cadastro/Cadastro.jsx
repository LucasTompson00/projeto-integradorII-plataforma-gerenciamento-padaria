import "./Cadastro.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../config";

function Cadastro() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();

    setErro("");

    if(!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErro("Preencha todos os campos.");
      return ;
    }
    if(password.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return ;
    }
    if(password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return ;
    }

    setLoading(true);
    try{
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({nome: name, email: email, senha: password})
      });

      if(!response.ok) {
        throw new Error("Não foi possível criar a conta.");
      }

      navigate("/login");

    } catch(err) {
      setErro("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              id="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Digite sua senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <p className="erro-form">
            {erro}
          </p>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
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