import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";
import authHeader from "../auth.header";

import iconSucesso from "../../assets/admin/svg/success_vector.svg";

import cursoPic from "../../assets/admin/img/mariadb_curso.png";
import maisDetalhesIcon from "../../assets/admin/svg/mais_detalhes_vector.svg";

function CursoFormador() {
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [search, setSearch] = useState("");
    const [showFiltro, setShowFiltro] = useState(false);
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [areaFiltro, setAreaFiltro] = useState("");
    const [topicoFiltro, setTopicoFiltro] = useState("");
    const filtroRef = useRef();
    const navigate = useNavigate();

    // Carregar cursos do formando autenticado
    useEffect(() => {
        axios.get("http://localhost:3000/curso/list-formador", { headers: authHeader() })
            .then(res => setCursos(res.data.data || []))
            .catch(() => setCursos([]));
    }, []);

    // Carregar categorias, áreas e tópicos
    useEffect(() => {
        axios.get("http://localhost:3000/categoria/list").then(res => setCategorias(res.data.data || []));
        axios.get("http://localhost:3000/area/list").then(res => setAreas(res.data.data || []));
        axios.get("http://localhost:3000/topico-curso/list").then(res => setTopicos(res.data.data || []));
    }, []);

    // Fechar filtro ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (filtroRef.current && !filtroRef.current.contains(event.target)) {
                setShowFiltro(false);
            }
        }
        if (showFiltro) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFiltro]);

    // Filtrar áreas e tópicos conforme seleção
    const areasFiltradas = categoriaFiltro
        ? areas.filter(a => a.categoriaId === categoriaFiltro)
        : areas;

    const topicosFiltrados = areaFiltro
        ? topicos.filter(t => t.areaId === areaFiltro)
        : topicos;

    // Filtrar cursos conforme filtros e pesquisa
    const cursosFiltrados = cursos.filter(curso => {
        const matchCategoria = categoriaFiltro ? curso.categoriaId === categoriaFiltro : true;
        const matchArea = areaFiltro ? curso.areaId === areaFiltro : true;
        const matchTopico = topicoFiltro ? curso.topicoId === topicoFiltro : true;
        const matchSearch =
            curso.nome.toLowerCase().includes(search.toLowerCase()) ||
            (curso.descricao || "").toLowerCase().includes(search.toLowerCase());
        return matchCategoria && matchArea && matchTopico && matchSearch;
    });

    const selectEstilos = {
            control: (base, state) => ({
                ...base,
                backgroundColor: "#fff",
                borderColor: state.isFocused ? "#39639D" : "#ccc",
                boxShadow: state.isFocused ? "0 0 0 2px #39639D33" : "none",
                minHeight: 38,
            }),
            menu: base => ({
                ...base,
                backgroundColor: "#F5F9FF"
            }),
            option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                    ? "#deebff"
                    : state.isSelected
                        ? "#deebff"
                        : "#F5F9FF",
                color: "#39639D",
                cursor: "pointer",
                padding: "8px 12px"
            }),
            singleValue: base => ({
                ...base,
                color: "#333333",
            }),
        };

    return (
                <>
            <Helmet>
                <title>Os meus Cursos / SoftSkills</title>
            </Helmet>

            <div className="content flex-grow-1 no-sidebar mt-4">
                <div className="d-flex justify-content-center mb-5 mt-5">
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        <div className="d-flex align-items-center position-relative">
                            <button
                                className="btn btn-sm me-4 btn-filtro"
                                onClick={() => setShowFiltro(v => !v)}
                                type="button"
                            >
                                <i className="fa-solid fa-filter me-2" />
                                Filtros
                            </button>
                            {showFiltro && (
                                <div ref={filtroRef} className="shadow rounded p-3" style={{ position: "absolute", top: "110%", left: 0, background: "#fff", zIndex: 10, minWidth: 220 }}>
                                    <div className="mb-2">
                                        <label className="fw-semibold">Categoria</label>
                                        <Select
                                            options={[{ value: "", label: "Todas" }, ...categorias.map(cat => ({ value: cat.id, label: cat.nome }))]}
                                            value={
                                                categoriaFiltro
                                                    ? { value: categoriaFiltro, label: categorias.find(cat => cat.id === categoriaFiltro)?.nome }
                                                    : { value: "", label: "Todas" }
                                            }
                                            onChange={option => setCategoriaFiltro(option ? option.value : "")}
                                            placeholder="Categoria"
                                            styles={selectEstilos}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="fw-semibold">Área</label>
                                        <Select
                                            options={[{ value: "", label: "Todas" }, ...areasFiltradas.map(area => ({ value: area.id, label: area.nome }))]}
                                            value={
                                                areaFiltro
                                                    ? { value: areaFiltro, label: areasFiltradas.find(area => area.id === areaFiltro)?.nome }
                                                    : { value: "", label: "Todas" }
                                            }
                                            onChange={option => setAreaFiltro(option ? option.value : "")}
                                            placeholder="Área"
                                            isDisabled={!categoriaFiltro}
                                            styles={selectEstilos}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="fw-semibold">Tópico</label>
                                        <Select
                                            options={[{ value: "", label: "Todos" }, ...topicosFiltrados.map(topico => ({ value: topico.id, label: topico.nomeTopico }))]}
                                            value={
                                                topicoFiltro
                                                    ? { value: topicoFiltro, label: topicosFiltrados.find(topico => topico.id === topicoFiltro)?.nomeTopico }
                                                    : { value: "", label: "Todos" }
                                            }
                                            onChange={option => setTopicoFiltro(option ? option.value : "")}
                                            placeholder="Tópico"
                                            isDisabled={!areaFiltro}
                                            styles={selectEstilos}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-sm btn-secondary mt-2 w-100"
                                        onClick={() => {
                                            setCategoriaFiltro("");
                                            setAreaFiltro("");
                                            setTopicoFiltro("");
                                            setShowFiltro(false);
                                        }}
                                        type="button"
                                    >
                                        Limpar Filtros
                                    </button>
                                </div>
                            )}
                            <form
                                className="input-group d-flex mx-auto border border-opacity-50 rounded w-50 barra-pesquisa"
                                role="search"
                                onSubmit={e => e.preventDefault()}
                            >
                                <span className="input-group-text bg-transparent border-0">
                                    <i className="fa-solid fa-magnifying-glass icon-lupa" />
                                </span>
                                <input
                                    className="form-control no-outline bg-transparent border-0 shadow-none"
                                    type="search"
                                    placeholder="Procurar curso"
                                    aria-label="Search"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </form>
                        </div>
                        <div className="col-12 mt-3">
                            <div
                                className={`container container-cursos rounded mt-3 shadow-sm ${cursosFiltrados.length === 0 ? "d-flex justify-content-center align-items-center" : ""}`}
                                style={{ maxHeight: 665, minHeight: 665, overflowY: "auto" }}
                            >
                                {cursosFiltrados.length === 0 ? (
                                    <h4 className="text-muted m-0 w-100 text-center">
                                        Não existem cursos com os filtros selecionados.
                                    </h4>
                                ) : (
                                    <div className="row row-cols-1 row-cols-md-3 mb-3">
                                        {cursosFiltrados.map((curso) => (
                                            <div className="col" key={curso.id}>
                                                <div className="card card-curso h-100 mt-3 mx-3">
                                                    <div className="card-body">
                                                        <div className="wrapper-curso">
                                                            <div className="imagem-curso d-flex justify-content-left mb-3">
                                                                <img
                                                                    src={curso.imagemBanner || cursoPic}
                                                                    alt={curso.nome}
                                                                    className="rounded"
                                                                    style={{ width: 312, height: 175, cursor: "pointer" }}
                                                                />
                                                                <div className="detalhes-imagem">
                                                                    <Link
                                                                        to={
                                                                            curso.tipoCurso === "Online"
                                                                                ? `/curso-formador/gerir-assincrono/${curso.id}`
                                                                                : `/curso-formador/gerir/${curso.id}`
                                                                        }
                                                                        style={{ textDecoration: "none", color: "inherit" }}
                                                                    >
                                                                        <img src={maisDetalhesIcon} alt="" />
                                                                        <h1 className="fw-semibold fs-5 text-white">
                                                                            Clique para mais detalhes
                                                                        </h1>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h5
                                                            className="card-title fs-5 fw-semibold"
                                                            style={{ color: "#39639D" }}
                                                        >
                                                            {curso.nome}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default CursoFormador;