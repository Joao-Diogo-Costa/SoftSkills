import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCategoriasData } from "../hooks/useCategoriasData";
import { useFiltroURL } from "../hooks/useFiltroURL";

const Categorias = () => {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [topicos, setTopicos] = useState([]);
    const [topicoSelecionado, setTopicoSelecionado] = useState("");
    const [cursosFiltrados, setCursosFiltrados] = useState([]);
    const [ordenarPor, setOrdenarPor] = useState(""); // "" | "popularidade" | "data"
    const [areas, setAreas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [areaSelecionada, setAreaSelecionada] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const { todasCategorias, todasAreas, todasTopicos } = useCategoriasData();
    const location = useLocation();

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
        let filtrados = cursos;

        if (topicoSelecionado) {
            filtrados = filtrados.filter(curso => curso.topicoId === Number(topicoSelecionado));
        } else if (areaSelecionada) {
            // Filtra cursos por área (curso -> topico -> area)
            const topicosDaArea = todasTopicos.filter(t => String(t.areaId) === areaSelecionada).map(t => t.id);
            filtrados = filtrados.filter(curso => topicosDaArea.includes(curso.topicoId));
        } else if (categoriaSelecionada) {
            // Filtra cursos por categoria (curso -> topico -> area -> categoria)
            const areasDaCategoria = todasAreas.filter(a => String(a.categoriaId) === categoriaSelecionada).map(a => a.id);
            const topicosDasAreas = todasTopicos.filter(t => areasDaCategoria.includes(t.areaId)).map(t => t.id);
            filtrados = filtrados.filter(curso => topicosDasAreas.includes(curso.topicoId));
        }

        setCursosFiltrados(filtrados);
    }, [topicoSelecionado, areaSelecionada, categoriaSelecionada, cursos, todasAreas, todasTopicos]);

    useFiltroURL(setCategoriaSelecionada, setAreaSelecionada, setTopicoSelecionado, setOrdenarPor);

    let cursosParaMostrar = topicoSelecionado || areaSelecionada || categoriaSelecionada ? cursosFiltrados : cursos;

    if (ordenarPor === "popularidade") {
        cursosParaMostrar = [...cursosParaMostrar].sort((a, b) => (b.numParticipante || 0) - (a.numParticipante || 0));
    } else if (ordenarPor === "data") {
        cursosParaMostrar = [...cursosParaMostrar].sort((a, b) => new Date(b.dataUpload) - new Date(a.dataUpload));
    }

    // Atualiza áreas quando muda a categoria
    useEffect(() => {
        if (categoriaSelecionada) {
            setAreas(todasAreas.filter(area => String(area.categoriaId) === categoriaSelecionada));
            setAreaSelecionada(""); 
            setTopicoSelecionado(""); 

        } else {
            setAreas(todasAreas);
        }
    }, [categoriaSelecionada, todasAreas]);

    useEffect(() => {
        if (areaSelecionada) {
            setTopicos(todasTopicos.filter(topico => String(topico.areaId) === areaSelecionada));
            setTopicoSelecionado("");
        } else {
            setTopicos(todasTopicos);
        }
    }, [areaSelecionada, todasTopicos]);

    function truncarNome(nome, max = 13) {
        if (!nome) return "";
        return nome.length > max ? nome.slice(0, max - 3) + "..." : nome;
    }

    function getFiltroAtivoTexto() {
        const cat = todasCategorias.find(c => String(c.id) === String(categoriaSelecionada));
        const area = todasAreas.find(a => String(a.id) === String(areaSelecionada));
        const topico = todasTopicos.find(t => String(t.id) === String(topicoSelecionado));

        if (topico) {
            const areaT = todasAreas.find(a => a.id === topico.areaId);
            const catT = areaT ? todasCategorias.find(c => c.id === areaT.categoriaId) : null;
            return (
                (catT ? catT.nome : "") +
                (areaT ? " > " + areaT.nome : "") +
                " > " + topico.nomeTopico
            );
        }
        if (area) {
            const catA = todasCategorias.find(c => c.id === area.categoriaId);
            return (catA ? catA.nome : "") + " > " + area.nome;
        }
        if (cat) {
            return cat.nome;
        }
        return "Área de tópicos";
    }

    return (
        <div>
            <div className="row container-fluid min-vh-100 m-0 p-0 ">
                <div className="row default-container d-flex  align-items-start  mb-4 ">
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <h2 className="container-fluid mb-0 blue-text fw-bold ">Descobre ideias que fazem a diferença </h2>
                            <h5 className="container-fluid mb-5 mt-2 grey-text ">
                                {getFiltroAtivoTexto()}
                            </h5>                        
                        </div>
                        <div className="col-md-6 d-flex align-items-start">
                            <div className="col-md-4" />
                            {/* Botão Filtro */}
                            <div className="col-md-4 d-flex justify-content-start">
                                <p className=" blue-text">Procuras algo específico e não encontras? Podes Filtrar!</p>
                            </div>
                            <div className="col-md-4 d-flex justify-content-sm-center justify-content-md-start">
                                <button
                                    className="btn btn-outline-primary rounded-pill"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setFilterModalOpen(true)}
                                >
                                    <i className="bi bi-funnel"></i> Filtro
                                </button>
                                {/* MODAL DE FILTRO */}
                                {isFilterModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-4 position-relative d-flex justify-content-center"
                                                    style={{
                                                        background: "linear-gradient(90deg, #39639D, #1C4072)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold">Filtrar Cursos</h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#39639D" }}>
                                                    <form>
                                                        {/* Categoria */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Selecione uma categoria
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={categoriaSelecionada}
                                                                onChange={e => setCategoriaSelecionada(e.target.value)}
                                                            >
                                                                <option value="">Todas</option>
                                                                {todasCategorias.map(cat => (
                                                                    <option key={cat.id} value={cat.id}>
                                                                        {cat.nome}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {/* Área */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Selecione uma área
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={areaSelecionada}
                                                                onChange={e => setAreaSelecionada(e.target.value)}
                                                            >
                                                                <option value="">Todas</option>
                                                                {areas.map(area => (
                                                                    <option key={area.id} value={area.id}>{area.nome}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {/* Tópico */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Selecione um tópico
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={topicoSelecionado}
                                                                onChange={e => setTopicoSelecionado(e.target.value)}
                                                            >
                                                                <option value="">Todos</option>
                                                                {topicos.map(topico => (
                                                                    <option key={topico.id} value={topico.id}>{topico.nomeTopico}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {/* Ordenar */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Ordenar por
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={ordenarPor}
                                                                onChange={e => setOrdenarPor(e.target.value)}
                                                            >
                                                                <option value="">Padrão</option>
                                                                <option value="popularidade">Popularidade (Mais participantes)</option>
                                                                <option value="data">Data (Mais recente)</option>
                                                            </select>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light me-4"
                                                        onClick={() => {
                                                            setTopicoSelecionado("");
                                                            setAreaSelecionada("");
                                                            setCategoriaSelecionada("");
                                                            setOrdenarPor("");
                                                            setFilterModalOpen(false);
                                                        }}
                                                    >
                                                        Limpar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao"
                                                        onClick={() => setFilterModalOpen(false)}
                                                    >
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="d-flex flex-wrap justify-content-center gap-4"
                        style={{ width: '100%', minHeight: 300 }}
                    >
                        {cursosParaMostrar.map((curso) => {
                            // Busca o tópico, área e categoria correspondentes
                            const topico = todasTopicos.find(t => t.id === curso.topicoId);
                            const area = topico ? todasAreas.find(a => a.id === topico.areaId) : null;
                            const categoria = area ? todasCategorias.find(c => c.id === area.categoriaId) : null;

                            const tipoCursoTexto = curso.tipoCurso === "Presencial" ? "Síncrono" : "Assíncrono";

                            return (
                                <div
                                    key={curso.id}
                                    className="card bg-transparent border-0 shadow-lg p-0 m-2"
                                    style={{ width: '18rem', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                >
                                    <Link className="p-0" to={`/curso/${curso.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="p-0">
                                            <img 
                                                src={curso.imagemBanner || "/img/CursoPython.png"} 
                                                style={{ width: '100%', height: '175px', objectFit: 'cover' }} 
                                                alt={curso.nome} 
                                                className="rounded-top"
                                            />
                                        </div>
                                    </Link>
                                    <div className="card-body blue-text d-flex flex-column" style={{ flex: 1, padding: '1rem' }}>
                                        <h3 className="card-title fw-bold" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{curso.nome}</h3>
                                        <p className="card-text" style={{ fontSize: '0.9rem', flex: 1, marginBottom: '0.5rem' }}>{curso.descricaoCurso}</p>
                                    </div>
                                    {/* Tags coloridas na parte inferior */}
                                    <div className="px-3 d-flex flex-wrap gap-2 justify-content-center mb-2 me-3 ms-3 overflow-hidden">
                                        <span className="badge bg-info text-dark" title={topico ? topico.nomeTopico : ""}>
                                            {categoria ? categoria.nome : "Sem categoria"}
                                        </span>
                                        <span className="badge bg-secondary" title={topico ? topico.nomeTopico : ""}>
                                            {area ? area.nome : "Sem área"}
                                        </span>
                                        <span className="badge bg-primary" title={topico ? topico.nomeTopico : "Sem tópico"}>
                                            {topico ? topico.nomeTopico : "Sem tópico"}
                                        </span>
                                    </div>
                                    {/* Número de participantes */}
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
                                    {/* Faixa azul inferior */}
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
            </div>
        </div>
    );
};

export default Categorias;