import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import useEmblaCarousel from 'embla-carousel-react'
import { useCategoriasData } from "../hooks/useCategoriasData";

// Função utilitária para truncar nomes
function truncarNome(nome, max = 13) {
    if (!nome) return "";
    return nome.length > max ? nome.slice(0, max - 3) + "..." : nome;
}

function agruparPorCategoria(cursos, todasAreas, todasCategorias) {
    const categoriasMap = {};
    cursos.forEach(curso => {
        const areaId = curso.TOPICOC?.areaId;
        const area = todasAreas.find(a => a.id === areaId);
        const categoria = todasCategorias.find(c => c.id === area?.categoriaId);
        if (categoria) {
            if (!categoriasMap[categoria.nome]) categoriasMap[categoria.nome] = [];
            categoriasMap[categoria.nome].push(curso);
        }
    });
    return categoriasMap;
}

function CategoriaCarousel({ categoriaNome, cursosCat }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 2,
        containScroll: "trimSnaps",
    });

    // Limita a 7 cursos no máximo
    const cursosVisiveis = cursosCat.slice(0, 7);
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    return (
        <div className="mt-3" style={{ position: "relative" }}>
            <h2
                className="mb-3 blue-text fw-bold"
                style={{
                    marginTop: "2%",
                    marginBottom: "1.5rem",
                    textAlign: "left",
                    maxWidth: 1200,
                }}
            >
                Cursos em {categoriaNome}
            </h2>
            <div className="mt-4" style={{ maxWidth: 1040, margin: "0 auto", position: "relative", }}>
                {/* Seta esquerda */}
                <button
                    className="btn btn-light shadow"
                    onClick={scrollPrev}
                    onMouseEnter={() => setHoverPrev(true)}
                    onMouseLeave={() => setHoverPrev(false)}
                    style={{
                        position: "absolute",
                        left: -30,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        display: cursosVisiveis.length > 4 ? "flex" : "none",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                    }}
                    aria-label="Anterior"
                >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="14" fill={hoverPrev ? "#d3d4d5" : "#f8f9fa"} />
                        <path d="M17 8l-5 6 5 6" stroke={hoverPrev ? "#39639D" : "#39639D"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                {/* Carrossel */}
                <div
                    className="embla flex-grow-1"
                    ref={emblaRef}
                    style={{
                        overflow: "hidden",
                        width: "100%",
                        maxWidth: 1040,
                    }}
                >
                    <div
                        className="embla__container d-flex"
                        style={{
                            gap: "1rem",
                            flexWrap: "nowrap",
                        }}
                    >
                        {cursosVisiveis.map((curso) => (
                            <div
                                className="embla__slide"
                                key={curso.id}
                                style={{
                                    flex: "0 0 250px",
                                    minWidth: 250,
                                    maxWidth: 250,
                                }}
                            >
                                <div
                                    className="card bg-transparent border-0 shadow-lg p-0"
                                    style={{
                                        minWidth: 250,
                                        maxWidth: 250,
                                        minHeight: 250,
                                        height: 250,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                    }}
                                >
                                    <Link className="p-0" to={`/curso/${curso.id}`} style={{ textDecoration: "none" }}>
                                        <img
                                            src={curso.imagemBanner || "/img/CursoPython.png"}
                                            style={{ width: "100%", height: 120, objectFit: "cover" }}
                                            alt={curso.nome}
                                            className="rounded-top-4"
                                        />
                                    </Link>
                                    <div className="card-body blue-text" style={{ flex: 1 }}>
                                        <h5 className="card-title fw-bold" style={{ fontSize: "1.05rem" }}>{curso.nome}</h5>
                                        <p
                                            className="card-text"
                                            style={{
                                                fontSize: "0.95rem",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                minHeight: 44,
                                                maxHeight: 44,
                                            }}
                                        >
                                            {curso.descricaoCurso}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Seta direita */}
                <button
                    className="btn btn-light shadow"
                    onClick={scrollNext}
                    onMouseEnter={() => setHoverNext(true)}
                    onMouseLeave={() => setHoverNext(false)}
                    style={{
                        position: "absolute",
                        right: -30,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        display: cursosVisiveis.length > 4 ? "flex" : "none",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                    }}
                    aria-label="Próximo"
                >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="14" fill={hoverNext ? "#d3d4d5" : "#f8f9fa"} />
                        <path d="M11 8l5 6-5 6" stroke={hoverNext ? "#39639D" : "#39639D"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
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
        axios.get("http://localhost:3000/curso/list")
            .then(res => {
                if (res.data.success) setCursos(res.data.data);
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

    const cursosPorCategoria = (cursos.length && todasAreas.length && todasCategorias.length)
        ? agruparPorCategoria(cursos, todasAreas, todasCategorias)
        : {};

    return (
        <>
            <div className="container-lg">
                {/* Cursos Vistos Recentemente */}
                {cursosInscrito.length > 0 && (
                    <>
                        <h2 className="mb-3 blue-text fw-bold" style={{ marginTop: "5%" }}>
                            Cursos Vistos Recentemente
                        </h2>
                        <div style={{ marginBottom: "5%" }}>
                            <div className="row justify-content-center g-4 align-items-stretch">
                                {cursosInscrito.slice(0, 2).map((curso) => (
                                    <div
                                        key={curso.id}
                                        className="col-12 col-md-6 d-flex align-items-stretch justify-content-center"
                                        style={{
                                            minHeight: 320,
                                            maxWidth: 700,
                                            margin: "0 auto"
                                        }}
                                    >
                                        <div className="d-flex flex-row align-items-center w-100 mt-3">
                                            <div className="d-flex justify-content-center align-items-center mb-4" style={{ minWidth: 180, }}>
                                                <img
                                                    src={curso.imagemBanner || "/img/MariaDB.png"}
                                                    alt={curso.nome}
                                                    style={{
                                                        width: "100%",
                                                        maxWidth: 375
                                                    }}
                                                    className="img-fluid rounded-4 text-center"
                                                />
                                            </div>
                                            <div className="flex-grow-1 blue-text text-start d-flex flex-column" style={{ gap: "0.5rem", minHeight: 200 }}>
                                                <div>
                                                    <h3 className="fw-bold mb-2" style={{ fontSize: "2rem", whiteSpace: "normal" }}>{curso.nome}</h3>
                                                    <p style={{ fontSize: "1.15rem", whiteSpace: "normal", }}>{curso.descricaoCurso}</p>
                                                </div>
                                                <Link className="btn btn-primary btn-lg align-self-start" to={`/curso/${curso.id}`}>Continuar curso</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Cursos Populares */}
                <h2
                    className="mb-3 blue-text fw-bold"
                    style={{
                        textAlign: "left",
                        maxWidth: 1200,
                    }}
                >
                    Cursos Populares
                </h2>
                <div
                    className="d-flex justify-content-center flex-wrap gap-5"
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        paddingBottom: "2.5rem"
                    }}
                >
                    {[...cursos]
                        .sort((a, b) => (b.numParticipante || 0) - (a.numParticipante || 0))
                        .slice(0, 4)
                        .map((curso) => {
                            const tipoCursoTexto = curso.tipoCurso === "Presencial" ? "Síncrono" : "Assíncrono";
                            return (
                                <div
                                    key={curso.id}
                                    className="card bg-transparent border-0 shadow-lg p-0"
                                    style={{
                                        minWidth: 250,
                                        maxWidth: 250,
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
                                    {/* Faixa azul na parte inferior com o tipo de curso */}
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

                {/* Top cursos por categoria */}
                {Object.keys(cursosPorCategoria).length > 0 ? (
                    Object.entries(cursosPorCategoria).map(([categoriaNome, cursosCat]) => (
                        <CategoriaCarousel
                            key={categoriaNome}
                            categoriaNome={categoriaNome}
                            cursosCat={cursosCat}
                        />
                    ))
                ) : (
                    <div className="text-center mt-5">Nenhum curso encontrado por categoria.</div>
                )}

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