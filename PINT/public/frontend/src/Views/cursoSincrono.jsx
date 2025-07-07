import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import authHeader from "./auth.header";

const CursoSincrono = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [curso, setCurso] = useState({});
    const [avisos, setAvisos] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [conteudo, setConteudo] = useState([]);
    const [inscrito, setInscrito] = useState(false);
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
    const [isSignUpSucessModalOpen, setSignUpSucessModalOpen] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Estados para entrega de tarefa
    const [showEntregaModal, setShowEntregaModal] = useState(false);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
    const [ficheiro, setFicheiro] = useState(null);
    const [entregaLoading, setEntregaLoading] = useState(false);
    const [entregaMsg, setEntregaMsg] = useState("");
    const [minhasSubmissoes, setMinhasSubmissoes] = useState([]);
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        // Carregar dados do curso
        axios.get(`https://pint-web-htw2.onrender.com/curso/get/${id}`,
            { headers: authHeader() })
            .then(res => setCurso(res.data.data));

        // Carregar conteudo
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/conteudo`,
            { headers: authHeader() })
            .then(res => setConteudo(res.data.data || []));

        // Carregar tarefas
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/tarefa`,
            { headers: authHeader() })
            .then(res => setTarefas(res.data.data || []));

        // Carregar avisos
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/aviso`,
            { headers: authHeader() })
            .then(res => setAvisos(res.data.data || []));
    }, [id]);

    useEffect(() => {
        if (!user) return;
        axios.get("https://pint-web-htw2.onrender.com/inscricao/list", { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    const jaInscrito = res.data.data.some(
                        insc =>
                            insc.utilizadorId === user.id &&
                            insc.cursoId === Number(id)
                    );
                    setInscrito(jaInscrito);
                }
            });

        axios.get("https://pint-web-htw2.onrender.com/submissao-tarefa/list", { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    const minhas = res.data.data.filter(
                        sub => sub.utilizadorId === user.id
                    );
                    setMinhasSubmissoes(minhas);
                }
            });
    }, [user, id]);

    function handleInscrever() {
        if (!user) {
            setErrorMsg("É necessário estar autenticado para se inscrever.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
                navigate("/login");
            }, 1800);
            return;
        }
        axios.post("https://pint-web-htw2.onrender.com/inscricao/create", {
            utilizadorId: user.id,
            cursoId: Number(id)
        }, {
            headers: authHeader()
        })
            .then(res => {
                if (res.data.success) {
                    setSignUpModalOpen(false);
                    setSignUpSucessModalOpen(true);
                    setInscrito(true);
                } else {
                    setErrorMsg(res.data.message || "Erro ao inscrever.");
                    setShowErrorModal(true);
                }
            })
            .catch(() => {
                setErrorMsg("Erro ao inscrever.");
                setShowErrorModal(true);
            });
    }

    function closeSignUpSucessModal() {
        setSignUpSucessModalOpen(false);
    }

    // Função para abrir modal de entrega de tarefa
    function handleAbrirEntregaModal(tarefa) {
        setTarefaSelecionada(tarefa);
        setShowEntregaModal(true);
        setFicheiro(null);
        setEntregaMsg("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // Função para submeter ficheiro
    function handleSubmeterTarefa(e) {
        e.preventDefault();
        if (!ficheiro || !tarefaSelecionada) return;
        setEntregaLoading(true);
        setEntregaMsg("");
        const formData = new FormData();
        formData.append("ficheiro", ficheiro);
        axios.post(
            `https://pint-web-htw2.onrender.com/submissao-tarefa/upload/${tarefaSelecionada.id}`,
            formData,
            { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
        )
            .then(res => {
                if (res.data.success) {
                    setEntregaMsg("Submissão efetuada com sucesso!");
                    setMinhasSubmissoes(prev => [...prev, res.data.submissao]);
                    setShowEntregaModal(false); // FECHA O MODAL!
                    setFicheiro(null);          // LIMPA O FICHEIRO!
                } else {
                    setEntregaMsg(res.data.message || "Erro ao submeter.");
                }
            })
            .catch((err) => setEntregaMsg(err.response?.data?.details || err.response?.data?.message || "Erro ao submeter. (catch)"))
            .finally(() => setEntregaLoading(false));
    }

    function handleDeleteSubmissao(submissaoId) {
        if (!window.confirm("Tem a certeza que deseja eliminar esta submissão?")) return;
        setEntregaLoading(true);
        axios.delete(
            `https://pint-web-htw2.onrender.com/submissao-tarefa/delete/${submissaoId}`,
            { headers: authHeader() }
        )
            .then(res => {
                if (res.data.success) {
                    setMinhasSubmissoes(prev => prev.filter(sub => sub.id !== submissaoId));
                    setEntregaMsg("Submissão eliminada com sucesso!");
                } else {
                    setEntregaMsg(res.data.message || "Erro ao eliminar submissão.");
                }
            })
            .catch(err => setEntregaMsg(err.response?.data?.details || err.response?.data?.message || "Erro ao eliminar submissão."))
            .finally(() => setEntregaLoading(false));
    }

    useEffect(() => {
        if (curso && curso.nome) {
            document.title = `${curso.nome} / SoftSkills`;
        } else {
            document.title = "Curso / SoftSkills";
        }
    }, [curso]);

    if (!curso || !curso.nome) return <div>Carregando...</div>;

    return (
        <>
            <div className="container-fluid min-vh-100 m-0 p-0">
                <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                    style={{
                        height: "350px",
                        backgroundImage: `url('${curso.imagemBanner || "/img/curso-java.png"}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}>
                    <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }} />
                    <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                        <div className="fw-bold fs-2" style={{ color: "white" }}>{curso.nome}</div>
                        <div style={{ color: "white" }}>{curso.descricaoCurso}</div>
                    </div>
                </div>

                <div className="row container2 mt-5">
                    <div className="col-md-6">
                        {!inscrito && (
                            <>
                                <h2 className="mb-0 blue-text fw-bold">Bem-vindo! 👋</h2>
                                <p className="mb-5 blue-text">
                                    Realize a sua inscrição para conseguir aceder a todo o conteúdo de forma gratuita!
                                </p>
                            </>
                        )}
                    </div>
                    <div className="col-md-6 d-flex align-items-start justify-content-end">
                        <div className="col-md-4" />
                        <div className="col-4 row">
                            <div className="col-12 d-flex justify-content-center">
                                <p className="blue-text">
                                    Interessado? Inscreva-se!
                                </p>
                            </div>
                            <div className="col-md-12 d-flex justify-content-center align-items-center">
                                <button
                                    type="button"
                                    className={`btn rounded-pill w-100 ${inscrito ? "btn-secondary" : "btn-primary botao"}`}
                                    style={{ cursor: inscrito ? "not-allowed" : "pointer" }}
                                    onClick={() => {
                                        if (!inscrito) setSignUpModalOpen(true);
                                    }}
                                    disabled={inscrito}
                                >
                                    {inscrito ? "Inscrito" : "Inscrever"}
                                </button>
                            </div>
                            {/* MODAL DE INSCRIÇÃO */}
                            {isSignUpModalOpen && (
                                <div className="modal fade show" style={{
                                    display: "block", background:
                                        "rgba(57, 99, 157, 0.5)"
                                }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                style={{ background: "linear-gradient(90deg, #39639D, #1C4072)" }}>
                                                <h5 className="fw-bold">
                                                    Confirmar Inscrição
                                                </h5>
                                            </div>
                                            <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                <form>
                                                    <h5 className="fw-bold fs-3 ms-4 text-center" style={{
                                                        color: "#39639D"
                                                    }}>
                                                        Curso - {curso.nome}
                                                    </h5>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6 text-center " style={{
                                                            color: "#39639D"
                                                        }}>
                                                            Para confirmar a tua inscrição no curso <strong>{curso.nome}</strong> clica no botão abaixo
                                                        </label>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button type="button" className="btn btn-primary botao" onClick={handleInscrever}>
                                                    Inscrever
                                                </button>
                                                <button type="button" className="btn btn-light me-4" onClick={() =>
                                                    setSignUpModalOpen(false)} > Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* MODAL DE SUCESSO */}
                            {isSignUpSucessModalOpen && (
                                <div className="modal fade show" style={{
                                    display: "block", background:
                                        "rgba(57, 99, 157, 0.5)"
                                }}>
                                    <div className="modal-dialog modal-dialog-centered" style={{
                                        maxWidth: 550
                                    }}>
                                        <div className="modal-content">
                                            <div className="modal-body py-4">
                                                <div className="d-flex flex-column align-items-center mb-3">
                                                    <img src="/img/success_vector.svg" alt="Ícone de sucesso" />
                                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                                        Sucesso
                                                    </h1>
                                                </div>
                                                <p className="text-center fs-5">
                                                    Inscrição realizada com sucesso!
                                                </p>
                                            </div>
                                            <div className="modal-footer justify-content-center py-3">
                                                <button type="button" className="btn btn-primary botao rounded" onClick={closeSignUpSucessModal}>
                                                    Continuar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AVISOS */}
                <div className="default-container row mb-3 justify-content-center">
                    <div className="col-6 p-0 m-0 ms-5 shadow-lg ">
                        <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                            <h5 className="text-white fw-bold m-0 ms-2">Avisos Gerais</h5>
                        </div>
                        <div className="container-fluid" style={{ maxHeight: 335, overflowY: 'auto', overflowWrap: "break-word" }}>
                            {!inscrito ? (
                                <div className="text-center text-muted py-4">
                                    Só os utilizadores inscritos podem aceder aos avisos deste curso.
                                </div>
                            ) : avisos.length === 0 ? (
                                <div className="text-center text-muted py-4">Sem avisos para este curso.</div>
                            ) : (
                                avisos.map((aviso, idx) => (
                                    <div className="row ms-2 me-2 mb-2" key={aviso.id || idx}>
                                        <p className="col-6 fw-bold blue-text mt-3">{aviso.titulo}</p>
                                        <p className="col-12">{aviso.descricao}</p>
                                        <p className="col-12 mb-3 grey-text">{new Date(aviso.dataPublicacao).toLocaleString("pt-PT")}</p>
                                        <div className="border border-secondary d-flex justify-content-center"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-2 card m-0 p-0 ms-3 shadow-lg">
                        <img src={curso.formador?.imagemPerfil || "/img/professor.png"} alt="" />
                        <div className="card-body">
                            <p className="card-tittle blue-text">Lecionado por: </p>
                            <p className="card-tittle blue-text  d-flex justify-content-center fw-bold mb-0">Prof.</p>
                            <h5 className="card-text blue-text fw-bold d-flex justify-content-center">
                                {curso.formador?.nomeUtilizador || "Desconhecido"}
                            </h5>
                        </div>
                    </div>
                </div>

                {/* TAREFAS */}
                <div className="default-container row mb-3 justify-content-center">
                    <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                        <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                            <h5 className="text-white fw-bold m-0 ms-2">Entrega de Trabalhos de Avaliação</h5>
                        </div>
                        <div className="container-fluid" style={{ maxHeight: 325, overflowY: 'auto' }}>
                            {!inscrito ? (
                                <div className="text-center text-muted py-4">
                                    Só os utilizadores inscritos podem aceder às tarefas deste curso.
                                </div>
                            ) : tarefas.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    Ainda não existem tarefas disponíveis para este curso.
                                </div>
                            ) : (
                                tarefas.map((tarefa, idx) => {
                                    const minhaSubmissao = minhasSubmissoes.find(sub => sub.idTarefa === tarefa.id);
                                    return (
                                        <div className="mb-3 px-2" key={tarefa.id || idx}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="fw-bold blue-text mt-3 mb-0">{tarefa.titulo}</p>
                                                <div className="rounded-pill mt-2 mb-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#efeeee", minWidth: 70 }}>
                                                    <p className="blue-text fw-bold m-0">
                                                        {minhaSubmissao && minhaSubmissao.nota !== null && minhaSubmissao.nota !== undefined
                                                            ? minhaSubmissao.nota
                                                            : "??"}/20
                                                    </p>
                                                </div>
                                            </div>
                                            <p>{tarefa.descricao}</p>
                                            <p className="mb-3 grey-text">
                                                Data limite - {new Date(tarefa.dataLimite).toLocaleDateString("pt-PT")}
                                            </p>

                                            {minhaSubmissao && (
                                                <div className="alert alert-success d-flex align-items-center gap-2 py-2 my-2 justify-content-between mb-3">
                                                    <span className="d-flex align-items-center">
                                                        <i className="fa-solid fa-circle-check me-2" style={{ color: "#2ecc71", fontSize: 18 }} />
                                                        Ficheiro submetido:&nbsp;
                                                        <a href={minhaSubmissao.url} target="_blank" rel="noopener noreferrer" className="fw-semibold" style={{ color: "#294873", textDecoration: "underline" }}>
                                                            {minhaSubmissao.nomeOriginal}
                                                        </a>
                                                    </span>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm ms-2"
                                                        title="Eliminar submissão"
                                                        onClick={() => handleDeleteSubmissao(minhaSubmissao.id)}
                                                    >
                                                        <i className="fa-solid fa-trash" />
                                                    </button>
                                                </div>
                                            )}

                                            {!minhaSubmissao && (
                                                <button
                                                    className="btn btn-primary rounded-pill mb-3"
                                                    onClick={() => handleAbrirEntregaModal(tarefa)}
                                                >
                                                    Entregar Documento
                                                </button>
                                            )}
                                            <div className="border border-secondary"></div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <div className="col-3 ms-3"></div>
                </div>

                {/* MODAL DE ENTREGA DE TAREFA */}
                {showEntregaModal && tarefaSelecionada && (
                    <div className="modal fade show" style={{ display: "block", background: "rgba(57,99,157,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleSubmeterTarefa}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Entregar Tarefa</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEntregaModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p><strong>{tarefaSelecionada.titulo}</strong></p>
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={fileInputRef}
                                            onChange={e => setFicheiro(e.target.files[0])}
                                            required
                                        />
                                        {entregaMsg && <div className="alert alert-info mt-2">{entregaMsg}</div>}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary" disabled={entregaLoading}>
                                            {entregaLoading ? "A enviar..." : "Submeter"}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowEntregaModal(false)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conteudos */}
                <div className="default-container row mb-3 justify-content-center">
                    <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                        <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                            <h5 className="text-white fw-bold m-0 ms-2">Conteúdo</h5>
                        </div>
                        <div className="bg-white rounded p-3">
                            {!inscrito ? (
                                <div className="text-center text-muted py-4">
                                    Só os utilizadores inscritos podem aceder ao conteúdo deste curso.
                                </div>
                            ) : conteudo.length === 0 ? (
                                <div className="text-muted">Nenhum conteúdo criado.</div>
                            ) : (
                                [...conteudo]
                                    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                                    .map(conteudo => (
                                        <div
                                            key={conteudo.id}
                                            className="mb-4 p-3 bg-white shadow-sm position-relative"
                                            style={{
                                                borderLeft: "6px solid #39639D",
                                                borderRadius: 8,
                                                boxShadow: "0 2px 8px #e0e7ef"
                                            }}
                                        >
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="fa-solid fa-book-open me-2" style={{ color: "#39639D", fontSize: 22 }} />
                                                <span className="fw-bold fs-5" style={{ color: "#294873" }}>
                                                    {conteudo.titulo}
                                                </span>
                                            </div>
                                            {conteudo.descricao && (
                                                <div className="mb-2 ms-4 text-muted" style={{ fontSize: 15 }}>
                                                    {conteudo.descricao}
                                                </div>
                                            )}
                                            {/* Ficheiros associados ao conteúdo */}
                                            {conteudo.ficheiros && conteudo.ficheiros.length > 0 && (
                                                <ul className="list-unstyled mb-0 ms-4">
                                                    {conteudo.ficheiros.map(fich => {
                                                        const nome = fich.nomeOriginal || "";
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
                                                            <li key={fich.id} className="d-flex align-items-center mb-1">
                                                                <i className={`fa-solid ${icon} me-2`} style={{ color: "#39639D", fontSize: 18 }} />
                                                                {isImage ? (
                                                                    <a
                                                                        href={fich.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="fw-semibold file-link"
                                                                        style={{ color: "#294873", textDecoration: "underline" }}
                                                                    >
                                                                        {nome}
                                                                    </a>
                                                                ) : (
                                                                    <a
                                                                        href={fich.url}
                                                                        download={nome}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="fw-semibold file-link"
                                                                        style={{ color: "#294873", textDecoration: "underline" }}
                                                                    >
                                                                        {nome}
                                                                    </a>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                    <div className="col-3 ms-3"></div>
                </div>

                {/* MODAL DE ERRO */}
                {showErrorModal && (
                    <div
                        className="modal fade show"
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                        style={{
                            display: "block",
                            background: "rgba(57, 99, 157, 0.5)"
                        }}
                        onClick={() => setShowErrorModal(false)}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered custom-fade-in"
                            style={{ maxWidth: 550 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-body py-4">
                                    <div className="d-flex flex-column align-items-center mb-3">
                                        <img src="/img/warning_vector.svg" alt="Ícone de Erro" style={{ width: 64, height: 64 }} />
                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                            Erro
                                        </h1>
                                    </div>
                                    <p className="text-center fs-5">
                                        {errorMsg}
                                    </p>
                                </div>
                                <div className="modal-footer justify-content-center py-3">
                                    <button
                                        type="button"
                                        className="btn btn-voltar px-4"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowErrorModal(false);
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
        </>
    );
};

export default CursoSincrono;