import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

import authHeader from "../auth.header";
import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirCursoAssincrono() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [curso, setCurso] = useState(null);
    const [aulas, setAulas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [refreshDocs, setRefreshDocs] = useState({});

    // Estados para criar aula
    const [showModal, setShowModal] = useState(false);
    const [novaAula, setNovaAula] = useState({ tituloAssincrona: "", descricaoAssincrona: "", dataLancAssincrona: "", videoLink: "" });
    const [ficheiros, setFicheiros] = useState([]);
    const [modalFade, setModalFade] = useState("custom-fade-in");
    const modalRef = useRef();
    const [loading, setLoading] = useState(false);

    // Estatodos editar aula
    const [showEditModal, setShowEditModal] = useState(false);
    const [editModalFade, setEditModalFade] = useState("custom-fade-in");
    const editModalRef = useRef();
    const [aulaEditar, setAulaEditar] = useState({ id: null, tituloAssincrona: "", descricaoAssincrona: "", dataLancAssincrona: "", videoLink: "" });
    const [editFicheiros, setEditFicheiros] = useState([]);
    const [loadingEdit, setLoadingEdit] = useState(false);

    // Estados para apagar aula
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [aulaAEliminar, setAulaAEliminar] = useState(null);

    useEffect(() => {
        // Carregar dados do curso
        axios.get(`http://localhost:3000/curso/get/${id}`, { headers: authHeader() })
            .then(res => setCurso(res.data.data));

        // Carregar aulas assincronas
        axios.get(`http://localhost:3000/aula-assincrona/curso/${id}`, { headers: authHeader() })
            .then(res => setAulas(res.data.data || []));

        // Carregar membros
        axios.get("http://localhost:3000/inscricao/list", { headers: authHeader() })
            .then(res => {
                const inscritos = (res.data.data || [])
                    .filter(insc => insc.cursoId === Number(id))
                    .map(insc => insc.Utilizador)
                    .filter(Boolean);
                setMembros(inscritos);
            })
            .catch(() => setMembros([]));
    }, [id]);

    // Criar nova aula assíncrona
    const handleCriarAula = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Criar a aula
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.post(
                "http://localhost:3000/aula-assincrona/create",
                {
                    ...novaAula,
                    cursoId: id,
                },
                { headers: authHeader() }
            );
            const aulaId = res.data.data.id;

            // 2. Se houver ficheiros, fazer upload
            if (ficheiros.length > 0) {
                const formData = new FormData();
                for (let file of ficheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `http://localhost:3000/documento-aula/${aulaId}/ficheiros`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // 3. Atualizar lista de aulas
            const aulasRes = await axios.get(`http://localhost:3000/aula-assincrona/curso/${id}`, { headers: authHeader() });
            setAulas(aulasRes.data.data || []);

            // 4. Forçar atualização dos ficheiros da nova aula (para DocumentosAula)
            setRefreshDocs(prev => ({ ...prev, [aulaId]: (prev[aulaId] || 0) + 1 }));

            setShowModal(false);
            setNovaAula({ tituloAssincrona: "", descricaoAssincrona: "", dataLancAssincrona: "", videoLink: "" });
            setFicheiros([]);
        } catch (err) {
            alert("Erro ao criar aula ou fazer upload dos ficheiros.");
        }
        setLoading(false);
    };

    // Fechar modal ao clicar fora
    useEffect(() => {
        if (!showModal) return;
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalFade("custom-fade-out");
                setTimeout(() => setShowModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    // Função para abrir modal de editar aula
    function handleEditarAula(aula) {
        setAulaEditar({
            id: aula.id,
            tituloAssincrona: aula.tituloAssincrona,
            descricaoAssincrona: aula.descricaoAssincrona,
            dataLancAssincrona: aula.dataLancAssincrona ? aula.dataLancAssincrona.slice(0, 10) : "",
            videoLink: aula.videoLink || ""
        });
        setEditFicheiros([]);
        setEditModalFade("custom-fade-in");
        setShowEditModal(true);
    }

    // Submeter edição da aula
    const handleEditarAulaSubmit = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        try {
            // Atualizar dados da aula
            await axios.put(
                `http://localhost:3000/aula-assincrona/update/${aulaEditar.id}`,
                {
                    tituloAssincrona: aulaEditar.tituloAssincrona,
                    descricaoAssincrona: aulaEditar.descricaoAssincrona,
                    dataLancAssincrona: aulaEditar.dataLancAssincrona,
                    videoLink: aulaEditar.videoLink,
                },
                { headers: authHeader() }
            );

            // Se houver ficheiros novos, fazer upload
            if (editFicheiros.length > 0) {
                const formData = new FormData();
                for (let file of editFicheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `http://localhost:3000/documento-aula/${aulaEditar.id}/ficheiros`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // Atualizar lista de aulas
            const res = await axios.get(`http://localhost:3000/aula-assincrona/curso/${id}`, { headers: authHeader() });
            setAulas(res.data.data || []);

            // Forçar atualização dos ficheiros da aula editada (para DocumentosAula)
            setRefreshDocs(prev => ({ ...prev, [aulaEditar.id]: (prev[aulaEditar.id] || 0) + 1 }));

            setShowEditModal(false);
            setAulaEditar({ id: null, tituloAssincrona: "", descricaoAssincrona: "", dataLancAssincrona: "", videoLink: "" });
            setEditFicheiros([]);
        } catch (err) {
            alert("Erro ao editar aula.");
        }
        setLoadingEdit(false);
    };

    useEffect(() => {
        if (!showEditModal) return;
        function handleClickOutside(event) {
            if (editModalRef.current && !editModalRef.current.contains(event.target)) {
                setEditModalFade("custom-fade-out");
                setTimeout(() => setShowEditModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEditModal]);


    // Função para abrir o modal de apagar aula
    function handleOpenDeleteModal(aulaId) {
        setAulaAEliminar(aulaId);
        setShowDeleteModal(true);
    }

    // Eliminar aula
    async function handleDeleteAula() {
        try {
            await axios.delete(`http://localhost:3000/aula-assincrona/delete/${aulaAEliminar}`, { headers: authHeader() });
            setAulas(aulas => aulas.filter(a => a.id !== aulaAEliminar));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Erro ao apagar aula.");
            setShowDeleteModal(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>Gerir Curso Online / SoftSkills</title>
            </Helmet>
            <div className="content flex-grow-1 no-sidebar mt-4">
                <div className="container py-4" style={{ background: "#f5f9ff", borderRadius: 8, minHeight: "90vh", overflowY: "auto", border: "1px solid #ccc" }}>
                    {/* Banner e botão voltar */}
                    <div className="row mb-4">
                        <div className="col-12 position-relative mb-5">
                            <Link
                                to="/curso-formador"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    position: "absolute",
                                    top: 20,
                                    left: 30,
                                }}
                            >
                                <i className="fa-solid fa-arrow-left fa-2x me-3 mb-3" style={{ cursor: "pointer" }} />
                            </Link>
                            <h4 className="text-center w-100" style={{ marginTop: 20 }}>
                                {curso?.nome}
                            </h4>
                        </div>
                    </div>
                    {/* Conteúdo principal */}
                    <div className="row">
                        {/* Coluna esquerda: Aulas */}
                        <div className="col-md-8">
                            {/* Aulas */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-bold" style={{ color: "#39639D" }}>Aulas Online</h5>
                                    <button
                                        className="btn btn-primary"
                                        style={{ borderRadius: 12 }}
                                        onClick={() => {
                                            setModalFade("custom-fade-in");
                                            setShowModal(true);
                                        }}
                                    >
                                        Criar aula
                                    </button>
                                </div>
                                {/* Modal para criar aula */}
                                {showModal && (
                                    <div
                                        className={`modal fade show ${modalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
                                            <form className="modal-content" onSubmit={handleCriarAula}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Dados da Nova Aula
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título da aula"
                                                            value={novaAula.tituloAssincrona}
                                                            onChange={e => setNovaAula({ ...novaAula, tituloAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição da aula"
                                                            value={novaAula.descricaoAssincrona}
                                                            onChange={e => setNovaAula({ ...novaAula, descricaoAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Data de Lançamento
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control text-muted"
                                                            value={novaAula.dataLancAssincrona}
                                                            onChange={e => setNovaAula({ ...novaAula, dataLancAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Link do Vídeo (opcional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="URL do vídeo"
                                                            value={novaAula.videoLink}
                                                            onChange={e => setNovaAula({ ...novaAula, videoLink: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setModalFade("custom-fade-out");
                                                                setTimeout(() => setShowModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loading}
                                                        >
                                                            {loading ? "A criar..." : "Criar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {/* Modal de delete aula */}
                                {showDeleteModal && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-labelledby="deleteAulaModalLabel"
                                        aria-modal="true"
                                        role="dialog"
                                        style={{
                                            display: "block",
                                            background: "rgba(57, 99, 157, 0.5)"
                                        }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img
                                                            src={iconAviso}
                                                            alt="Ícone de Aviso"
                                                            style={{ width: 64, height: 64 }}
                                                        />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                                            Apagar aula!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, a aula será apagada! Não será possível recuperar os dados!
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-voltar px-4"
                                                        onClick={() => setShowDeleteModal(false)}
                                                    >
                                                        Voltar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-continuar px-4"
                                                        onClick={handleDeleteAula}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Modal de sucesso */}
                                {showSuccessModal && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-modal="true"
                                        role="dialog"
                                        style={{
                                            display: "block",
                                            background: "rgba(57, 99, 157, 0.5)"
                                        }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img
                                                            src={iconSucesso}
                                                            alt="Ícone de sucesso"
                                                            style={{ width: 64, height: 64 }}
                                                        />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                                            Aula Apagada!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        A aula foi apagada com sucesso.
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-continuar rounded px-4"
                                                        onClick={() => setShowSuccessModal(false)}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showEditModal && (
                                    <div
                                        className={`modal fade show ${editModalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={editModalRef}>
                                            <form className="modal-content" onSubmit={handleEditarAulaSubmit}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Editar Aula
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título da aula"
                                                            value={aulaEditar.tituloAssincrona}
                                                            onChange={e => setAulaEditar({ ...aulaEditar, tituloAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição da aula"
                                                            value={aulaEditar.descricaoAssincrona}
                                                            onChange={e => setAulaEditar({ ...aulaEditar, descricaoAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Data de Lançamento
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control text-muted"
                                                            value={aulaEditar.dataLancAssincrona}
                                                            onChange={e => setAulaEditar({ ...aulaEditar, dataLancAssincrona: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Link do Vídeo (opcional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="URL do vídeo"
                                                            value={aulaEditar.videoLink}
                                                            onChange={e => setAulaEditar({ ...aulaEditar, videoLink: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Adicionar Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setEditFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setEditModalFade("custom-fade-out");
                                                                setTimeout(() => setShowEditModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingEdit}
                                                        >
                                                            {loadingEdit ? "A guardar..." : "Guardar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded p-3">
                                    {aulas.length === 0 ? (
                                        <div className="text-muted">Nenhuma aula criada.</div>
                                    ) : (
                                        aulas
                                            .map(aula => (
                                                <div
                                                    key={aula.id}
                                                    className="mb-4 p-3 bg-white shadow-sm position-relative"
                                                    style={{
                                                        borderLeft: "6px solid #39639D",
                                                        borderRadius: 8,
                                                        boxShadow: "0 2px 8px #e0e7ef"
                                                    }}
                                                >

                                                    {/* Botões editar/eliminar aula */}
                                                    <div className="position-absolute top-0 end-0 mt-2 me-2 d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Editar aula"
                                                            onClick={() => handleEditarAula(aula)}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square" style={{ color: "#39639D" }} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Eliminar aula"
                                                            onClick={() => handleOpenDeleteModal(aula.id)}
                                                        >
                                                            <i className="fa-solid fa-trash" style={{ color: "#c0392b" }} />
                                                        </button>
                                                    </div>
                                                    <div className="fw-bold fs-5" style={{ color: "#294873" }}>
                                                        {aula.tituloAssincrona}
                                                    </div>
                                                    <div className="text-muted mb-2" style={{ fontSize: 15 }}>
                                                        {aula.descricaoAssincrona}
                                                    </div>
                                                    <div className="text-muted small mb-2" style={{ fontSize: 13 }}>
                                                        Disponível desde: {aula.dataLancAssincrona ? new Date(aula.dataLancAssincrona).toLocaleDateString("pt-PT") : "-"}
                                                    </div>
                                                    {aula.videoLink && (
                                                        <div className="mb-2">
                                                            <a href={aula.videoLink} target="_blank" rel="noopener noreferrer" className="fw-semibold" style={{ color: "#39639D" }}>
                                                                Ver vídeo da aula
                                                            </a>
                                                        </div>
                                                    )}
                                                    <DocumentosAula aulaId={aula.id} refresh={refreshDocs[aula.id] || 0} />
                                                </div>

                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Coluna direita: Lista de membros */}
                        <div className="col-md-4">
                            <div className="bg-white rounded p-4 h-100" style={{ minHeight: 350, border: "1px solid #e0e7ef" }}>
                                <p className="fw-semibold">Lista de membros</p>
                                <ul
                                    className="list-group d-flex justify-content-start align-items-start"
                                    style={{ height: "100%" }}
                                >
                                    {membros.length === 0 ? (
                                        <p className="text-center text-muted">
                                            Nenhum membro inscrito neste curso
                                        </p>
                                    ) : (
                                        membros.map(membro => (
                                            <li key={membro.id} className="list-group-item d-flex align-items-center border-0 text-start">
                                                <img
                                                    src={membro.imagemPerfil || "/assets/img/default_profile_pic.jpg"}
                                                    className="rounded me-3"
                                                    style={{ width: 32, height: 32, objectFit: "cover" }}
                                                    alt={membro.nomeUtilizador}
                                                />
                                                {membro.nomeUtilizador}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Componente para listar documentos de uma aula assíncrona
function DocumentosAula({ aulaId, refresh }) {
    const [documentos, setDocumentos] = useState([]);
    const [removendoId, setRemovendoId] = useState(null);

    // Novos estados para modais de apagar ficheiro
    const [showDeleteFicheiroModal, setShowDeleteFicheiroModal] = useState(false);
    const [showSuccessFicheiroModal, setShowSuccessFicheiroModal] = useState(false);
    const [ficheiroAEliminar, setFicheiroAEliminar] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/documento-aula/${aulaId}/ficheiros`, { headers: authHeader() })
            .then(res => setDocumentos(res.data.ficheiros || []));
    }, [aulaId, refresh]);

    // Função para abrir modal de apagar ficheiro
    const handleOpenDeleteFicheiroModal = (fileId) => {
        setFicheiroAEliminar(fileId);
        setShowDeleteFicheiroModal(true);
    };

    // Função para apagar ficheiro
    const handleDeleteFicheiro = async () => {
        setRemovendoId(ficheiroAEliminar);
        try {
            await axios.delete(`http://localhost:3000/documento-aula/ficheiro/${ficheiroAEliminar}`, { headers: authHeader() });
            setDocumentos(docs => docs.filter(doc => doc.id !== ficheiroAEliminar));
            setShowDeleteFicheiroModal(false);
            setShowSuccessFicheiroModal(true);
        } catch (err) {
            alert("Erro ao remover ficheiro.");
            setShowDeleteFicheiroModal(false);
        }
        setRemovendoId(null);
    };

    if (documentos.length === 0) return null;

    return (
        <div className="mt-2 ms-2">
            <div className="fw-semibold mb-1" style={{ color: "#39639D" }}>Documentos:</div>
            <ul className="list-unstyled mb-0">
                {documentos.map(doc => {
                    const nome = doc.nomeOriginal || "";
                    const extensao = nome.split('.').pop().toLowerCase();
                    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extensao);
                    const isPdf = extensao === "pdf";
                    let icon = "fa-file-lines";
                    if (isImage) icon = "fa-file-image";
                    else if (isPdf) icon = "fa-file-pdf";
                    else if (["zip", "rar", "7z"].includes(extensao)) icon = "fa-file-zipper";
                    else if (["doc", "docx"].includes(extensao)) icon = "fa-file-word";
                    else if (["xls", "xlsx"].includes(extensao)) icon = "fa-file-excel";
                    else if (["ppt", "pptx"].includes(extensao)) icon = "fa-file-powerpoint";

                    return (
                        <li key={doc.id} className="d-flex align-items-center mb-1">
                            <i className={`fa-solid ${icon} me-2`} style={{ color: "#39639D", fontSize: 18 }} />
                            {isImage ? (
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fw-semibold file-link"
                                    style={{ color: "#294873", textDecoration: "underline" }}
                                >
                                    {nome}
                                </a>
                            ) : (
                                <a
                                    href={doc.url}
                                    download={nome}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fw-semibold file-link"
                                    style={{ color: "#294873", textDecoration: "underline" }}
                                >
                                    {nome}
                                </a>
                            )}
                            {/* Botão de remover ficheiro */}
                            <button
                                className="btn btn-link btn-sm ms-2 p-0"
                                title="Remover ficheiro"
                                style={{ color: "#c0392b" }}
                                onClick={() => handleOpenDeleteFicheiroModal(doc.id)}
                                disabled={removendoId === doc.id}
                            >
                                <i className={`fa-solid fa-trash${removendoId === doc.id ? " fa-spin" : ""}`} />
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Modal de apagar ficheiro */}
            {showDeleteFicheiroModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    aria-labelledby="deleteFicheiroModalLabel"
                    aria-modal="true"
                    role="dialog"
                    style={{
                        display: "block",
                        background: "rgba(57, 99, 157, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src={iconAviso}
                                        alt="Ícone de Aviso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Apagar ficheiro!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    Ao confirmar, o ficheiro será apagado! Não será possível recuperar os dados!
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-voltar px-4"
                                    onClick={() => setShowDeleteFicheiroModal(false)}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-continuar px-4"
                                    onClick={handleDeleteFicheiro}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de sucesso ao apagar ficheiro */}
            {showSuccessFicheiroModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    aria-modal="true"
                    role="dialog"
                    style={{
                        display: "block",
                        background: "rgba(57, 99, 157, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src={iconSucesso}
                                        alt="Ícone de sucesso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Ficheiro Apagado!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    O ficheiro foi apagado com sucesso.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-continuar rounded px-4"
                                    onClick={() => setShowSuccessFicheiroModal(false)}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GerirCursoAssincrono;