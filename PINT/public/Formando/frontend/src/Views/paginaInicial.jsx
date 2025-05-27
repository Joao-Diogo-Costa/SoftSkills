import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PaginaInicial() {
    const navigate = useNavigate();
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
        <div className="row ">
            <div className="default-container">
                <h2 className="container-fluid mb-3 blue-text fw-bold" style={{ marginTop: "2%" }}>
                    Cursos Vistos Recentemente
                </h2>
                <div className="container-fluid" style={{ marginBottom: "6%" }}>
                    <div className="row ">
                        {cursos.slice(0, 2).map((curso) => (
                            <div key={curso.id} className="row col-md-6 d-flex align-items-center">
                                <div className="col-md-6">
                                    <img src={curso.imagemBanner || "/img/MariaDB.png"} alt="" style={{ width: "100%" }} />
                                </div>
                                <div className="column col-md-6 blue-text text-center text-md-start mt-md-0 mt-3">
                                    <h3 className="fw-bold">{curso.nome}</h3>
                                    <p>{curso.descricaoCurso}</p>
                                    <Link className="btn btn-primary mb-3" to={"/curso"}>Continuar curso</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="container-fluid mb-3 blue-text fw-bold">Cursos Populares</h2>
                <div className="container-fluid row d-flex justify-content-around p-0 gap-5">
                    {cursos.slice(0, 4).map((curso) => (
                        <div key={curso.id} className=" row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                            <Link className="p-0" to={"/"} style={{ textDecoration: 'none' }}>
                                <div className="p-0">
                                    <img src="/img/CursoPython.png" style={{ width: '100%' }} alt="Python" />
                                </div>
                            </Link>
                            <div className="card-body blue-text">
                                <h3 className="card-title fw-bold fw-bold">{curso.nome}</h3>
                                <p className="card-text">{curso.descricaoCurso}</p>
                                <p className="card-text d-flex justify-content-end mt-5">({curso.participantes || "120 participantes"})</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="row p-0 justify-content-center align-items-center text-center" style={{ marginTop: "5%" }}>
                {cursos.slice(0, 1).map((curso) => (
                    <div  key={curso.id} className="col-12">
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
        </div>
    );
}

export default PaginaInicial; 