import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Perfil() {
    const navigate = useNavigate();
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [isEditProfileSuccessModalOpen, setEditProfileSuccessModalOpen] = useState(false);

    function handleEditProfile() {
        console.log("A editar informações de perfil...");
        // Aqui você faria a chamada para sua função real de editar perfil

        // Fechar o modal de edição e abrir o modal de sucesso
        setEditProfileModalOpen(false);
        setEditProfileSuccessModalOpen(true);
    }
    function closeEditProfileSuccessModal() {
        setEditProfileSuccessModalOpen(false);
    }


    return (
        <div>
            <div className="scrollbar" style={{ height: 'min-content' }} />
            <nav className="navbar navbar-expand-lg bg-blue-perfil border-bottom border-secondary shadow-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand me-0 ms-4" to={"/"}>
                        <img src="/img/Logo-white.png" alt style={{ cursor: 'pointer' }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 w-100">
                            <li className="nav-item mx-auto mt-2 fs-5 fw-bold">
                                <a className="nav-link blue-text underline-animation" style={{ color: 'white' }} href="#">Categorias</a>
                            </li>
                            <li className="nav-item mx-auto mt-2 fs-5 fw-bold">
                                <Link className="nav-link blue-text underline-animation" style={{ color: 'white' }} to={"/topicos"}>Tópicos</Link>
                            </li>
                            <form className="input-group mx-auto border border-secondary border-opacity-50 rounded-pill shadow w-50 bg-white" role="search" style={{ height: 50, marginTop: 5 }}>
                                <span className="input-group-text bg-transparent border-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>
                                </span>
                                <input className="form-control no-outline bg-transparent border-0" type="search" placeholder="Procurar" aria-label="Search" />
                            </form>
                            <li className="nav-item d-flex align-items-center">
                                <img src="/img/profile-picture.png" alt="profile-picture" className="me-3" style={{ width: 50, height: 50, borderRadius: '50%' }} onClick={() => navigate("/perfil")} />
                                <Link to={"/perfil"} style={{ textDecoration: 'none' }}>
                                    <div className="d-flex flex-column">
                                        <a href="perfil.html" className="fw-bold text-decoration-none" style={{ color: 'white' }}>Francisco
                                            Duarte</a>
                                        <a href="perfil.html" className="grey-text text-decoration-none">franciscopereira312@gmail.com</a>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
            <div className="container2 mt-4">
                <div className="bg-translucent rounded d-flex justify-content-center">
                    <div className="container-fluid row" style={{ height: 335 }}>
                        <div className="row col-md-6 align-items-center ms-2" style={{ height: '100%' }}>
                            <img src="/img/profile-picture-BIG.png" className="col-md-4 ms-2" style={{ height: 209 }} alt />
                            <div className="col-md-6">
                                <div className>
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
                                        <img src="/img/trophy.svg" className="col-auto" style={{ height: 25 }} alt />
                                        <img src="/img/medal.svg" className="col-auto" style={{ height: 25 }} alt />
                                        <img src="/img/rankingsIcon.svg" className="col-auto" style={{ height: 25 }} alt />
                                    </div>
                                </div>
                                <p className="mb-0 fw-bold" style={{ marginTop: '10%', color: '#39639d' }}>
                                    Data de registo 01/01/2025
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex row justify-content-end h-100">
                            <p className="text-end grey-text">Viseu, Portugal</p>
                            <div className="d-flex justify-content-end align-items-center">
                                <button className="btn w-25" style={{ backgroundColor: '#39639d', height: '25%', color: 'white', cursor: 'pointer' }} onClick={() => setEditProfileModalOpen(true)}>
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
                    <div className="container-fluid row mt-5 bg-translucent p-0">
                        <div className="col-md-12 barra p-0" />
                        <h5 className="fw-bold mt-4" style={{ color: '#39639d' }}>Percurso Formativo</h5>
                        <p className="grey-text">
                            Todas as informações disponíveis estão listadas abaixo
                        </p>
                        <div className="container-fluid row mt-5 bg-translucent p-0 m-0" style={{ maxHeight: 600, overflowY: 'auto' }}>
                            <div className="container-fluid row mt-5 p-0">
                                <div className="col-md-3 d-flex align-items-center">
                                    <img src="/img/curso-mariadb.png" className alt />
                                </div>
                                <div className="row col-md-4">
                                    <div className="col-md-6">
                                        <p className="fw-bold" style={{ color: '#39639d' }}>
                                            MariaDB - Base de dados Avançado 2025
                                        </p>
                                        <p className="grey-text">Formador: Marco Roberto</p>
                                        <p style={{ color: '#39639d' }}>
                                            Data de registo <strong>05/01/2025</strong>
                                        </p>
                                    </div>
                                    <div className="d-flex col-md-6 align-items-end">
                                        <p style={{ color: '#39639d' }}>
                                            Data de término <strong>POR TERMINAR</strong>
                                        </p>    
                                    </div>
                                </div>
                                <div className="col-md-5 row ms-auto p-0">
                                    <div className="col-md-2" />
                                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                                        <button className="col-md-3 btn" style={{ width: '80%', fontSize: 15, backgroundColor: '#bdcde3', color: 'white' }}>
                                            Transferir Certificado
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="container border border-secondary border-opacity-50 rounded-4" style={{ height: '90%', width: '80%' }}>
                                            <div className="mt-3">
                                                <p className="mb-0 text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '50%', fontSize: 16, color: '#39639d' }}>
                                                    Nota Final
                                                </p>
                                                <p className="d-flex justify-content-center align-items-end fs-lg fw-bold" style={{ height: 50, color: '#39639d', fontSize: 40 }}>
                                                    ???
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid row mt-5 p-0">
                                <div className="col-md-3 d-flex align-items-center">
                                    <img src="/img/curso-java.png" alt />
                                </div>
                                <div className="row col-md-4">
                                    <div className="col-md-6">
                                        <p className="fw-bold" style={{ color: '#39639d' }}>
                                            Javascript - Curso avançado
                                        </p>
                                        <p className="grey-text">Formador: Sem Formador</p>
                                        <p style={{ color: '#39639d' }}>
                                            Data de registo <strong>05/01/2025</strong>
                                        </p>
                                    </div>
                                    <div className="d-flex col-md-6 align-items-end">
                                        <p style={{ color: '#39639d' }}>
                                            Data de término <strong>POR TERMINAR</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5 row ms-auto p-0">
                                    <div className="col-md-2" />
                                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                                        <button className="col-md-3 btn" style={{ width: '80%', fontSize: 15, backgroundColor: '#bdcde3', color: 'white' }}>
                                            Transferir Certificado
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="container border border-secondary border-opacity-50 rounded-4" style={{ height: '90%', width: '80%' }}>
                                            <div className="mt-3">
                                                <p className="mb-0 text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '50%', fontSize: 16, color: '#39639d' }}>
                                                    Nota Final
                                                </p>
                                                <p className="d-flex justify-content-center align-items-end fs-lg fw-bold" style={{ height: 50, color: '#39639d', fontSize: 40 }}>
                                                    ???
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid row mt-5 p-0">
                                <div className="col-md-3 d-flex align-items-center">
                                    <img src="/img/curso-kotlin.png" alt />
                                </div>
                                <div className="row col-md-4">
                                    <div className="col-md-6">
                                        <p className="fw-bold" style={{ color: '#39639d' }}>Kotlin - O futuro</p>
                                        <p className="grey-text">Formador: Leandro Loureiro</p>
                                        <p style={{ color: '#39639d' }}>
                                            Data de registo <strong>05/01/2025</strong>
                                        </p>
                                    </div>
                                    <div className="d-flex col-md-6 align-items-end">
                                        <p style={{ color: '#39639d' }}>
                                            Data de término <strong>10/01/2025</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5 row ms-auto p-0">
                                    <div className="col-md-2" />
                                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                                        <button className="col-md-3 btn" style={{ width: '80%', fontSize: 15, backgroundColor: '#39639d', color: 'white' }}>
                                            Transferir Certificado
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="container border border-secondary border-opacity-50 rounded-4" style={{ height: '90%', width: '80%' }}>
                                            <div className="mt-3">
                                                <p className=" text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '50%', fontSize: 16, color: '#39639d' }}>
                                                    Nota Final
                                                </p>
                                                <p className="d-flex justify-content-center align-items-start fs-lg fw-bold" style={{ height: 50, color: '#39639d', fontSize: 40 }}>
                                                    18
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid row mt-5 p-0">
                                <div className="col-md-3 d-flex align-items-center">
                                    <img src="/img/curso-kotlin.png" alt />
                                </div>
                                <div className="row col-md-4">
                                    <div className="col-md-6">
                                        <p className="fw-bold" style={{ color: '#39639d' }}>Kotlin - O futuro</p>
                                        <p className="grey-text">Formador: Leandro Loureiro</p>
                                        <p style={{ color: '#39639d' }}>
                                            Data de registo <strong>05/01/2025</strong>
                                        </p>
                                    </div>
                                    <div className="d-flex col-md-6 align-items-end">
                                        <p style={{ color: '#39639d' }}>
                                            Data de término <strong>10/01/2025</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5 row ms-auto p-0">
                                    <div className="col-md-2" />
                                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                                        <button className="col-md-3 btn" style={{ width: '80%', fontSize: 15, backgroundColor: '#39639d', color: 'white' }}>
                                            Transferir Certificado
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="container border border-secondary border-opacity-50 rounded-4" style={{ height: '90%', width: '80%' }}>
                                            <div className="mt-3">
                                                <p className=" text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '50%', fontSize: 16, color: '#39639d' }}>
                                                    Nota Final
                                                </p>
                                                <p className="d-flex justify-content-center align-items-start fs-lg fw-bold" style={{ height: 50, color: '#39639d', fontSize: 40 }}>
                                                    18
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid row mt-5 p-0">
                                <div className="col-md-3 d-flex align-items-center">
                                    <img src="/img/curso-java.png" alt />
                                </div>
                                <div className="row col-md-4">
                                    <div className="col-md-6">
                                        <p className="fw-bold" style={{ color: '#39639d' }}>
                                            Javascript - Curso avançado
                                        </p>
                                        <p className="grey-text">Formador: Sem Formador</p>
                                        <p style={{ color: '#39639d' }}>
                                            Data de registo <strong>05/01/2025</strong>
                                        </p>
                                    </div>
                                    <div className="d-flex col-md-6 align-items-end">
                                        <p style={{ color: '#39639d' }}>
                                            Data de término <strong>POR TERMINAR</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5 row ms-auto p-0">
                                    <div className="col-md-2" />
                                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                                        <button className="col-md-3 btn" style={{ width: '80%', fontSize: 15, backgroundColor: '#bdcde3', color: 'white' }}>
                                            Transferir Certificado
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="container border border-secondary border-opacity-50 rounded-4" style={{ height: '90%', width: '80%' }}>
                                            <div className="mt-3">
                                                <p className="mb-0 text-center fw-bold d-flex justify-content-center align-items-center" style={{ height: '50%', fontSize: 16, color: '#39639d' }}>
                                                    Nota Final
                                                </p>
                                                <p className="d-flex justify-content-center align-items-end fs-lg fw-bold" style={{ height: 50, color: '#39639d', fontSize: 40 }}>
                                                    ???
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-light text-center py-3 mt-4" style={{ backgroundColor: '#40659d' }}>
                © 2025 SOFTINSA Todos os direitos reservados.
            </footer>
        </div >

    );
}

export default Perfil;