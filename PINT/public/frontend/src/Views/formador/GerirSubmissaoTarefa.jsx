import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import authHeader from "../auth.header";
import userDefault from "../../assets/admin/img/default_profile_pic.png";

function GerirSubmissaoTarefa() {
    const { tarefaId } = useParams();
    const [submissoes, setSubmissoes] = useState([]);
    const [tarefa, setTarefa] = useState({});
    const [loading, setLoading] = useState(true);
    const [showNotaModal, setShowNotaModal] = useState(false);
    const [notaAtual, setNotaAtual] = useState("");
    const [submissaoSelecionada, setSubmissaoSelecionada] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Buscar dados da tarefa
                const tarefaRes = await axios.get(
                    `https://pint-web-htw2.onrender.com/tarefa/get/${tarefaId}`,
                    { headers: authHeader() }
                );
                setTarefa(tarefaRes.data.data);

                // Buscar submissões dos alunos
                const subRes = await axios.get(
                    `https://pint-web-htw2.onrender.com/submissao-tarefa/por-tarefa/${tarefaId}`,
                    { headers: authHeader() }
                );
                setSubmissoes(subRes.data.data || []);
            } catch {
                setTarefa({});
                setSubmissoes([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [tarefaId]);

    const handleAbrirNota = (sub) => {
        setSubmissaoSelecionada(sub);
        setNotaAtual(sub.nota ?? "");
        setShowNotaModal(true);
    };

    const handleGuardarNota = async () => {
        if (!submissaoSelecionada) return;
        try {
            await axios.put(
                `https://pint-web-htw2.onrender.com/submissao-tarefa/${submissaoSelecionada.id}/nota`,
                { nota: notaAtual },
                { headers: authHeader() }
            );
            // Atualiza submissões localmente
            setSubmissoes(submissoes =>
                submissoes.map(s =>
                    s.id === submissaoSelecionada.id ? { ...s, nota: notaAtual } : s
                )
            );
            setShowNotaModal(false);
        } catch (err) {
            alert("Erro ao guardar nota.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="rounded shadow-sm p-4" style={{ background: "#F5F9FF" }}>
                <h5 className="fw-semibold mb-4" style={{ color: "#39639D" }}>
                    Submissões da tarefa - {tarefa?.titulo}
                </h5>
                {loading ? (
                    <div className="text-center text-muted py-5">A carregar...</div>
                ) : submissoes.length === 0 ? (
                    <div className="text-center text-muted py-5">Nenhuma submissão encontrada.</div>
                ) : (
                    <div>
                        {submissoes.map((sub, idx) => (
                            <div
                                key={sub.id}
                                className="d-flex align-items-center mb-4 p-3 rounded"
                                style={{ background: "#fff" }}
                            >
                                {/* Foto do utilizador */}
                                <img
                                src={sub.UTILIZADOR?.imagemPerfil || userDefault}
                                alt={sub.UTILIZADOR?.nomeUtilizador}
                                className="rounded-circle me-3"
                                style={{ width: 56, height: 56, objectFit: "cover" }}
                                />
                                {/* Nome e data */}
                                <div style={{ minWidth: 220 }}>
                                    <div className="fw-semibold" style={{ color: "#39639D" }}>
                                        {sub.UTILIZADOR?.nomeUtilizador}
                                    </div>
                                    <div className="text-muted small">
                                        Entregue no dia {sub.dataSubmissao ? new Date(sub.dataSubmissao).toLocaleDateString("pt-PT") : "-"} às {sub.dataSubmissao ? new Date(sub.dataSubmissao).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </div>
                                </div>
                                {/* Ficheiro submetido */}
                                <div className="ms-4 flex-grow-1">
                                    {sub.url ? (() => {
                                        const nome = sub.nomeOriginal || "";
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
                                            <a
                                                href={sub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-flex align-items-center gap-2 px-3 py-2"
                                                style={{
                                                    minWidth: 220,
                                                    textAlign: "left",
                                                    fontWeight: 500,
                                                    borderRadius: 12,
                                                    background: "#f5f9ff",
                                                    boxShadow: "0 2px 8px #e0e7ef",
                                                    color: "#294873",
                                                    textDecoration: "none",
                                                    transition: "background 0.2s, box-shadow 0.2s"
                                                }}
                                                title={`Abrir ${nome}`}
                                                download={nome}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.background = "#e0e7ef";
                                                    e.currentTarget.style.boxShadow = "0 4px 16px #c9d6e6";
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.background = "#f5f9ff";
                                                    e.currentTarget.style.boxShadow = "0 2px 8px #e0e7ef";
                                                }}
                                            >
                                                <i className={`fa-solid ${icon}`} style={{ fontSize: 20, color: "#39639D" }} aria-hidden="true" />
                                                <span className="text-truncate" style={{ maxWidth: 150 }}>{nome}</span>
                                            </a>
                                        );
                                    })() : (
                                        <span className="text-muted">Sem ficheiro</span>
                                    )}
                                </div>
                                {/* Nota */}
                                <div className="ms-4" style={{ minWidth: 120 }}>
                                    <span className="fw-semibold" style={{ color: "#39639D" }}>
                                        Nota:{" "}
                                    </span>
                                    <span className="fw-bold">
                                        {sub.nota !== null && sub.nota !== undefined
                                            ? sub.nota
                                            : <span style={{ color: "#c0392b" }}>POR ATRIBUIR</span>}
                                    </span>
                                </div>
                                {/* Botão de nota */}
                                <div className="ms-4">
                                    <button
                                        className="btn"
                                        style={{
                                            background: "#39639D",
                                            color: "#fff",
                                            borderRadius: 12,
                                            minWidth: 140,
                                            fontWeight: 500
                                        }}
                                        onClick={() => handleAbrirNota(sub)}
                                    >
                                        {sub.nota !== null && sub.nota !== undefined ? "Editar nota" : "Atribuir nota"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Modal de atribuir/editar nota */}
{showNotaModal && submissaoSelecionada && (
    <div
        className="modal fade show"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
            display: "block",
            background: "rgba(57, 99, 157, 0.5)"
        }}
        onClick={e => {
            if (e.target === e.currentTarget) setShowNotaModal(false);
        }}
    >
        <div className="modal-dialog modal-dialog-centered custom-fade-in">
            <div className="modal-content">
                <div
                    className="modal-header text-white py-4"
                    style={{
                        background: "linear-gradient(90deg, #39639D, #1C4072)"
                    }}
                >
                    <h5 className="modal-title fw-bold" style={{ marginLeft: "auto", marginRight: "auto" }}>
                        {submissaoSelecionada.nota !== null && submissaoSelecionada.nota !== undefined
                            ? "Editar Nota"
                            : "Atribuir Nota"}
                    </h5>
                </div>
                <div className="modal-body" style={{ color: "#294873" }}>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleGuardarNota();
                        }}
                    >
                        <div className="mb-3 text-center">
                            <label className="form-label fw-semibold fs-5" style={{ color: "#39639D" }}>
                                Nota (0 a 20)
                            </label>
                            <input
                                type="number"
                                className="form-control text-center"
                                value={notaAtual}
                                onChange={e => setNotaAtual(e.target.value)}
                                min={0}
                                max={20}
                                placeholder="Nota"
                                style={{ fontSize: 22, fontWeight: 600, maxWidth: 120, margin: "0 auto" }}
                                required
                            />
                        </div>
                        <div className="modal-footer d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-cancelar me-4"
                                onClick={() => setShowNotaModal(false)}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-editar">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
}

export default GerirSubmissaoTarefa;