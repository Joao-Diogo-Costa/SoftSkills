import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PaginaInicial() {
    const navigate = useNavigate();

    return (
        <div className="row container-fluid min-vh-100 m-0 p-0">
            <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-secondary shadow-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand me-0 ms-4" to="/">
                        <img
                            src="/img/Logo.png"
                            alt="Logo"
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
                            <li className="nav-item mx-auto mt-2 fs-5 fw-bold">
                                <Link className="nav-link blue-text underline-animation" to="/">
                                    Categorias
                                </Link>
                            </li>
                            <li className="nav-item mx-auto mt-2 fs-5 fw-bold">
                                <Link className="nav-link blue-text underline-animation" to="/">
                                    Tópicos
                                </Link>
                            </li>
                            <form
                                className="input-group d-flex mx-auto border border-secondary border-opacity-50 rounded-pill shadow w-50"
                                role="search"
                            >
                                <span className="input-group-text bg-transparent border-0">
                                    <img
                                        src="/img/Icon-lupa.png"
                                        alt="Lupa"
                                        className="img-fluid"
                                    />
                                </span>
                                <input
                                    className="form-control no-outline bg-transparent border-0"
                                    type="search"
                                    placeholder="Procurar"
                                    aria-label="Search"
                                />
                            </form>
                            <li className="nav-item d-flex align-items-center">
                                <img
                                    src="/img/profile-picture.png"
                                    alt="profile-picture"
                                    className="me-3"
                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                    onClick={() => navigate("/perfil")}
                                />
                                <div className="d-flex flex-column">
                                    <Link to="/perfil" className="fw-bold text-decoration-none">
                                        Francisco Duarte
                                    </Link>
                                    <Link to="/perfil" className="grey-text text-decoration-none">
                                        franciscopereira312@gmail.com
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="default-container">
                <h2 className="container-fluid mb-3 blue-text fw-bold" style={{ marginTop: "2%" }}>
                    Cursos Vistos Recentemente
                </h2>
                <div className="container-fluid" style={{ marginBottom: "6%" }}>
                    <div className="row">
                        <div className="row col-md-6 d-flex align-items-center">
                            <div className="col-md-6">
                                <img src="/img/MariaDB.png" alt="MariaDB" style={{ width: "100%" }} />
                            </div>
                            <div className="column col-md-6 blue-text">
                                <h3 className="fw-bold">MariaDB - Base de dados Avançado 2025</h3>
                                <p>Torna-te um expert em MariaDB com apenas um curso.</p>
                                <button className="btn btn-primary mb-3">Continuar curso</button>
                            </div>
                        </div>
                        <div className="row col-md-6 d-flex align-items-center">
                            <div className="col-md-6">
                                <img src="/img/MariaDB.png" alt="MariaDB" style={{ width: "100%" }} />
                            </div>
                            <div className="column col-md-6 blue-text">
                                <h3 className="fw-bold">MariaDB - Base de dados Avançado 2025</h3>
                                <p>Torna-te um expert em MariaDB com apenas um curso.</p>
                                <button className="btn btn-primary mb-3">Continuar curso</button>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="container-fluid mb-3 blue-text fw-bold">Cursos Populares</h2>
                <div className="container-fluid row d-flex justify-content-around p-0 gap-5">
                    <div className=" row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                        <Link className="p-0" to={"/"} style={{ textDecoration: 'none' }}>
                            <div className="p-0">
                                <img src="/img/CursoPython.png" style={{ width: '100%' }} alt="Python" />
                            </div>
                        </Link>
                        <div className="card-body blue-text">
                            <h3 className="card-title fw-bold fw-bold">Tudo sobre python</h3>
                            <p className="card-text">Torna-te um expert em HTML5 com apenas um curso.</p>
                            <p className="card-text d-flex justify-content-end mt-5">(120 participantes)</p>
                        </div>
                    </div>
                    <div className=" row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                        <Link className="p-0" to={"/"} style={{ textDecoration: 'none' }}>
                            <div className="p-0">
                                <img src="/img/CursoPython.png" style={{ width: '100%' }} alt="Python" />
                            </div>
                        </Link>
                        <div className="card-body blue-text">
                            <h3 className="card-title fw-bold fw-bold">Tudo sobre python</h3>
                            <p className="card-text">Torna-te um expert em HTML5 com apenas um curso.</p>
                            <p className="card-text d-flex justify-content-end mt-5">(120 participantes)</p>
                        </div>
                    </div>
                    <div className=" row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                        <Link className="p-0" to={"/"} style={{ textDecoration: 'none' }}>
                            <div className="p-0">
                                <img src="/img/CursoPython.png" style={{ width: '100%' }} alt="Python" />
                            </div>
                        </Link>
                        <div className="card-body blue-text">
                            <h3 className="card-title fw-bold fw-bold">Tudo sobre python</h3>
                            <p className="card-text">Torna-te um expert em HTML5 com apenas um curso.</p>
                            <p className="card-text d-flex justify-content-end mt-5">(120 participantes)</p>
                        </div>
                    </div>
                    <div className=" row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                        <Link className="p-0" to={"/"} style={{ textDecoration: 'none' }}>
                            <div className="p-0">
                                <img src="/img/CursoPython.png" style={{ width: '100%' }} alt="Python" />
                            </div>
                        </Link>
                        <div className="card-body blue-text">
                            <h3 className="card-title fw-bold fw-bold">Tudo sobre python</h3>
                            <p className="card-text">Torna-te um expert em HTML5 com apenas um curso.</p>
                            <p className="card-text d-flex justify-content-end mt-5">(120 participantes)</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row container-fluid p-0" style={{ marginTop: "10%" }}>
                <div className="col-md-6 ms-5">
                    <div className="d-flex align-items-end">
                        <div className="d-flex justify-content-center">
                            <p className="fw-bold mb-0" style={{ fontSize: "96px", color: "#39639D" }}>
                                Vocês escolheram!
                            </p>
                            <p className="" style={{ fontSize: "32px", color: "#39639D" }}>
                                Curso do mês!
                            </p>
                        </div>
                    </div>
                    <div className="row mt-5 d-flex align-items-center">
                        <div className="col-md-6">
                            <img src="/img/MariaDB.png" alt="MariaDB" style={{ width: "100%" }} />
                        </div>
                        <div className="column col-md-6">
                            <h3 className="fw-bold" style={{ color: "#39639D" }}>
                                MariaDB - Base de dados Avançado 2025
                            </h3>
                            <p style={{ color: "#39639D" }}>Torna-te um expert em MariaDB com apenas um curso.</p>
                            <button className="btn btn-primary mb-3">Continuar curso</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <img src="/img/Man.png" alt="Man" />
                </div>
            </div>
            <footer className="text-light text-center py-3" style={{ backgroundColor: "#40659d" }}>
                &copy; 2025 Meu Site. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default PaginaInicial;