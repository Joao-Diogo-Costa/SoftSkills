import React, { useEffect, useState } from "react";
import { useNavigate, Link, } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

// Icones
import maisDetalhesIcon from "../../assets/admin/svg/mais_detalhes_vector.svg";
import cursoPic from "../../assets/admin/img/mariadb_curso.png";


import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';

function GerirCurso() {
    const [cursos, setCursos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [areaFiltro, setAreaFiltro] = useState("");
    const [topicoFiltro, setTopicoFiltro] = useState("");
    const [showFiltro, setShowFiltro] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


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

    //Buscar cursos
    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/curso/list")
            .then(res => {
                if (res.data.success) {
                    setCursos(res.data.data);
                }
            })
            .catch(err => {
                console.error("Erro ao encontrar cursos:", err);
            });
    }, []);

    // Buscar categorias, áreas, tópicos e cursos ao iniciar
    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/categoria/list")
            .then(res => setCategorias(res.data.data || []))
            .catch(() => setCategorias([]));
        axios.get("https://pint-web-htw2.onrender.com/area/list")
            .then(res => setAreas(res.data.data || []))
            .catch(() => setAreas([]));
        axios.get("https://pint-web-htw2.onrender.com/topico-curso/list")
            .then(res => setTopicos(res.data.data || []))
            .catch(() => setTopicos([]));
        axios.get("https://pint-web-htw2.onrender.com/curso/list")
            .then(res => {
                if (res.data.success) setCursos(res.data.data);
            })
            .catch(() => setCursos([]));
    }, []);

    // Limpar filtros dependentes
    useEffect(() => {
        setAreaFiltro("");
        setTopicoFiltro("");
    }, [categoriaFiltro]);

    useEffect(() => {
        setTopicoFiltro("");
    }, [areaFiltro]);

    // Filtrar áreas pela categoria selecionada
    const areasFiltradas = categoriaFiltro
        ? areas.filter(area => area.categoriaId === categoriaFiltro)
        : areas;

    // Filtrar tópicos pela área selecionada
    const topicosFiltrados = areaFiltro
        ? topicos.filter(topico => topico.areaId === areaFiltro)
        : categoriaFiltro
            ? topicos.filter(topico =>
                areasFiltradas.some(area => area.id === topico.areaId)
            )
            : topicos;

    // IDs auxiliares para filtros
    const areasDaCategoria = categoriaFiltro
        ? areas.filter(area => area.categoriaId === categoriaFiltro).map(area => area.id)
        : areas.map(area => area.id);

    const topicosDasAreas = areaFiltro
        ? topicos.filter(topico => topico.areaId === areaFiltro).map(topico => topico.id)
        : categoriaFiltro
            ? topicos.filter(topico => areasDaCategoria.includes(topico.areaId)).map(topico => topico.id)
            : topicos.map(topico => topico.id);

    // Filtro final de cursos
    const cursosFiltrados = cursos.filter(curso =>
        curso.nome.toLowerCase().includes(search.toLowerCase()) &&
        (!categoriaFiltro || areasDaCategoria.includes(
            topicos.find(topico => topico.id === curso.topicoId)?.areaId
        )) &&
        (!areaFiltro || topicos.find(topico => topico.id === curso.topicoId)?.areaId === areaFiltro) &&
        (!topicoFiltro || curso.topicoId === topicoFiltro)
    );

    return (
        <>
            <Helmet>
                <title>Gerir Curso / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">

                <PerfilAdmin />

                <div className="container mt-4">
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
                                <div className="shadow rounded p-3" style={{ position: "absolute", top: "110%", left: 0, background: "#fff", zIndex: 10, minWidth: 220 }}>
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
                            <button
                                id="btnAdicionarCurso"
                                className="btn btn-sm me-4 btn-adicionar"
                                onClick={() => navigate("/admin/gerir-curso/criar-curso")}
                            >
                                <i className="fa-solid fa-plus me-2" />
                                Adicionar
                            </button>
                            <form
                                className="input-group d-flex mx-auto border border-opacity-50 rounded w-50 barra-pesquisa"
                                role="search"
                                onSubmit={e => e.preventDefault()} // impede submit
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
                                                                    srcSet=""
                                                                    className="rounded"
                                                                    style={{ width: 312, height: 175, cursor: "pointer" }}
                                                                />
                                                                <div className="detalhes-imagem">
                                                                    <Link to={`/admin/gerir-curso/detalhe/${curso.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                                        <img
                                                                            src={maisDetalhesIcon}
                                                                            alt=""
                                                                        />
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
        </>


    );
}


export default GerirCurso;