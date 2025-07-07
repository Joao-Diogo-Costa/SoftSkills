import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.post("https://pint-web-htw2.onrender.com/auth/register", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      if (response.status === 200 && data.success) {
        navigate("/login");
      } else {
        setErro((data.details && data.details) || data.message || "Erro ao registar.");
      }
    } catch (error) {
      setErro(
        error.response?.data?.details ||
        error.response?.data?.message ||
        "Erro ao conectar ao servidor."
      );
    }
  };

  useEffect(() => {
      document.title = "Registar / SoftSkills";
  }, []);

    useEffect(() => {
      if (window.FinisherHeader) {
        new window.FinisherHeader({
          selector: ".finisher-header", 
          count: 75,
          size: { min: 2, max: 8, pulse: 0 },
          speed: { x: { min: 0, max: 0.4 }, y: { min: 0, max: 0.6 } },
          colors: {
            background: "transparent",
            particles: ["#ffffff", "#d7f3fe", "#0072ff"]
          },
          blending: "overlay",
          opacity: { center: 1, edge: 0 },
          skew: -2,
          shapes: ["c"]
        });
      }
    }, []);

  return (
    <>

    <div className="finisher-header" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
      <div className="animated-logo">
        <img
          src="/img/Logo.png"
          alt="Logo"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </div>
      <div className="container d-flex justify-content-center align-items-center vh-100" style={{ position: "relative", zIndex: 1 }}>
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
    </>
  );
};

export default SignUp;