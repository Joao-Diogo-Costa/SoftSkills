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

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Buscar dados da tarefa
                const tarefaRes = await axios.get(
                    `http://localhost:3000/tarefa/get/${tarefaId}`,
                    { headers: authHeader() }
                );
                setTarefa(tarefaRes.data.data);

                // Buscar submissões dos alunos
                const subRes = await axios.get(
                    `http://localhost:3000/tarefa/submissoes/${tarefaId}`,
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
                                    src={sub.utilizador?.fotoPerfil || userDefault}
                                    alt={sub.utilizador?.nome}
                                    className="rounded-circle me-3"
                                    style={{ width: 56, height: 56, objectFit: "cover" }}
                                />
                                {/* Nome e data */}
                                <div style={{ minWidth: 220 }}>
                                    <div className="fw-semibold" style={{ color: "#39639D" }}>
                                        {sub.utilizador?.nome}
                                    </div>
                                    <div className="text-muted small">
                                        Entregue no dia {sub.dataSubmissao ? new Date(sub.dataSubmissao).toLocaleDateString("pt-PT") : "-"} às {sub.dataSubmissao ? new Date(sub.dataSubmissao).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </div>
                                </div>
                                {/* Ficheiro submetido */}
                                <div className="ms-4 flex-grow-1">
                                    {sub.ficheiro ? (
                                        <a
                                            href={sub.ficheiro.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary d-flex align-items-center"
                                            style={{ minWidth: 260, textAlign: "left" }}
                                        >
                                            <i className="fa-solid fa-file-lines me-2" />
                                            {sub.ficheiro.nomeOriginal}
                                        </a>
                                    ) : (
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
                                        // onClick={() => handleNota(sub)} // Implementa esta função para editar nota
                                    >
                                        {sub.nota !== null && sub.nota !== undefined ? "Editar nota" : "Atribuir nota"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GerirSubmissaoTarefa;