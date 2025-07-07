import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/login.css";
import authHeader from "./auth.header";
import Modal from "react-bootstrap/Modal";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    setForgotLoading(true);
    try {
      const response = await fetch("https://pint-web-htw2.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setForgotMsg("Se o email existir, receberá instruções para recuperar a palavra-passe.");
      } else {
        setForgotMsg(data.message || "Erro ao enviar pedido.");
      }
    } catch (error) {
      setForgotMsg("Erro ao conectar ao servidor.");
    }
    setForgotLoading(false);
  };


  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  // Função para redirecionar com base na role
  const redirectToDashboard = (userRole) => {
    if (userRole === "gestor") {
      navigate("/admin");
    } else if (userRole === "formador") {
      navigate("/curso-formador");
    } else {
      navigate("/paginaInicial");
    }
    //window.location.reload();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await fetch("https://pint-web-htw2.onrender.com/auth/login", {
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
        redirectToDashboard(userData.role);
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
      const response = await fetch("https://pint-web-htw2.onrender.com/auth/forceUpdatePassword", {
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

  useEffect(() => {
          document.title = "Login / SoftSkills";
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
                <a href="#" className="small text-sm-left" onClick={e => { e.preventDefault(); setShowForgotModal(true); }}>
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
          <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Recuperar palavra-passe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <label htmlFor="forgotEmail" className="form-label">
                    Introduza o seu email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="forgotEmail"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                  />
                </div>
                {forgotMsg && (
                  <div className="alert alert-info py-2">{forgotMsg}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "A enviar..." : "Recuperar"}
                </button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Login;
