import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import authHeader from "./auth.header.js";

const Forum = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [forum, setForum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comentarios, setComentarios] = useState([]);
    const [ficheiros, setFicheiros] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState(null);
    const chatEndRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return (
            <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
                <div className="container text-center">
                    <div className="alert alert-warning">
                        Tens de iniciar sessão para visualizar o conteúdo do fórum.
                    </div>
                    <Link to="/login" className="btn btn-primary mt-3">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    // Buscar dados do fórum
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/forum/get/${id}`, { headers: authHeader() })
            .then(res => {
                if (res.data.success) setForum(res.data.data);
                else navigate("/foruns");
            })
            .catch(() => navigate("/foruns"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // Buscar comentários do fórum
    useEffect(() => {
        let intervalId;

        // Função para buscar comentários
        const fetchComentarios = () => {
            axios.get("http://localhost:3000/comentario/list", { headers: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        setComentarios(res.data.data.filter(c => c.forumId === Number(id)));
                    }
                })
                .catch(() => setComentarios([]));
        };
        // Buscar imediatamente ao montar
        fetchComentarios();
        // Atualizar a cada 5 segundos
        intervalId = setInterval(fetchComentarios, 5000);
        // Limpar intervalo ao desmontar
        return () => clearInterval(intervalId);
    }, [id]);

    // Buscar ficheiros do fórum
    useEffect(() => {
        axios.get(`http://localhost:3000/forum-ficheiro/listar/${id}`, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setFicheiros(res.data.ficheiros || []);
                }
            })
            .catch(() => setFicheiros([]));
    }, [id]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comentarios, ficheiros]);

    // Enviar mensagem de texto
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!user) {
            alert("Tens de iniciar sessão para enviar mensagens.");
            return;
        }
        try {
            await axios.post("http://localhost:3000/comentario/create", {
                texto: newMessage,
                forumId: id,
                utilizadorId: user.id
            }, { headers: authHeader() });
            setNewMessage("");
            // Atualiza comentários
            axios.get("http://localhost:3000/comentario/list", { headers: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        setComentarios(res.data.data.filter(c => c.forumId === Number(id)));
                    }
                });
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Erro ao enviar mensagem.");
        }
    };

    // Enviar ficheiro
    const handleSendFile = async (e) => {
        e.preventDefault();
        if (!file) return;
        if (!user) {
            alert("Tens de iniciar sessão para enviar ficheiros.");
            return;
        }
        const formData = new FormData();
        formData.append("ficheiros", file);
        try {
            await axios.post(
                `http://localhost:3000/forum-ficheiro/upload/${id}`,
                formData,
                {
                    headers: {
                        ...authHeader(),
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            setFile(null);
            e.target.reset && e.target.reset();
            alert("Ficheiro enviado com sucesso!");

            setTimeout(() => {
                axios.get(`http://localhost:3000/forum-ficheiro/listar/${id}`, { headers: authHeader() })
                    .then(res => {
                        if (res.data.success) {
                            setFicheiros(res.data.ficheiros || []);
                        }
                    });
            }, 500);
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Erro ao enviar ficheiro.");
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm("Tens a certeza que queres eliminar este ficheiro?")) return;
        try {
            await axios.delete(
                `http://localhost:3000/forum-ficheiro/delete/${fileId}`,
                { headers: authHeader() }
            );
            // Atualiza lista de ficheiros
            axios.get(`http://localhost:3000/forum-ficheiro/listar/${id}`, { headers: authHeader() })
                .then(res => {
                    if (res.data.success) {
                        setFicheiros(res.data.ficheiros || []);
                    }
                });
        } catch (err) {
            alert("Erro ao eliminar ficheiro.");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">A carregar fórum...</div>;
    }

    if (!forum) {
        return <div className="text-center mt-5 text-danger">Fórum não encontrado.</div>;
    }

    // --- MODERN CHAT DESIGN STYLES ---
    const chatBg = {
        background: "linear-gradient(135deg,#e3e9f7 0%,#f8fafc 100%)",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
        padding: "24px",
        minHeight: "350px",
        maxHeight: "350px",
        overflowY: "auto",
        marginBottom: "16px"
    };

    const messageBubble = (msg, isOwn) => (
        <div
            key={msg.id}
            className={`d-flex mb-3 ${isOwn ? "justify-content-end" : "justify-content-start"}`}
        >
            <div
                style={{
                    background: isOwn ? "linear-gradient(135deg, #4f8cff 0%, #6fc3ff 100%)" : "#fff",
                    color: isOwn ? "#fff" : "#222",
                    borderRadius: "18px",
                    padding: "12px 18px",
                    maxWidth: "70%",
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                    position: "relative"
                }}
            >
                <span className="fw-bold" style={{ fontSize: 14 }}>
                    {msg.Utilizador?.nomeUtilizador || "Utilizador"}
                </span>
                <span className="ms-2" style={{ fontSize: 13 }}>{msg.texto}</span>
                <div className="small text-end mt-1" style={{ fontSize: 11, opacity: 0.7 }}>
                    {new Date(msg.dataComentario).toLocaleString()}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid min-vh-100 m-0 p-0" style={{ background: "#f4f7fb" }}>
            {/* Banner do fórum */}
            <div
                className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                style={{
                    height: "250px",
                    backgroundImage: `url('${forum.imagemForum || "/img/forum-default.png"}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }}></div>
                <div className="col-md-8 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="fw-bold fs-2 text-center" style={{ color: "white" }}>{forum.nome}</div>
                    <div className="text-center" style={{ color: "white" }}>{forum.descricao}</div>
                    <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
                        <span className="badge bg-info text-dark">
                            {forum.TOPICOC?.AREAC?.CATEGORIAC?.nome || "Sem categoria"}
                        </span>
                        <span className="badge bg-secondary">
                            {forum.TOPICOC?.AREAC?.nome || "Sem área"}
                        </span>
                        <span className="badge bg-primary">
                            {forum.TOPICOC?.nomeTopico || "Sem tópico"}
                        </span>
                    </div>
                </div>
            </div>
            {/* Chat Section */}
            <div className="container2 d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 250px)" }}>
                <div className="container-fluid row mt-3 p-0 m-0 rounded-4 overflow-x-hidden overflow-y-auto mb-5"
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        background: "#fff",
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)"
                    }}>
                    <div className="col-12">
                        <h5 className="blue-text fw-bold mb-3 mt-4">
                            <i className="bi bi-chat-dots me-2"></i>
                            Chat do Fórum
                            <span className="ms-2 small text-muted">({forum.TOPICOC?.nomeTopico || "Tópico"})</span>
                        </h5>
                        <div style={chatBg} className="rounded-start-4">
                            {comentarios.length === 0 ? (
                                <div className="text-muted text-center mt-4">Ainda não há mensagens neste fórum.</div>
                            ) : (
                                comentarios
                                    .slice()
                                    .sort((a, b) => new Date(a.dataComentario) - new Date(b.dataComentario))
                                    .map(msg =>
                                        messageBubble(msg, user && msg.utilizadorId === user.id)
                                    )
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        {/* Formulário de envio de mensagem */}
                        <form
                            className="row d-flex  gap-2 align-items-center mb-3"
                            onSubmit={handleSendMessage}    
                            style={{ maxWidth: 700, margin: "0 auto" }}
                        >
                            <input
                                type="text"
                                className="col-9 rounded-pill shadow-sm"
                                placeholder="Escreve uma mensagem..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                maxLength={500}
                                disabled={!user}
                                style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e3e9f7",
                                    height: "45px",           // aumenta a altura do input
                                    fontSize: "1.1rem",       // texto maior
                                    paddingLeft: "24px",      // mais espaço à esquerda
                                    paddingRight: "24px"      // mais espaço à direita
                                }} />
                            <button
                                type="submit"
                                className="col-2 btn btn-primary rounded-pill px-4 shadow-sm"
                                disabled={!user}
                                style={{ whiteSpace: "nowrap" }}
                            >
                                <i className="bi bi-send"></i>
                            </button>
                        </form>
                        {/* Formulário de envio de ficheiro */}
                        <form className="d-flex gap-2 align-items-end mb-4" onSubmit={handleSendFile} style={{ maxWidth: 700, margin: "0 auto" }}>
                            <input
                                id="ficheiro-upload"
                                type="file"
                                style={{ display: "none" }}
                                onChange={e => setFile(e.target.files[0])}
                                disabled={!user}
                            />
                            <label
                                htmlFor="ficheiro-upload"
                                className="btn btn-outline-secondary rounded-pill px-4 shadow-sm mb-0"
                                style={{ cursor: user ? "pointer" : "not-allowed" }}
                            >
                                <i className="bi bi-paperclip me-2"></i>Ficheiro :
                                <span className="ms-2" style={{ minWidth: 180 }}>
                                    {file ? file.name : "nenhum ficheiro selecionado"}
                                </span>
                            </label>
                            <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={!user || !file}>
                                Enviar
                            </button>
                        </form>
                        {/* Lista de ficheiros enviados */}
                        <div className="mt-4">
                            <h6 className="fw-bold blue-text mb-3"><i className="bi bi-folder2-open me-2"></i>Documentos partilhados</h6>
                            {ficheiros.length === 0 ? (
                                <div className="text-muted">Nenhum ficheiro enviado neste fórum.</div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {ficheiros.map(f => (
                                        <li key={f.id} className="list-group-item d-flex align-items-center justify-content-between border-0" style={{ background: "#f8fafc" }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="bi bi-file-earmark-arrow-down me-2 text-primary"></i>
                                                <a href={f.url} target="_blank" rel="noopener noreferrer" download={f.nomeOriginal} className="fw-semibold text-decoration-none text-dark">
                                                    {f.nomeOriginal}
                                                </a>
                                                {user && String(f.utilizadorId) === String(user.id) && (
                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        title="Eliminar ficheiro"
                                                        onClick={() => handleDeleteFile(f.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                            <span className="badge bg-light text-dark">{f.tipo}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {!user && (
                            <div className="text-danger mt-2">
                                Inicia sessão para participar no chat.
                            </div>
                        )}
                        <div className="d-flex justify-content-end mt-3 mb-2">
                            <Link to="/foruns" className="btn btn-outline-primary rounded-pill">
                                <i className="bi bi-arrow-left"></i> Voltar aos Fóruns
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;