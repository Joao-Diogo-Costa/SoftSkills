import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/login.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fadeOutModal, setFadeOutModal] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMsg("As palavras-passe não coincidem.");
            setSuccess(false);
            setShowModal(true);
            setFadeOutModal(false);
            return;
        }
        try {
            const res = await axios.post(`https://pint-web-htw2.onrender.com/auth/reset-password/${encodeURIComponent(token)}`, { password });
            setMsg(res.data.message);
            setSuccess(true);
            setShowModal(true);
            setFadeOutModal(false);
            setTimeout(() => {
                setFadeOutModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    setFadeOutModal(false);
                    navigate("/login");
                }, 250);
            }, 2000);
        } catch (err) {
            setMsg(err.response?.data?.message || "Erro ao redefinir password.");
            setSuccess(false);
            setShowModal(true);
            setFadeOutModal(false);
        }
    };

    const handleCloseModal = () => {
        setFadeOutModal(true);
        setTimeout(() => {
            setShowModal(false);
            setFadeOutModal(false);
            if (success) navigate("/login");
        }, 250);
    };

    useEffect(() => {
        document.title = "Redefinir Palavra-passe / SoftSkills";
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
        <div
            className="container d-flex justify-content-center align-items-center vh-100"
            style={{
                position: "relative", 
                zIndex: 1,
            }}
        >
            <div className="form-box p-4 bg-white rounded shadow text-center" style={{ minWidth: 350 }}>
                <form onSubmit={handleSubmit}>
                    <h1 className="fs-3">Redefinir palavra-passe</h1>
                    <p className="small text-center text-muted">
                        Introduza a nova palavra-passe para a sua conta.
                    </p>
                    <div className="input-group mb-3">
                        <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="Nova palavra-passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                            placeholder="Confirmar nova palavra-passe"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary btn-block w-100" type="submit" disabled={success}>
                        Redefinir
                    </button>
                </form>

                {/* MODAL DE FEEDBACK */}
                {showModal && (
                    <div
                        className="modal fade show"
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                        style={{
                            display: "block",
                            background: "rgba(57, 99, 157, 0.5)"
                        }}
                        onClick={handleCloseModal}
                    >
                        <div
                            className={`modal-dialog modal-dialog-centered ${fadeOutModal ? "custom-fade-out" : "custom-fade-in"}`}
                            style={{ maxWidth: 400 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-body py-4">
                                    <div className="d-flex flex-column align-items-center mb-3">
                                        <img
                                            src={success ? "/img/success_vector.svg" : "/img/warning_vector.svg"}
                                            alt={success ? "Sucesso" : "Erro"}
                                            style={{ width: 64, height: 64 }}
                                        />
                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                            {success ? "Sucesso" : "Erro"}
                                        </h1>
                                    </div>
                                    <p className="text-center fs-5">
                                        {msg}
                                    </p>
                                </div>
                                <div className="modal-footer justify-content-center py-3">
                                    <button
                                        type="button"
                                        className="btn btn-voltar px-4"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleCloseModal();
                                        }}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default ResetPassword;