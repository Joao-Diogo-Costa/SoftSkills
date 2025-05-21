import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CursoCard({ imagem, nome, formador, dataRegisto, dataTermino, nota }) {
    return (
        <div className="row mt-4 p-0 ms-1 ms-md-2 align-items-center">
            <div className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-2 mb-md-0">
                <img src={imagem} className="img-fluid" alt={nome} style={{ maxHeight: 90 }} />
            </div>
            <div className="col-12 col-md-4 mb-2 mb-md-0">
                <p className="fw-bold" style={{ color: '#39639d' }}>{nome}</p>
                <p className="grey-text mb-1">Formador: {formador}</p>
                <p className="mb-1" style={{ color: '#39639d' }}>
                    Data de registo <strong>{dataRegisto}</strong>
                </p>
                <p className="mb-1" style={{ color: '#39639d' }}>
                    Data de término <strong>{dataTermino}</strong>
                </p>
            </div>
            <div className="col-12 col-md-5 row p-0 ms-1 ms-md-2">
                <div className="col-12 col-md-6 mb-2 mb-md-0 d-flex justify-content-center align-items-center">
                    <button className="btn w-100" style={{ fontSize: 15, backgroundColor: '#bdcde3', color: 'white' }}>
                        Transferir Certificado
                    </button>
                </div>
                <div className="col-12 col-md-4 mt-2 mt-md-0">
                    <div className="container border border-secondary border-opacity-50 rounded-4 p-2" style={{ width: '100%' }}>
                        <p className="mb-0 text-center fw-bold" style={{ fontSize: 16, color: '#39639d' }}>
                            Nota Final
                        </p>
                        <p className="text-center fs-lg fw-bold" style={{ color: '#39639d', fontSize: 32 }}>
                            {nota}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Perfil() {
    const navigate = useNavigate();
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [isEditProfileSuccessModalOpen, setEditProfileSuccessModalOpen] = useState(false);

    function handleEditProfile() {
        setEditProfileModalOpen(false);
        setEditProfileSuccessModalOpen(true);
    }
    function closeEditProfileSuccessModal() {
        setEditProfileSuccessModalOpen(false);
    }


    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/curso/list")
            .then(res => res.json())
            .then(data => {
                if (data.success) setCursos(data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar cursos:", err);
            });
    }, []);


    return (
        <div>
            <div className="scrollbar" style={{ height: 'min-content' }} />
            <div className="container2 mt-4">
                <div className="row bg-translucent rounded d-flex justify-content-center">
                    <div className="col-12 row" style={{ minHeight: 250 }}>
                        <div className="row col-12 col-md-6 align-items-center ms-0 ms-md-2" style={{ height: '100%' }}>
                            <img
                                src="/img/profile-picture-BIG.png"
                                className="col-4 col-md-4 ms-0 ms-md-2 img-fluid mt-3 mt-md-0 mb-2 mb-md-0"
                                style={{ height: 120, maxWidth: 120, objectFit: "cover", borderRadius: "50%" }}
                                alt="Foto de perfil"
                            />
                            <div className="col-8 col-md-6 mt-2 mt-md-0">
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#39639d' }}>
                                        Francisco Duarte
                                    </h3>
                                    <p className="blue-text mb-0 fw-bold">Formando</p>
                                    <p className="grey-text">franciscopereira312@gmail.com</p>
                                </div>
                                <div>
                                    <p className="mb-0 fw-bold fs-lg" style={{ color: '#39639d' }}>
                                        Conquistas
                                    </p>
                                    <div className="row">
                                        <img src="/img/trophy.svg" className="col-auto" style={{ height: 25 }} alt="Troféu" />
                                        <img src="/img/medal.svg" className="col-auto" style={{ height: 25 }} alt="Medalha" />
                                        <img src="/img/rankingsIcon.svg" className="col-auto" style={{ height: 25 }} alt="Ranking" />
                                    </div>
                                </div>
                                <p className="mb-0 fw-bold" style={{ marginTop: '10%', color: '#39639d' }}>
                                    Data de registo 01/01/2025
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-end align-items-end align-items-md-center h-100 mt-3 mt-md-0">
                            <p className="text-end grey-text w-100 w-md-auto">Viseu, Portugal</p>
                            <div className="d-flex justify-content-end align-items-center mt-2 mt-md-0">
                                <button className="btn w-100 w-md-25" style={{ backgroundColor: '#39639d', color: 'white', cursor: 'pointer' }} onClick={() => setEditProfileModalOpen(true)}>
                                    Editar Perfil
                                </button>
                                {isEditProfileModalOpen && (
                                    <div className="modal fade show " style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                    style={{ background: "linear-gradient(90deg, #39639D, #1C4072)" }}
                                                >
                                                    <h5 className="fw-bold">Editar Perfil</h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                    <form>
                                                        <h5 className="fw-bold fs-3 ms-4 text-start" style={{ color: '#39639D' }}>Perfil</h5>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Nome</label>
                                                            <input type="text" className="form-control text-muted" name="nome" placeholder="Francisco Duarte" required />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Palavra-passe</label>
                                                            <input type="password" className="form-control text-dark" name="password" required minLength={6} />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Confirmação de palavra-passe</label>
                                                            <input type="password" className="form-control text-dark" name="confirm_password" required minLength={6} />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light me-4"
                                                        onClick={() => setEditProfileModalOpen(false)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao"
                                                        onClick={handleEditProfile}
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isEditProfileSuccessModalOpen && (
                                    <div className="modal fade show" style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "550px" }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src="/img/success_vector.svg" alt="Ícone de sucesso" />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Sucesso</h1>
                                                    </div>
                                                    <p className="text-center fs-5">O seu perfil foi editado com sucesso</p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao rounded"
                                                        onClick={closeEditProfileSuccessModal}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 bg-translucent p-0">
                        <div className="col-md-12 barra p-0" />
                        <h5 className="fw-bold mt-4 blue-text">Percurso Formativo</h5>
                        <p className="grey-text">
                            Todas as informações disponíveis estão listadas abaixo
                        </p>
                        <div className="row mt-4 bg-translucent p-0 m-0 scrollbar-translucent" style={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}>
                            {cursos.map((curso, idx) => (
                                <CursoCard
                                    key={curso.id || idx}
                                    imagem={curso.imagem || "/img/curso-kotlin.png"}
                                    nome={curso.nome}
                                    formador={curso.formador || "Desconhecido"}
                                    dataRegisto={curso.dataRegisto || "-"}
                                    dataTermino={curso.dataTermino || "-"}
                                    nota={curso.nota || "???"}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-light text-center py-3 mt-4" style={{ backgroundColor: '#40659d' }}>
                © 2025 SOFTINSA Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default Perfil;