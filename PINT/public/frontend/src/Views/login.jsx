import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/login.css";
import authHeader from "./auth.header";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.mustChangePassword) {
        setMustChangePassword(true);
      } else if (response.ok && data.success && data.token) {
        const userData = data.user || data.data || {};
        const userToStore = { ...userData, token: data.token };
        localStorage.setItem("user", JSON.stringify(userToStore));
        navigate("/paginaInicial");
        window.location.reload();
      } else {
        setErro(data.message || "Erro ao fazer login.");
      }
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    }
  };

  const handleForceUpdatePassword = async (e) => {
    e.preventDefault();
    setErro("");
    if (newPassword !== confirmNewPassword) {
      setErro("A nova palavra-passe e a confirmação não coincidem.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/forceUpdatePassword", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword,
          confirmNewPassword,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.token) {
        const userData = data.user || data.data || {};
        const userToStore = { ...userData, token: data.token };
        localStorage.setItem("user", JSON.stringify(userToStore));
        navigate("/paginaInicial");
        window.location.reload();
      } else {
        setErro(data.message || "Erro ao atualizar palavra-passe.");
      }
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="form-box p-4 bg-white rounded shadow text-center">
        {!mustChangePassword ? (
          <form onSubmit={handleLogin}>
            <h1 className="fs-3">Login</h1>
            <p className="small text-center text-muted">
              Preencha os seguintes campos para aceder á plataforma
            </p>
            {erro && <div className="alert alert-danger">{erro}</div>}
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="text"
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
            <div className="forgot mb-3">
              <a href="#" className="small text-sm-left">
                Esqueceu a palavra-passe?
              </a>
            </div>
            <button type="submit" className="btn btn-primary btn-block w-100">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleForceUpdatePassword}>
            <h1 className="fs-3">Nova palavra-passe</h1>
            <p className="small text-center text-muted">
              Por favor, defina uma nova palavra-passe para continuar.
            </p>
            {erro && <div className="alert alert-danger">{erro}</div>}
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Nova palavra-passe"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Confirmar nova palavra-passe"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block w-100">
              Atualizar palavra-passe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
