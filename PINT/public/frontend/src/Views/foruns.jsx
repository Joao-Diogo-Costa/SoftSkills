import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useCategoriasData } from "../hooks/useCategoriasData";
import { useFiltroURL } from "../hooks/useFiltroURL";
import authHeader from "./auth.header";

const Foruns = () => {
    const navigate = useNavigate();
    const [foruns, setForuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverSugest, setHoverSugest] = useState(false);
    const [hoverCancelar, setHoverCancelar] = useState(false);
    const [hoverConfirmar, setHoverConfirmar] = useState(false);
    const [fadeOutFilter, setFadeOutFilter] = useState(false);
    const [fadeOutSugest, setFadeOutSugest] = useState(false);

    // Estados para filtro
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [areaSelecionada, setAreaSelecionada] = useState("");
    const [topicoSelecionado, setTopicoSelecionado] = useState("");
    const [ordenarPor, setOrdenarPor] = useState("");
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);

    // Estados para sugestão de fórum
    const [isSugestModalOpen, setSugestModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [sugestaoData, setSugestaoData] = useState({
        nome: "",
        topicoId: ""
    });
    const [sugestaoSucesso, setSugestaoSucesso] = useState(false);

    // Novo estado para modal de erro de sugestão
    const [showSugestaoErroModal, setShowSugestaoErroModal] = useState(false);
    const [sugestaoErroMsg, setSugestaoErroMsg] = useState("");
    const [fadeOutSugestaoErro, setFadeOutSugestaoErro] = useState(false);

    const { todasCategorias, todasAreas, todasTopicos } = useCategoriasData();

    useEffect(() => {
        setLoading(true);
        axios.get("https://pint-web-htw2.onrender.com/forum/list")
            .then(res => {
                if (res.data.success) setForuns(res.data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar fóruns:", err);
            })
            .finally(() => setLoading(false));
    }, []);

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

    useFiltroURL(setCategoriaSelecionada, setAreaSelecionada, setTopicoSelecionado, setOrdenarPor);

    // Filtragem dos fóruns
    let forunsFiltrados = foruns;
    if (topicoSelecionado) {
        forunsFiltrados = forunsFiltrados.filter(forum => forum.topicoId === Number(topicoSelecionado));
    } else if (areaSelecionada) {
        const topicosDaArea = todasTopicos.filter(t => String(t.areaId) === areaSelecionada).map(t => t.id);
        forunsFiltrados = forunsFiltrados.filter(forum => topicosDaArea.includes(forum.topicoId));
    } else if (categoriaSelecionada) {
        const areasDaCategoria = todasAreas.filter(a => String(a.categoriaId) === categoriaSelecionada).map(a => a.id);
        const topicosDasAreas = todasTopicos.filter(t => areasDaCategoria.includes(t.areaId)).map(t => t.id);
        forunsFiltrados = forunsFiltrados.filter(forum => topicosDasAreas.includes(forum.topicoId));
    }

    if (ordenarPor === "popularidade") {
        forunsFiltrados = [...forunsFiltrados].sort((a, b) => (b.numParticipante || 0) - (a.numParticipante || 0));
    } else if (ordenarPor === "data") {
        forunsFiltrados = [...forunsFiltrados].sort((a, b) => new Date(b.dataUpload) - new Date(a.dataUpload));
    }

    function truncarNome(nome, max = 13) {
        if (!nome) return "";
        return nome.length > max ? nome.slice(0, max - 3) + "..." : nome;
    }

    // Função para fechar o modal de erro de sugestão com fade-out
    const handleCloseSugestaoErroModal = () => {
        setFadeOutSugestaoErro(true);
        setTimeout(() => {
            setShowSugestaoErroModal(false);
            setFadeOutSugestaoErro(false);
        }, 250);
    };

    const handleSugestForum = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            setSugestaoErroMsg("Você precisa estar logado para sugerir um fórum.");
            setShowSugestaoErroModal(true);
            return;
        }

        if (!sugestaoData.nome.trim() || !sugestaoData.topicoId) {
            setSugestaoErroMsg("Por favor, preencha todos os campos.");
            setShowSugestaoErroModal(true);
            return;
        }

        try {
            const response = await axios.post(
                "https://pint-web-htw2.onrender.com/sugestao-topico/create",
                {
                    titulo: sugestaoData.nome.trim(),
                    dataSugestao: new Date().toISOString(),
                    estado: 0,
                    utilizadorId: user.id,
                    topicoId: parseInt(sugestaoData.topicoId)
                },
                { headers: authHeader() }
            );

            if (response.data.success) {
                setSugestaoSucesso(true);
            } else {
                setSugestaoSucesso(false);
            }
        } catch (error) {
            console.error("Erro ao enviar sugestão:", error);
            setSugestaoSucesso(false);
        }

        setSugestModalOpen(false);
        setSuccessModalOpen(true);
        setSugestaoData({ nome: "", topicoId: "" });
    };

    const closeSugestModal = () => {
        setSugestModalOpen(false);
        setSugestaoData({ nome: "", topicoId: "" });
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
    };

    const handleCloseSugestModal = () => {
        setFadeOutSugest(true);
        setTimeout(() => {
            setSugestModalOpen(false);
            setFadeOutSugest(false);
            setSugestaoData({ nome: "", topicoId: "" });
        }, 250);
    };

    const handleCloseFilterModal = () => {
        setFadeOutFilter(true);
        setTimeout(() => {
            setFilterModalOpen(false);
            setFadeOutFilter(false);
        }, 250);
    };

    return (
        <div>
            <div className="row container-fluid min-vh-100 m-0 p-0 ">
                <div className="row default-container d-flex align-items-start mb-4 ">
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <h2 className="container-fluid mb-0 blue-text fw-bold ">
                                Descobre fóruns que fazem a diferença
                            </h2>
                            <h3 className="container-fluid mb-5 grey-text ">
                                Explora e participa nos fóruns disponíveis!
                            </h3>
                        </div>
                        <div className="col-md-6 d-flex align-items-start">
                            <div className="col-md-4" />
                            <div className="col-md-4 d-flex justify-content-start">
                                <p className="blue-text">
                                    Procuras algo específico e não encontras? Podes Filtrar ou Sugerir!
                                </p>
                            </div>
                            <div className="col-md-4 d-flex justify-content-sm-center justify-content-md-start gap-2">
                                <button
                                    className="btn btn-outline-primary rounded-pill"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setFilterModalOpen(true)}
                                >
                                    <i className="bi bi-funnel"></i> Filtro
                                </button>
                                <button
                                    className="btn rounded-pill"
                                    style={{
                                        cursor: "pointer",
                                        background: hoverSugest
                                            ? "#fff"
                                            : "linear-gradient(90deg, #39639D, #1C4072)",
                                        color: hoverSugest ? "#39639D" : "#fff",
                                        border: "2px solid #39639D",
                                        fontWeight: 600,
                                        transition: "background 0.2s, color 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem",
                                        minHeight: 40,
                                        padding: "0.5rem 1.2rem"
                                    }}
                                    onMouseEnter={() => setHoverSugest(true)}
                                    onMouseLeave={() => setHoverSugest(false)}
                                    onClick={() => setSugestModalOpen(true)}
                                >
                                    <i className="bi bi-plus-circle"></i> Sugerir Fórum
                                </button>

                                {/* MODAL DE FILTRO */}
                                {isFilterModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}
                                        onClick={handleCloseFilterModal}
                                    >
                                        <div
                                            className={`modal-dialog modal-dialog-centered ${fadeOutFilter ? "custom-fade-out" : "custom-fade-in"}`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-4 position-relative d-flex justify-content-center"
                                                    style={{
                                                        background: "linear-gradient(90deg, #39639D, #1C4072)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold">Filtrar Fóruns</h5>
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
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setTopicoSelecionado("");
                                                            setAreaSelecionada("");
                                                            setCategoriaSelecionada("");
                                                            setOrdenarPor("");
                                                            handleCloseFilterModal();
                                                        }}
                                                    >
                                                        Limpar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleCloseFilterModal();
                                                        }}
                                                    >
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* MODAL DE SUGESTÃO DE FÓRUM */}
                                {isSugestModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}
                                        onClick={handleCloseSugestModal}
                                    >
                                        <div className={`modal-dialog modal-dialog-centered ${fadeOutSugest ? "custom-fade-out" : "custom-fade-in"}`}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-4 position-relative d-flex justify-content-center"
                                                    style={{
                                                        background: "linear-gradient(90deg, #39639D, #1C4072)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold">Sugerir Fórum</h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#39639D" }}>
                                                    <form>
                                                        {/* Nome do Fórum */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Nome do Fórum
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Digite o nome do fórum..."
                                                                value={sugestaoData.nome}
                                                                onChange={e => setSugestaoData({
                                                                    ...sugestaoData,
                                                                    nome: e.target.value
                                                                })}
                                                            />
                                                        </div>
                                                        {/* Tópico */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-semibold fs-6">
                                                                Selecione um tópico
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={sugestaoData.topicoId}
                                                                onChange={e => setSugestaoData({
                                                                    ...sugestaoData,
                                                                    topicoId: e.target.value
                                                                })}
                                                            >
                                                                <option value="">Escolha um tópico...</option>
                                                                {todasTopicos.map(topico => (
                                                                    <option key={topico.id} value={topico.id}>
                                                                        {topico.nomeTopico}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn me-4"
                                                        style={{
                                                            width: 150,
                                                            color: hoverCancelar ? "#000" : "#39639D",
                                                            backgroundColor: hoverCancelar ? "#fff" : "#F5F9FF",
                                                            border: hoverCancelar ? "1px solid #fff" : "1px solid #A7A7A7",
                                                            borderRadius: 12,
                                                            transition: "background 0.2s, color 0.2s, border 0.2s"
                                                        }}
                                                        onMouseEnter={() => setHoverCancelar(true)}
                                                        onMouseLeave={() => setHoverCancelar(false)}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleCloseSugestModal();
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        style={{
                                                            color: hoverConfirmar ? "#39639D" : "#fff",
                                                            backgroundColor: hoverConfirmar ? "#fff" : "#39639D",
                                                            border: "1px solid #39639D",
                                                            borderRadius: 12,
                                                            transition: "background 0.2s, color 0.2s"
                                                        }}
                                                        onMouseEnter={() => setHoverConfirmar(true)}
                                                        onMouseLeave={() => setHoverConfirmar(false)}
                                                        onClick={handleSugestForum}
                                                    >
                                                        Confirmar Sugestão
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* MODAL DE SUCESSO/ERRO */}
                                {isSuccessModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
                                        onClick={closeSuccessModal}
                                    >
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                <div
                                                    className="modal-header text-white py-4 position-relative d-flex justify-content-center"
                                                    style={{
                                                        background: sugestaoSucesso
                                                            ? "linear-gradient(90deg, #28a745, #1e7e34)"
                                                            : "linear-gradient(90deg, #dc3545, #c82333)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold">
                                                        {sugestaoSucesso ? "Sucesso!" : "Erro!"}
                                                    </h5>
                                                </div>
                                                <div className="modal-body text-center py-4">
                                                    <div className="mb-3">
                                                        {sugestaoSucesso ? (
                                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
                                                        ) : (
                                                            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "3rem" }}></i>
                                                        )}
                                                    </div>
                                                    <p className="mb-0" style={{ color: "#39639D", fontSize: "1.1rem" }}>
                                                        {sugestaoSucesso
                                                            ? "A sua sugestão de fórum foi enviada com sucesso! Será analisada pela administração."
                                                            : "Ocorreu um erro ao enviar a sua sugestão. Tente novamente mais tarde."
                                                        }
                                                    </p>
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
                        {loading ? (
                            <div className="text-center w-100 mt-5">A carregar fóruns...</div>
                        ) : forunsFiltrados.length === 0 ? (
                            <div className="text-center w-100 text-muted">Nenhum fórum disponível.</div>
                        ) : (
                            forunsFiltrados.map((forum) => (
                                <div
                                    key={forum.id}
                                    className="card bg-transparent border-0 shadow-lg p-0 m-2 d-flex flex-column"
                                    style={{
                                        width: '18rem',
                                        minHeight: 340,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Link className="p-0" to={`/forum/${forum.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="p-0">
                                            <img
                                                src={forum.imagemForum || "/img/CursoPython.png"}
                                                style={{ width: '100%' }}
                                                alt={forum.nome}
                                                className="rounded-top-4"
                                            />
                                        </div>
                                    </Link>
                                    <div className="card-body blue-text" style={{ flex: 1 }}>
                                        <h3 className="card-title fw-bold">{forum.nome}</h3>
                                        <p className="card-text">{forum.descricao}</p>
                                    </div>
                                    {/* TAGS: sempre acima da faixa azul */}
                                    <div className="px-3 d-flex flex-wrap gap-2 justify-content-center mt-auto mb-2">
                                        <span className="badge bg-info text-dark">
                                            {forum.TOPICOC?.AREAC?.CATEGORIAC?.nome || "Sem categoria"}
                                        </span>
                                        <span className="badge bg-secondary">
                                            {forum.TOPICOC?.AREAC?.nome || "Sem área"}
                                        </span>
                                        <span className="badge bg-primary">
                                            {forum.TOPICOC?.nomeTopico || "Sem tópico"}
                                        </span>
                                    </div>
                                    {/* FAIXA AZUL */}
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
                                        title={forum.TOPICOC ? forum.TOPICOC.nomeTopico : ""}
                                    >
                                        <span>
                                            {forum.TOPICOC ? forum.TOPICOC.nomeTopico : "Sem tópico"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE ERRO DE SUGESTÃO */}
            {showSugestaoErroModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    aria-modal="true"
                    role="dialog"
                    style={{
                        display: "block",
                        background: "rgba(57, 99, 157, 0.5)"
                    }}
                    onClick={handleCloseSugestaoErroModal}
                >
                    <div
                        className={`modal-dialog modal-dialog-centered ${fadeOutSugestaoErro ? "custom-fade-out" : "custom-fade-in"}`}
                        style={{ maxWidth: 550 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src="/img/warning_vector.svg"
                                        alt="Ícone de Aviso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Erro na Sugestão
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    {sugestaoErroMsg}
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-voltar px-4"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleCloseSugestaoErroModal();
                                    }}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Foruns;