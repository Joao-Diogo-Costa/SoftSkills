import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useCategoriasData } from "../hooks/useCategoriasData";

// Função utilitária para truncar nomes
function truncarNome(nome, max = 13) {
    if (!nome) return "";
    return nome.length > max ? nome.slice(0, max - 3) + "..." : nome;
}

function PaginaInicial() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [cursosInscrito, setCursosInscrito] = useState([]);
    const [cursoDoMes, setCursoDoMes] = useState(null);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    // Custom hook para categorias, áreas e tópicos
    const { todasCategorias, todasAreas, todasTopicos } = useCategoriasData();

    // Buscar todos os cursos
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

    // Buscar cursos em que o utilizador está inscrito
    useEffect(() => {
        if (user && user.id) {
            axios.get(`http://localhost:3000/inscricao/utilizador/${user.id}`)
                .then(response => {
                    const data = response.data;
                    if (data.success) {
                        setCursosInscrito(
                            data.data
                                .filter(insc => insc.CURSO)
                                .map(insc => ({
                                    ...insc.CURSO,
                                    dataRegisto: insc.dataInscricao,
                                    dataTermino: insc.dataConclusao,
                                    nota: insc.notaFinal
                                }))
                        );
                    }
                });
        }
    }, [user]);

    if (!user) return <div>Por favor, faça login.</div>;

    useEffect(() => {
        axios.get("http://localhost:3000/curso/mais-popular-mes")
            .then(res => {
                if (res.data.success && res.data.data) {
                    setCursoDoMes(res.data.data);
                } else {
                    setCursoDoMes(null);
                }
            })
            .catch(() => setCursoDoMes(null));
    }, []);

    useEffect(() => {
        document.title = "Home / SoftSkills";
    }, []);

    return (
        <>

            <div className="row">
                <div className="default-container">
                    {/* Cursos Vistos Recentemente */}
                    {cursosInscrito.length > 0 && (
                        <>
                            <h2 className="container-fluid mb-3 blue-text fw-bold" style={{ marginTop: "2%" }}>
                                Cursos Vistos Recentemente
                            </h2>
                            <div className="container-fluid" style={{ marginBottom: "6%" }}>
                                <div className="row justify-content-center">
                                    {cursosInscrito.slice(0, 2).map((curso) => (
                                        <div key={curso.id} className="row col-md-6 d-flex align-items-center">
                                            <div className="col-md-6">
                                                <img src={curso.imagemBanner || "/img/MariaDB.png"} alt={curso.nome} style={{ width: "100%" }} className="rounded-4" />
                                            </div>
                                            <div className="column col-md-6 blue-text text-center text-md-start mt-md-0 mt-3">
                                                <h3 className="fw-bold">{curso.nome}</h3>
                                                <p>{curso.descricaoCurso}</p>
                                                <Link className="btn btn-primary mb-3" to={`/curso/${curso.id}`}>Continuar curso</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cursos Populares */}
                    <h2 className="container-fluid mb-3 blue-text fw-bold">Cursos Populares</h2>
                    <div className="container-fluid row d-flex justify-content-around p-0 gap-5">
                        {[...cursos]
                            .sort((a, b) => (b.numParticipante || 0) - (a.numParticipante || 0))
                            .slice(0, 4)
                            .map((curso) => {

                                const tipoCursoTexto = curso.tipoCurso === "Presencial" ? "Síncrono" : "Assíncrono";
                                return (
                                    <div
                                        key={curso.id}
                                        className="row card col-md-4 bg-transparent border-0 shadow-lg p-0"
                                        style={{
                                            width: '18rem',
                                            minHeight: 320,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative'
                                        }}
                                    >
                                        <Link className="p-0" to={`/curso/${curso.id}`} style={{ textDecoration: 'none' }}>
                                            <div className="p-0">
                                                <img src={curso.imagemBanner || "/img/CursoPython.png"} style={{ width: '100%' }} alt={curso.nome} className="rounded-top-4" />
                                            </div>
                                        </Link>
                                        <div className="card-body blue-text" style={{ flex: 1 }}>
                                            <h3 className="card-title fw-bold">{curso.nome}</h3>
                                            <p className="card-text">{curso.descricaoCurso}</p>
                                        </div>
                                        <div
                                            style={{
                                                width: "100%",
                                                textAlign: "right",
                                                padding: "0 1rem 0.5rem 0",
                                                color: "#39639D",
                                                fontWeight: 500,
                                                fontSize: "0.95rem"
                                            }}
                                        >
                                            ({curso.numParticipante || 0} participantes)
                                        </div>
                                        {/* Faixa azul na parte inferior mostrando o tipo de curso */}
                                        <div
                                            style={{
                                                background: 'linear-gradient(90deg, #39639D, #1C4072)',
                                                color: '#fff',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                padding: '6px 12px',
                                                borderBottomLeftRadius: '0.5rem',
                                                borderBottomRightRadius: '0.5rem',
                                                width: '100%',
                                                minHeight: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title={tipoCursoTexto}
                                        >
                                            <span>
                                                {tipoCursoTexto}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
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

export default PaginaInicial;