import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";


function MainView() {
    const [cursos, setCursos] = useState([]);
    const [cursoDoMes, setCursoDoMes] = useState(null);


    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/curso/list")
            .then(res => {
                if (res.data.success) setCursos(res.data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar cursos:", err);
            });
    }, []);

    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/curso/mais-popular-mes")
            .then(res => {
                if (res.data.success && res.data.data) {
                    setCursoDoMes(res.data.data);
                } else {
                    setCursoDoMes(null);
                }
            })
            .catch(() => setCursoDoMes(null));
    }, []);


    return (
        <>
            <Helmet>
                <title>SoftSkills</title>
            </Helmet>

            <div className="default-container p-0 m-0">
                <div className="row col-md-12 align-items-center bg-blue-grad m-0"
                style={{ minHeight: "100vh" }}
                >
                    <div className="row col-md-6 col-sm-6 d-flex flex-grow-1 justify-content-center align-items-center mt-1">
                        <h3 className="col-md-10 col-sm-10 texto ms-5 me-5">
                            Aprende de forma simples, rápida e onde quiseres!
                        </h3>
                        <p className="col-md-10 col-sm-10 texto-pequeno ms-5 me-5 mt-3">
                            Com a nossa plataforma, podes aprender o que quiseres, onde quiseres
                            e quando quiseres. Aprende de forma simples e rápida com os nossos
                            cursos.
                        </p>
                        <div className="col-md-10 col-sm-10 mt-3 mb-3">
                            <Link className="btn btn-primary" to={"/signUp"}>Regista-te</Link>
                        </div>
                    </div>
                    <div className="row col-md-6 d-none d-md-block mt-1">
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
                        <Link
                            className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                            style={{ fontSize: "20px" }}
                            to={"/categorias?ordenarPor=popularidade"}
                        >
                            Populares
                        </Link>
                        <Link
                            className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                            style={{ fontSize: "20px" }}
                            to={"/categorias?ordenarPor=data"}
                        >
                            Novos
                        </Link>
                    </div>
                </div>

                <div className="row mt-5 d-flex justify-content-center w-100 m-0 p-0 text-decoration-none" >
                    {[...cursos]
                        .sort((a, b) => (b.numParticipante || 0) - (a.numParticipante || 0))
                        .slice(0, 3)
                        .map((curso) => (
                        <div key={curso.id} className="col-md-4 d-flex justify-content-center mb-3">
                            <Link className="row d-flex justify-content-center text-decoration-none" to={`/curso/${curso.id}`}>
                                <img
                                    src={curso.imagemBanner || "/img/curs-javascriptAvan;ado.png"}
                                    className="rounded-5"
                                    alt={curso.nome}
                                    style={{
                                        width: "100%",
                                        height: "300px",     
                                        objectFit: "cover",   
                                        objectPosition: "center"
                                    }}
                                />
                                <p className="fw-bold mb-0 mt-2 text-center" style={{ color: '#39639D' }}>{curso.nome}</p>
                                <p className="blue-text text-center ms-3">{curso.descricaoCurso}</p>
                                <div
                                    className="row bg-white border shadow-lg rounded-4 d-flex align-items-center"
                                    style={{ maxWidth: '60%', maxHeight: '50%' }}
                                >
                                    <div className="col-md-4 col-4 d-flex justify-content-center">
                                        <img src="/img/icon-alunos.svg" alt="Ícone Alunos" />
                                        <div>
                                            <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Inscritos</p>
                                            <p className="text-center" style={{ color: '#39639D' }}>{curso.numParticipante || 0}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-4 col-4 d-flex justify-content-center">
                                        <img src="/img/icon-nivel.svg" alt="Ícone Nivel" />
                                        <div>
                                            <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Nivel</p>
                                            <p className="text-center" style={{ color: '#39639D' }}>{curso.nivel || "---"}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-4 d-flex justify-content-center">
                                        <img src="/img/icon-certificado.svg" alt="Ícone Certificado" />
                                        <div>
                                            <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Certificado</p>
                                            <p className="text-center" style={{ color: '#39639D' }}>Sim</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Curso do mês */}
                <div className="row p-0 justify-content-center align-items-center text-center" style={{ marginTop: "5%" }}>
                    {cursoDoMes ? (
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
                                        src={cursoDoMes.imagemBanner || "/img/MariaDB.png"}
                                        alt={cursoDoMes.nome}
                                        className="img-fluid rounded-4"
                                    />
                                </div>
                                <div className="col-md-4 col-10 text-center text-md-start">
                                    <h3 className="fw-bold" style={{ color: "#39639D" }}>
                                        {cursoDoMes.nome}
                                    </h3>
                                    <p style={{ color: "#39639D" }}>
                                        {cursoDoMes.descricaoCurso}
                                    </p>
                                    <Link className="btn btn-primary mb-3" to={`/curso/${cursoDoMes.id}`}>Ver Curso</Link>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                <div className="col-12 text-center" style={{ color: "#39639D" }}>
                                    Ainda não há curso do mês!
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MainView;