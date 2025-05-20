import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/login.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Adiciona a classe ao body quando o componente é montado
    document.body.classList.add("login-background");

    // Remove a classe ao sair da página
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/paginaInicial");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="form-box p-4 bg-white rounded shadow text-center">
        <form onSubmit={handleLogin}>
          <h1 className="fs-3">Login</h1>
          <p className="small text-center text-muted">
            Preencha os seguintes campos para aceder á plataforma
          </p>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="E-mail"
              required
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
            />
          </div>
          <div className="forgot mb-3">
            <a href="#" className="small text-sm-left">
              Esqueceu a palavra-passe?
            </a>
          </div>
          <button type="submit" className="btn btn-primary btn-block w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;