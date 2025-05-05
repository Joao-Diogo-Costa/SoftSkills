import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MainView() {

    return (
        <div className="container-fluid p-0 m-0">
            <div className="row col-md-12 align-items-center bg-blue-grad m-0">
                <div className="row col-md-6 col-sm-6 d-flex flex-grow-1 justify-content-center align-items-center">
                    <h3 className="col-md-10 col-sm-10 texto ms-5 me-5">
                        Aprende de forma simples, rápida e onde quiseres!
                    </h3>
                    <p className="col-md-10 col-sm-10 texto-pequeno ms-5 me-5 mt-3">
                        Com a nossa plataforma, podes aprender o que quiseres, onde quiseres
                        e quando quiseres. Aprende de forma simples e rápida com os nossos
                        cursos.
                    </p>
                    <div className="col-md-10 col-sm-10 mt-3 mb-3">
                        <button className="btn btn-primary">Regista-te</button>
                    </div>
                </div>
                <div className="row col-md-6 d-none d-md-block">
                    <img src="/img/woman.png" alt="Woman" className="col-md-11" />
                </div>
            </div>

            <div className="row col-md-12 mt-5">
                <h1
                    className="col-md-6 fw-bold text-center mt-3"
                    style={{ color: "#39639D", fontSize: "38px" }}
                >
                    Tu defines o objetivo. Nós traçamos o caminho.
                </h1>
                <div className="col-md-6 text-center" style={{ color: "#39639D" }}>
                    O progresso na carreira nem sempre é linear. Quando a tua área evolui
                    ou os teus planos mudam, a SOFTINSA é o destino educativo que trabalha
                    tão arduamente quanto tu. Explora milhares de cursos online relevantes
                    para o mercado de trabalho que te ajudam a avançar, redirecionar ou
                    recomeçar. Estaremos contigo em cada passo do caminho.
                </div>
            </div>

            <div
                className="row p-0 d-flex justify-content-center"
                style={{
                    borderBottom: "#39639D solid 2px",
                    borderTop: "#39639D solid 2px",
                    marginTop: "3%",
                }}
            >
                <div className="col-md-6 row d-flex justify-content-center">
                    <button
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                    >
                        Populares
                    </button>
                    <button
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                    >
                        Novos
                    </button>
                    <button
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                    >
                        Vistos
                    </button>
                </div>
            </div>

            <div className="row mt-5 d-flex justify-content-center" style={{ width: '100%' }}>
                <div className="col-md-4 d-flex justify-content-center">
                    <div className="d-flex justify-content-center">
                        <img src="/img/curs-javascriptAvan;ado.png" className="rounded-4" alt="Curso Javascript Avançado" />
                        <p className="fw-bold mb-0 mt-2" style={{ color: '#39639D' }}>Javascript Avançado 2025</p>
                        <p style={{ color: '#39639D' }}>Torna-te um expert em HTML5 com apenas um curso.</p>
                        <div
                            className="row  bg-white border shadow-lg rounded-4 d-flex align-items-center"
                            style={{ maxWidth: '60%', maxHeight: '50%' }}
                        >
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-alunos.svg" alt="Ícone Alunos" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Inscritos</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>161 alunos</p>
                                </div>
                            </div>

                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-tempo.svg" alt="Ícone Tempo" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Tempo</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>25 horas</p>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-certificado.svg" alt="Ícone Certificado" />
                                <div>
                                    <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Certificado</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>Sim</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center">
                    <div className="d-flex justify-content-center">
                        <img src="/img/curs-javascriptAvan;ado.png" className="rounded-4" alt="Curso Javascript Avançado" />
                        <p className="fw-bold mb-0 mt-2" style={{ color: '#39639D' }}>Javascript Avançado 2025</p>
                        <p style={{ color: '#39639D' }}>Torna-te um expert em HTML5 com apenas um curso.</p>
                        <div
                            className="row container bg-white border shadow-lg rounded-4 d-flex align-items-center"
                            style={{ maxWidth: '60%', maxHeight: '50%' }}
                        >
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-alunos.svg" alt="Ícone Alunos" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Inscritos</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>161 alunos</p>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-tempo.svg" alt="Ícone Tempo" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Tempo</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>25 horas</p>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-certificado.svg" alt="Ícone Certificado" />
                                <div>
                                    <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Certificado</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>Sim</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center">
                    <div className="d-flex justify-content-center">
                        <img src="/img/curs-javascriptAvan;ado.png" className="rounded-4" alt="Curso Javascript Avançado" />
                        <p className="fw-bold mb-0 mt-2" style={{ color: '#39639D' }}>Javascript Avançado 2025</p>
                        <p style={{ color: '#39639D' }}>Torna-te um expert em HTML5 com apenas um curso.</p>
                        <div
                            className="row container bg-white border shadow-lg rounded-4 d-flex align-items-center"
                            style={{ maxWidth: '60%', maxHeight: '50%' }}
                        >
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-alunos.svg" alt="Ícone Alunos" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Inscritos</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>161 alunos</p>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-tempo.svg" alt="Ícone Tempo" />
                                <div>
                                    <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Tempo</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>25 horas</p>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <img src="/img/icon-certificado.svg" alt="Ícone Certificado" />
                                <div>
                                    <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Certificado</p>
                                    <p className="text-center" style={{ color: '#39639D' }}>Sim</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row container-fluid p-0" style={{ marginTop: "10%" }}>
                <div className="col-md-6 ms-5">
                    <div className="d-flex align-items-end">
                        <div className="d-flex justify-content-center">
                            <p
                                className="fw-bold mb-0"
                                style={{ fontSize: "96px", color: "#39639D" }}
                            >
                                Vocês escolheram!
                            </p>
                            <p className="" style={{ fontSize: "32px", color: "#39639D" }}>
                                Curso do mês!
                            </p>
                        </div>
                    </div>
                    <div className="row mt-5 d-flex align-items-center">
                        <div className="col-md-6">
                            <img
                                src="/img/MariaDB.png"
                                alt="MariaDB"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="column col-md-6">
                            <h3 className="fw-bold" style={{ color: "#39639D" }}>
                                MariaDB - Base de dados Avançado 2025
                            </h3>
                            <p style={{ color: "#39639D" }}>
                                Torna-te um expert em MariaDB com apenas um curso.
                            </p>
                            <button class="btn btn-primary mb-3">Continuar curso</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <img src="/img/Man.png" alt="Man" />
                </div>
            </div>

            <footer
                className="text-light text-center py-3"
                style={{ backgroundColor: "#40659d" }}
            >
                &copy; 2025 Meu Site. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default MainView;
