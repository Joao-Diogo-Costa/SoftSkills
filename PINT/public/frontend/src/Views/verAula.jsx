import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import authHeader from "./auth.header";

const VerAula = () => {
    const { aulaId } = useParams(); // id da aula assíncrona
    const [aula, setAula] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [documentos, setDocumentos] = useState([]);
    const [percentagemCurso, setPercentagemCurso] = useState(null);
    const [marcada, setMarcada] = useState(false);
    const [marcarMsg, setMarcarMsg] = useState("");

    const outrasAulas = aula
        ? playlist.filter(item => item.id !== aula.id)
        : [];

    const playlistOrdenada = [...playlist].sort((a, b) => a.ordemNoCurso - b.ordemNoCurso);
    const numeroAulaNoCurso = playlistOrdenada.findIndex(item => item.id === aula.id) + 1;

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/aula-assincrona/get/${aulaId}`)
            .then(res => {
                if (res.data.success) {
                    setAula(res.data.data);

                    // Verificar se a aula já está marcada como concluída
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user) {
                        axios.get(
                            `http://localhost:3000/progresso-aula/concluida/${user.id}/${res.data.data.id}`,
                            { headers: authHeader() }
                        ).then(resp => {
                            setMarcada(resp.data.concluida === true);
                        }).catch(() => setMarcada(false));
                    }


                    // Buscar percentagem de progresso do curso
                    if (user && res.data.data.cursoId) {
                        axios.get(
                            `http://localhost:3000/progresso-aula/progresso/${user.id}/${res.data.data.cursoId}`,
                            { headers: authHeader() }
                        ).then(resp => {
                            if (resp.data.success) {
                                setPercentagemCurso(resp.data.percentagem);
                            } else {
                                setPercentagemCurso(null);
                            }
                        }).catch(() => setPercentagemCurso(null));
                    }

                    return axios.get(
                        `http://localhost:3000/aula-assincrona/curso/${res.data.data.cursoId}`,
                        { headers: { ...authHeader() } }
                    );
                } else {
                    setLoading(false);
                }
            })
            .then(res => {
                if (res && res.data.success) {
                    setPlaylist(res.data.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [aulaId]);

    // Função para marcar aula como concluída
    const handleMarcarComoVista = async () => {
        setMarcarMsg("");
        try {
            const res = await axios.post(
                `http://localhost:3000/progresso-aula/marcar-aula-concluida/${aulaId}`,
                {},
                { headers: authHeader() }
            );
            if (res.data.success) {
                setMarcada(true);
                setMarcarMsg("Aula marcada como concluída!");
            } else {
                setMarcarMsg(res.data.message || "Não foi possível marcar a aula.");
            }
        } catch (err) {
            setMarcarMsg("Erro ao marcar aula como concluída.");
        }
    };

    // Função para buscar documentos da aula
    const handleVerDocumentos = () => {
        setShowModal(true);
        axios.get(
            `http://localhost:3000/documento-aula/${aulaId}/ficheiros`,
            { headers: authHeader() }
        )
            .then(res => {
                if (res.data.success) {
                    setDocumentos(res.data.ficheiros);
                } else {
                    setDocumentos([]);
                }
            })
            .catch(() => setDocumentos([]));
    };

    if (loading) {
        return (
            <div className="container2 mt-5 text-center">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    if (!aula) {
        return (
            <div className="container2 mt-5 text-center">
                <p className="text-danger">Aula não encontrada.</p>
            </div>
        );
    }

    function userCanDelete(doc) {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && (user.role === "gestor" || user.id === doc.utilizadorId);
    }

    function getEmbedUrl(url) {
        if (!url) return "https://www.youtube.com/embed/IHMOu_KEW-0";
        // Se já for embed, retorna como está
        if (url.includes("embed")) return url;
        // Extrai o ID do vídeo
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/))([\w-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url; // fallback
    }

    useEffect(() => {
        document.title = "Aula / SoftSkills";
    }, []);

    return (
        <>

            <div className="container-fluid m-0 p-0">
                <div className="container2 mt-4 mb-5">
                    <div className="row g-4 justify-content-center">
                        {/* Vídeo e Playlist */}
                        <div className="col-12 col-lg-8 d-flex flex-column align-items-center">
                            <div className="rounded-4 shadow-lg bg-white p-3 mb-4 w-100">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={getEmbedUrl(aula.videoLink)}
                                    title="Vídeo da Aula"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-4 shadow-sm"
                                    style={{ maxHeight: 400, objectFit: "cover" }}
                                />

                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mt-3">
                                    <p className="blue-text fw-bold mb-2 mb-md-0 fs-5 text-center w-100">
                                        Aula Nº{numeroAulaNoCurso} - {aula.tituloAssincrona}
                                    </p>
                                </div>
                                <p className="d-flex justify-content-center blue-text">{aula.descricaoAssincrona}</p>
                                <div className="d-flex justify-content-center w-100 mb-3 mt-3">
                                    <button
                                        className="btn btn-success rounded-pill"
                                        onClick={handleMarcarComoVista}
                                        disabled={marcada}
                                    >
                                        {marcada ? "Aula já marcada" : "Marcar como vista"}
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center w-100 mb-3 mt-3">
                                    <button className="btn btn-primary rounded-pill" onClick={handleVerDocumentos}>
                                        Ver Documentos
                                    </button>
                                </div>
                            </div>
                            <div className="row rounded-4 shadow-lg bg-white p-3 w-100 m-0">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="blue-text fw-bold mb-0">Playlist Disponível</h4>
                                    <span className="blue-text">{outrasAulas.length} vídeos</span>
                                </div>
                                <div className="col-12 row justify-content-center m-0 p-0">
                                    <div className="col-1"></div>
                                    <div className="col-5 overflow-y-auto" style={{ maxHeight: 220 }}>
                                        {outrasAulas.length === 0 ? (
                                            <p className="text-center text-muted">Nenhuma outra aula disponível.</p>
                                        ) : (
                                            outrasAulas.map((item) => {
                                                // Calcula o número da aula na playlist
                                                const numeroAula = playlist.findIndex(a => a.id === item.id) + 1;
                                                return (
                                                    <div key={item.id} className="d-flex align-items-center mb-3">
                                                        <img className="me-3" src="/img/icon-video.png" alt="Ícone vídeo" style={{ width: 32, height: 32 }} />
                                                        <Link
                                                            className="blue-text mb-0"
                                                            to={`/verAula/${item.id}`}
                                                            style={{
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                display: "block",
                                                                maxWidth: "325px"
                                                            }}
                                                        >
                                                            Aula Nº{numeroAula} - {item.tituloAssincrona}
                                                        </Link>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Documentos */}
                {showModal && (
                    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Documentos da Aula</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {documentos.length === 0 ? (
                                        <p className="text-muted">Nenhum documento disponível para esta aula.</p>
                                    ) : (
                                        <ul className="list-group">
                                            {documentos.map(doc => (
                                                <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>
                                                        <i className="bi bi-file-earmark me-2"></i>
                                                        {doc.nomeOriginal}
                                                        <span className="badge bg-light text-dark ms-2">{doc.tipo}</span>
                                                    </span>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary ms-2">
                                                        Ver ficheiro
                                                    </a>
                                                    {userCanDelete(doc) && (
                                                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDeleteDocumento(doc.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default VerAula;