import React, { useState, useEffect } from "react"; import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MainView() {
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
        <div className="default-container p-0 m-0">
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
                        <Link className="btn btn-primary" to={"/login"}>Regista-te</Link>
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
                    <Link
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                        to={"/categorias"}
                    >
                        Populares
                    </Link>
                    <Link
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                        to={"/categorias"}
                    >
                        Novos
                    </Link>
                    <Link
                        className="col-md-3 btn botao-light rounded-0 border-0 fw-normal"
                        style={{ fontSize: "20px" }}
                        to={"/categorias"}
                    >
                        Vistos
                    </Link>
                </div>
            </div>

            <Link className="row mt-5 d-flex justify-content-center w-100 m-0 p-0 text-decoration-none" >
                {cursos.slice(0, 3).map((curso) => (
                    <div key={curso.id} className="col-md-4 d-flex justify-content-center mb-3">
                        <div className="row d-flex justify-content-center">
                            <img src={curso.imagemBanner || "/img/curs-javascriptAvan;ado.png"} className="rounded-5 " alt={curso.nome} />
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
                                        <p className="text-center" style={{ color: '#39639D' }}>{curso.participantes || 0}</p>
                                    </div>
                                </div>

                                <div className="col-md-4 col-4 d-flex justify-content-center">
                                    <img src="/img/icon-tempo.svg" alt="Ícone Tempo" />
                                    <div>
                                        <p className="fw-bold mb-0" style={{ color: '#39639D' }}>Tempo</p>
                                        <p className="text-center" style={{ color: '#39639D' }}>{curso.duracao || "25 horas"}</p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-4 d-flex justify-content-center">
                                    <img src="/img/icon-certificado.svg" alt="Ícone Certificado" />
                                    <div>
                                        <p className="fw-bold mb-0 text-center" style={{ color: '#39639D' }}>Certificado</p>
                                        <p className="text-center" style={{ color: '#39639D' }}>{curso.certificado ? "Sim" : "Não"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Link>

            <div className="row p-0 justify-content-center align-items-center text-center" style={{ marginTop: "5%" }}>
                {cursos.slice(0, 1).map((curso) => (
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
                        <div key={curso.id} className="row mt-5 mb-5 d-flex align-items-center justify-content-center">
                            <div className="col-md-3 col-8 text-center">
                                <img
                                    src={curso.imagem || "/img/MariaDB.png"}
                                    alt="MariaDB"
                                    className="img-fluid"
                                />
                            </div>
                            <div className="col-md-4 col-10 text-center text-md-start">
                                <h3 className="fw-bold" style={{ color: "#39639D" }}>
                                    {curso.nome}
                                </h3>
                                <p style={{ color: "#39639D" }}>
                                    {curso.descricaoCurso}
                                </p>
                                <Link className="btn btn-primary mb-3" to={"/curso"}>Ver Curso</Link>
                            </div>
                        </div>
                    </div>
                ))}
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