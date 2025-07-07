import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import authHeader from "../auth.header";
import { Helmet } from 'react-helmet';
import AdminSidebar from './Sidebar';

function CursoCard({ id, imagem, nome, formador, dataRegisto, dataTermino, nota, concluido, percentagem, onTransferirCertificado, inscricaoId }) {
    return (
        <div className="row mt-4 mb-4 p-0 ms-1 ms-md-2 align-items-center hover-shadow" style={{ cursor: "pointer" }}>
            <Link className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-2 mb-md-0 text-decoration-none" to={`/curso/${id}`}>
                <img
                    src={imagem}
                    className="img-fluid rounded"
                    alt={nome}
                    style={{
                        objectFit: "fit",
                        maxHeight: 200,
                        minHeight: 100,
                        maxWidth: 250,
                        minWidth: 150
                    }}
                />
            </Link>
            <Link className="col-12 col-md-4 mb-2 mb-md-0 text-decoration-none" to={`/curso/${id}`}>
                <p className="fw-bold" style={{ color: '#39639d' }}>{nome}</p>
                <p className="grey-text mb-1">Formador: {formador}</p>
                <p className="mb-1" style={{ color: '#39639d' }}>
                    Data de registo <strong>{dataRegisto}</strong>
                </p>
                <p className="mb-1" style={{ color: '#39639d' }}>
                    Data de fim  <strong>{dataTermino}</strong>
                </p>
            </Link>
            <div className="col-12 col-md-5 row p-0 ms-1 ms-md-2">
                <div className="col-12 col-md-6 mb-2 mb-md-0 d-flex justify-content-center align-items-center">
                    <button
                        className="btn w-100"
                        style={{
                            fontSize: 15,
                            backgroundColor: concluido ? '#39639d' : '#bdcde3',
                            color: 'white',
                            cursor: concluido ? 'pointer' : 'not-allowed',
                            opacity: concluido ? 1 : 0.6
                        }}
                        disabled={!concluido}
                        onClick={concluido ? onTransferirCertificado : undefined}
                        title={concluido ? "Transferir Certificado" : "Conclua o curso para transferir o certificado"}
                    >
                        {concluido ? "Transferir Certificado" : `${percentagem ?? 0}% concluído`}
                    </button>
                </div>
                <div className="col-12 col-md-4 mt-2 mt-md-0">
                    <div className="container border border-secondary border-opacity-50 rounded-4 p-2" style={{ width: '100%' }}>
                        <p className="mb-0 text-center fw-bold" style={{ fontSize: 16, color: '#39639d' }}>
                            Nota Final
                        </p>
                        <p className="text-center fs-lg fw-bold" style={{ color: '#39639d', fontSize: 32 }}>
                            {nota}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PerfilUtilizador() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [cursosGeridos, setCursosGeridos] = useState([]);
    const [progressoCursos, setProgressoCursos] = useState({});
    const [search, setSearch] = useState("");
    const [filtroData, setFiltroData] = useState("");

    useEffect(() => {
        axios.get(`https://pint-web-htw2.onrender.com/utilizador/get/${id}`, { headers: authHeader() })
            .then(res => setUser(res.data.data));
    }, [id]);

    useEffect(() => {
        axios.get(`https://pint-web-htw2.onrender.com/inscricao/utilizador/${id}`, { headers: authHeader() })
            .then(async response => {
                const data = response.data;
                if (data.success) {
                    const cursosArr = data.data
                        .filter(insc => insc.CURSO)
                        .map(insc => ({
                            ...insc.CURSO,
                            inscricaoId: insc.id,
                            dataRegisto: insc.dataInscricao,
                            dataTermino: insc.dataConclusao,
                            nota: insc.notaFinal
                        }));

                    const cursosComFormador = await Promise.all(
                        cursosArr.map(async curso => {
                            let nomeFormador = "Desconhecido";
                            if (curso.formadorId) {
                                try {
                                    const res = await axios.get(`https://pint-web-htw2.onrender.com/utilizador/get/${curso.formadorId}`, { headers: authHeader() });
                                    if (res.data.success && res.data.data && res.data.data.nomeUtilizador) {
                                        nomeFormador = res.data.data.nomeUtilizador;
                                    }
                                } catch (e) { }
                            }
                            return { ...curso, formador: nomeFormador };
                        })
                    );

                    setCursos(cursosComFormador);

                    Promise.all(
                        cursosComFormador.map(curso =>
                            axios.get(`https://pint-web-htw2.onrender.com/progresso-aula/progresso/${id}/${curso.id}`, { headers: authHeader() })
                                .then(res => ({
                                    cursoId: curso.id,
                                    percentagem: res.data.success ? res.data.percentagem : 0
                                }))
                                .catch(() => ({
                                    cursoId: curso.id,
                                    percentagem: 0
                                }))
                        )
                    ).then(results => {
                        const progressoObj = {};
                        results.forEach(r => { progressoObj[r.cursoId] = r.percentagem; });
                        setProgressoCursos(progressoObj);
                    });
                }
            });
    }, [id]);

    useEffect(() => {
        if (user && user.role === "formador") {
            axios.get(`https://pint-web-htw2.onrender.com/curso/formador/${user.id}`, { headers: authHeader() })
                .then(res => setCursosGeridos(res.data.data || []));
        } else {
            setCursosGeridos([]);
        }
    }, [user]);

    function formatarData(dataISO) {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-PT");
    }

    function handleTransferirCertificado(inscricaoId) {
        window.open(`https://pint-web-htw2.onrender.com/certificado/download/${inscricaoId}`, "_blank");
    }

    const cursosFiltrados = cursos.filter(curso => {
        const nomeMatch = curso.nome.toLowerCase().includes(search.toLowerCase());
        const dataMatch = filtroData ? formatarData(curso.dataRegisto) === filtroData : true;
        return nomeMatch && dataMatch;
    });

    if (!user) return <div>Carregando perfil...</div>;

    return (
        <>
            <Helmet>
                <title>Gerir Utilizador / SoftSkills</title>
            </Helmet>
            <AdminSidebar />

            <div className="min-vh-100" style={{ marginLeft: 250 }}>
                <div className="container2 mt-4">
                    <div className="row bg-translucent rounded d-flex justify-content-center">
                        <div className="col-12 row" style={{ minHeight: 250 }}>
                            <div className="row col-12 col-md-6 align-items-center ms-0 ms-md-2" style={{ height: '100%' }}>
                                <img
                                    src={user.imagemPerfil || "/img/profile-picture-BIG.png"}
                                    className="col-4 col-md-4 ms-0 ms-md-2 img-fluid mt-3 mt-md-0 mb-2 mb-md-0 rounded-circle"
                                    style={{
                                        width: 200,
                                        height: 180,
                                        objectFit: "cover",
                                        aspectRatio: "1/1",
                                        minWidth: 200,
                                        minHeight: 180,
                                        maxWidth: 200,
                                        maxHeight: 180
                                    }}
                                    alt="Foto de perfil"
                                />
                                <div className="col-8 col-md-6 mt-2 mt-md-0">
                                    <div>
                                        <h3 className="mb-0 fw-bold" style={{ color: '#39639d' }}>
                                            {user.nomeUtilizador}
                                        </h3>
                                        <p className="blue-text mb-0 fw-bold">
                                            {user.role
                                                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                                                : ""}
                                        </p>
                                        <p className="grey-text">{user.email}</p>
                                    </div>
                                    <p className="mb-0 fw-bold" style={{ marginTop: '10%', color: '#39639d' }}>
                                        {user.dataRegisto ? formatarData(user.dataRegisto) : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-end align-items-end align-items-md-center h-100 mt-3 mt-md-0">
                                <p className="text-end grey-text w-100 w-md-auto">Viseu, Portugal</p>
                            </div>
                        </div>
                        <div className="row mt-5 bg-translucent p-0">
                            <div className="col-md-12 barra p-0" />
                            {/* Percurso Formativo - só para formando */}
                            {user?.role === "formando" && (
                                <>
                                    <h5 className="fw-bold mt-4 blue-text">Percurso Formativo</h5>
                                    <div className="row mb-3 mt-2">
                                        <div className="col-md-6 d-flex justify-content-start">
                                            <form
                                                className="input-group border border-opacity-50 rounded barra-pesquisa w-75 mx-auto"
                                                role="search"
                                                onSubmit={e => e.preventDefault()}
                                            >
                                                <span className="input-group-text border-0">
                                                    <i className="fa-solid fa-magnifying-glass icon-lupa" />
                                                </span>
                                                <input
                                                    className="form-control no-outline border-0 shadow-none"
                                                    type="search"
                                                    placeholder="Procurar curso"
                                                    aria-label="Search"
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                />
                                            </form>
                                        </div>
                                        <div className="col-md-6 d-flex justify-content-start">
                                            <form
                                                className="input-group border border-opacity-50 rounded barra-pesquisa w-75 mx-auto"
                                                role="search"
                                                onSubmit={e => e.preventDefault()}
                                            >
                                                <span className="input-group-text border-0">
                                                    <i className="fa-regular fa-calendar-days" />
                                                </span>
                                                <input
                                                    className="form-control no-outline border-0 shadow-none"
                                                    type="date"
                                                    placeholder="Filtrar por data de registo"
                                                    aria-label="Filtrar por data de registo"
                                                    value={filtroData}
                                                    onChange={e => setFiltroData(e.target.value)}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                    {cursosFiltrados.length === 0 ? (
                                        <div className="d-flex align-items-center justify-content-center text-center text-muted py-5 fw-bold" style={{ minHeight: 500 }}>
                                            Nenhum curso encontrado com os filtros aplicados.
                                        </div>
                                    ) : (
                                        cursosFiltrados.map((curso, idx) => (
                                            <CursoCard
                                                key={curso.id || idx}
                                                id={curso.id}
                                                imagem={curso.imagemBanner || "/img/curso-kotlin.png"}
                                                nome={curso.nome}
                                                formador={curso.formador || "Desconhecido"}
                                                dataRegisto={formatarData(curso.dataRegisto)}
                                                dataTermino={formatarData(curso.dataTermino)}
                                                nota={curso.nota || "???"}
                                                concluido={progressoCursos[curso.id] === 100}
                                                percentagem={progressoCursos[curso.id] || 0}
                                                onTransferirCertificado={() => handleTransferirCertificado(curso.inscricaoId)}
                                                inscricaoId={curso.inscricaoId}
                                            />
                                        ))
                                    )}
                                </>
                            )}
                            {/* Cursos que gere - só para formador */}
                            {user?.role === "formador" && (
                                <div className="mt-5">
                                    <h5 className="fw-bold blue-text">Cursos que gere</h5>
                                    {cursosGeridos.length === 0 ? (
                                        <div className="text-muted">Não está a gerir nenhum curso.</div>
                                    ) : (
                                        cursosGeridos.map(curso => (
                                            <CursoCard
                                                key={curso.id}
                                                id={curso.id}
                                                imagem={curso.imagemBanner || "/img/curso-kotlin.png"}
                                                nome={curso.nome}
                                                formador={user.nomeUtilizador}
                                                dataRegisto={formatarData(curso.dataUpload)}
                                                dataTermino={formatarData(curso.dataFim)}
                                                nota={"-"}
                                                concluido={true}
                                                percentagem={100}
                                                onTransferirCertificado={undefined}
                                                inscricaoId={undefined}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerfilUtilizador;