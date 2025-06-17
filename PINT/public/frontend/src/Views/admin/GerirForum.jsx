import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"

// Icones
import maisDetalhesIcon from "../../assets/admin/svg/mais_detalhes_vector.svg";
import cursoPic from "../../assets/admin/img/mariadb_curso.png";


import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';

function GerirForum() {

    const [foruns, setForuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/forum/list")
            .then(res => {
                if (res.data.success) {
                    setForuns(res.data.data);
                }
            })
            .catch(() => setForuns([]))
            .finally(() => setLoading(false));
    }, []);

    // Filtrar fóruns conforme o texto de pesquisa
    const forunsFiltrados = foruns.filter(forum =>
        forum.nome?.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <>
            <Helmet>
                <title>Gerir Fórum / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">
                <PerfilAdmin />
                <div className="container mt-4">
                    <div className="row d-flex justify-content-between">
                        <button className="btn btn-sm me-4 btn-filtro">
                            <i className="fa-solid fa-filter me-2" />
                            Filtros
                        </button>
                        <button id="btnAdicionarForum" className="btn btn-sm me-4 btn-adicionar">
                            <i className="fa-solid fa-plus me-2" />
                            Adicionar
                        </button>
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
                                placeholder="Procurar fórum"
                                aria-label="Search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </form>
                        <div className="col-12 mt-3">
                            <div
                                className="container container-cursos rounded mt-3 shadow-sm"
                                style={{ maxHeight: 665, overflowY: "auto" }}
                            >
                                <div className="row row-cols-1 row-cols-md-3 mb-3">
                                    {loading ? (
                                        <div className="col">A carregar...</div>
                                    ) : forunsFiltrados.length === 0 ? (
                                        <div className="col">Nenhum fórum encontrado.</div>
                                    ) : (
                                        forunsFiltrados.map(forum => (
                                            <div className="col" key={forum.id}>
                                                <div className="card card-curso h-100 mt-3 mx-3">
                                                    <div className="card-body">
                                                        <div className="wrapper-curso">
                                                            <div className="imagem-curso d-flex justify-content-left mb-3">
                                                                <img
                                                                    src={forum.imagemForum || cursoPic}
                                                                    alt={forum.nome}
                                                                    className="rounded"
                                                                    style={{ width: 312, height: 175, cursor: "pointer" }}
                                                                />
                                                                <div className="detalhes-imagem">
                                                                    <Link
                                                                        to={`/admin/forum/${forum.id}`}
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
                                                            {forum.nome}
                                                        </h5>
                                                        <p
                                                            className="card-text fs-5 fw-semibold"
                                                            style={{ color: "#39639D" }}
                                                        >
                                                            {forum.descricao}
                                                        </p>
                                                        <p className="card-text">
                                                            <span className="fw-bold">Tópico:</span>{" "}
                                                            {forum.TOPICOC?.NOME_TOPICOC || forum.topicoId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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

export default GerirForum;