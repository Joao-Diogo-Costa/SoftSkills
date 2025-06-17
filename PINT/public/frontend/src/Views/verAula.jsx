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
    const outrasAulas = aula
        ? playlist.filter(item => item.id !== aula.id)
        : [];

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/aula-assincrona/get/${aulaId}`)
            .then(res => {
                if (res.data.success) {
                    setAula(res.data.data);
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

    return (
        <div className="container-fluid m-0 p-0">
            <div className="container2 mt-4 mb-5">
                <div className="row g-4 justify-content-center">
                    {/* Vídeo e Playlist */}
                    <div className="col-12 col-lg-8 d-flex flex-column align-items-center">
                        <div className="rounded-4 shadow-lg bg-white p-3 mb-4 w-100">
                            <iframe
                                width="100%"
                                height="400"
                                src="https://www.youtube.com/embed/IHMOu_KEW-0"
                                title="Vídeo da Aula"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-4 shadow-sm"
                                style={{ maxHeight: 400, objectFit: "cover" }}
                            />

                            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mt-3">
                                <p className="blue-text fw-bold mb-2 mb-md-0 fs-5 text-center w-100">
                                    Aula Nº{aula.id} - {aula.tituloAssincrona}
                                </p>
                            </div>
                            <p className="d-flex justify-content-center blue-text">{aula.descricaoAssincrona}</p>
                            <div className="d-flex justify-content-center w-100 mb-3 mt-3">
                                <button className="btn btn-primary rounded-pill">
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
                                        outrasAulas.map((item) => (
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
                                                        maxWidth: "325px" // ajusta conforme o layout
                                                    }}
                                                >
                                                    Aula Nº{item.id} - {item.tituloAssincrona}
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerAula;