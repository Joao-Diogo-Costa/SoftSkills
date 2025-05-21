import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PaginaInicial() {
    const navigate = useNavigate();

    return (
        <div className="row ">
            <div className="default-container">
                <h2 className="container-fluid mb-3 blue-text fw-bold" style={{ marginTop: "2%" }}>
                    Cursos Vistos Recentemente
                </h2>
                <div className="container-fluid" style={{ marginBottom: "6%" }}>
                    <div className="row ">
                        <div className="row col-md-6 d-flex align-items-center">
                            <div className="col-md-6">
                                <img src="/img/MariaDB.png" alt="MariaDB" style={{ width: "100%" }} />
                            </div>
                            <div className="column col-md-6 blue-text text-center text-md-start mt-md-0 mt-3">
                                <h3 className="fw-bold">MariaDB - Base de dados Avançado 2025</h3>
                                <p>Torna-te um expert em MariaDB com apenas um curso.</p>
                                <button className="btn btn-primary mb-3">Continuar curso</button>
                            </div>
                        </div>
                        <div className="row col-md-6 d-flex align-items-center">
                            <div className="col-md-6">
                                <img src="/img/MariaDB.png" alt="MariaDB" style={{ width: "100%" }} />
                            </div>
                            <div className="column col-md-6 blue-text text-center text-md-start mt-md-0 mt-3">
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
            <div className="row p-0 justify-content-center align-items-center text-center" style={{ marginTop: "5%" }}>
                <div className="col-12">
                    <div className="d-flex flex-column align-items-center">
                        <div className="row d-flex justify-content-center text-center">
                            <p
                                className="col-12 fw-bold mb-0 fs-1 fs-sm-3"
                                style={{ fontSize: "70px", color: "#39639D" }}
                            >
                                Vocês escolheram!
                            </p>
                            <p className="col-12" style={{ fontSize: "32px", color: "#39639D" }}>
                                Curso do mês!
                            </p>
                        </div>
                    </div>
                    <div className="row mt-5 mb-5 d-flex align-items-center justify-content-center">
                        <div className="col-md-3 col-8 text-center">
                            <img
                                src="/img/MariaDB.png"
                                alt="MariaDB"
                                className="img-fluid"
                            />
                        </div>
                        <div className="col-md-4 col-10 text-center text-md-start">
                            <h3 className="fw-bold" style={{ color: "#39639D" }}>
                                MariaDB - Base de dados Avançado 2025
                            </h3>
                            <p style={{ color: "#39639D" }}>
                                Torna-te um expert em MariaDB com apenas um curso.
                            </p>
                            <button className="btn btn-primary mb-3">Continuar curso</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-light text-center py-3" style={{ backgroundColor: "#40659d" }}>
                &copy; 2025 Meu Site. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default PaginaInicial; 