import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const VerAula = () => {
    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="default-container d-flex justify-content-center">
                <img
                    className="rounded-4 shadow-lg img-fluid mt-3"
                    src="/img/videoAula-BIG.png"
                    alt="Vídeo da Aula"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            </div>
            <div className="row container2 d-flex justify-content-center mt-4 rounded-4 shadow-lg">
                <div className="col-12 col-lg-8 mt-2">
                    <div className="row d-flex align-items-center justify-content-center">
                        <p className="col-12 col-md-7 blue-text m-0 mb-2 mb-md-0">Aula Nº1 - Título de vídeo aqui</p>
                        <button className="col-12 col-md-4 btn btn-primary rounded-pill mb-2 mb-md-0">
                            Ver Documentos
                        </button>
                    </div>
                    <div>
                        <div className="row p-0 mt-4 ms-1">
                            <h3 className="blue-text fw-bold mb-0">Playlist Disponível</h3>
                            <p className="blue-text">6 vídeos</p>
                        </div>
                    </div>
                    <div className="row p-0 m-0">
                        <div
                            className="col-12 col-md-6 shadow rounded-4 mb-3 mb-md-0"
                            style={{ maxHeight: 200, overflowY: "auto" }}
                        >
                            {[...Array(7)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="row ms-2 ms-md-4 mb-3 mt-2 d-flex align-items-center"
                                >
                                    <img
                                        className="col-2 col-md-1"
                                        src="/img/icon-video.png"
                                        alt="Ícone vídeo"
                                    />
                                    <p className="col-10 col-md-11 blue-text mb-0">
                                        Aula Nº1 - Título de vídeo aqui
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 shadow-lg rounded-4 mt-4 mt-lg-0">
                    <h3 className="blue-text fw-bold">Comentários</h3>
                    <div className="mt-3 p-0 m-0">
                        <div
                            className="overflow-x-hidden overflow-y-auto mb-2"
                            style={{ maxHeight: 300 }}
                        >
                            {[...Array(6)].map((_, idx) => (
                                <div className="row ms-2 ms-md-4 mb-4" key={idx}>
                                    <img
                                        className="col-4 col-md-3"
                                        src="/img/pfp-Mariana.png"
                                        alt="Foto perfil"
                                    />
                                    <div className="col-8 col-md-9 row">
                                        <h5 className="col-12 blue-text mb-0 mt-1 fw-bold">
                                            Mariana Almeida
                                        </h5>
                                        <p className="col-12 blue-text mb-2 mt-0 bg-translucent rounded">
                                            Gostei muito da aula! Super útil e informativa. O conteúdo é bastante recente e atualizado!
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <footer
                className="text-light text-center py-3 mt-4"
                style={{ backgroundColor: "#40659d" }}
            >
                © 2025 SOFTINSA Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default VerAula;