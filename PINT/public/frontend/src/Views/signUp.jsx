import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [nTel, setNTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    const payload = {
      nomeUtilizador: nome,
      dataNasc,
      nTel,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigate("/login");
      } else {
        setErro((data.details && data.details) || data.message || "Erro ao registar.");
      }
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="form-box p-4 bg-white rounded shadow text-center"
        style={{ minWidth: 350, minHeight: 480, maxWidth: 400, width: "100%" }}
      >
        <form onSubmit={handleRegister}>
          <h1 className="fs-3">Registar</h1>
          <p className="small text-center text-muted">
            Preencha os seguintes campos para criar a sua conta
          </p>
          {erro && <div className="alert alert-danger">{erro}</div>}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-calendar"></i>
            </span>
            <input
              type="date"
              className="form-control form-control-sm"
              placeholder="Data de Nascimento"
              required
              value={dataNasc}
              onChange={(e) => setDataNasc(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-telephone"></i>
            </span>
            <input
              type="tel"
              className="form-control form-control-sm"
              placeholder="Número de Telemóvel"
              required
              value={nTel}
              onChange={(e) => setNTel(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control form-control-sm"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control form-control-sm"
              placeholder="Palavra-passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block w-100">
            Registar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;