import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';
import authHeader from '../auth.header';

import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirDenuncia() {
    const [denuncias, setDenuncias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalFadeOut, setModalFadeOut] = useState(false);
    const [denunciaParaRemover, setDenunciaParaRemover] = useState(null);
    const [tipoRemocao, setTipoRemocao] = useState(""); // "denuncia" ou "comentario"

    const [showFiltro, setShowFiltro] = useState(false);
    const [ordemData, setOrdemData] = useState("desc");
    const [ordemDenunciado, setOrdemDenunciado] = useState(false);

    const filtroRef = useRef();

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

    useEffect(() => {
        axios.get("http://localhost:3000/denuncia/list")
            .then(res => {
                if (res.data.success) {
                    setDenuncias(res.data.data);
                }
            })
            .catch(() => setDenuncias([]))
            .finally(() => setLoading(false));
    }, []);

    // Modal handlers
    const handleDeleteClick = (id, tipo = "denuncia") => {
        setDenunciaParaRemover(id);
        setTipoRemocao(tipo);
        setShowDeleteModal(true);
    };

    // Eliminar só a denúncia
    const handleDeleteDenuncia = async () => {
        if (!denunciaParaRemover) return;
        try {
            await axios.delete(`http://localhost:3000/denuncia/delete/${denunciaParaRemover}`,
                { headers: authHeader() }
            );
            setDenuncias(denuncias.filter(d => d.id !== denunciaParaRemover));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Erro ao apagar denúncia.");
            setShowDeleteModal(false);
        }
    };

    // Eliminar o comentário (e todas as denúncias associadas)
    const handleDeleteComentario = async () => {
        if (!denunciaParaRemover) return;
        const denuncia = denuncias.find(d => d.id === denunciaParaRemover);
        const comentarioId = denuncia?.Comentario?.id;
        if (!comentarioId) return;
        try {
            await axios.delete(`http://localhost:3000/comentario/delete/${comentarioId}`,
                { headers: authHeader() }
            );
            setDenuncias(denuncias.filter(d => d.Comentario?.id !== comentarioId));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Erro ao apagar comentário.");
            setShowDeleteModal(false);
        }
    };

    const closeSuccessModal = () => {
        setModalFadeOut(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            setModalFadeOut(false);
        }, 250);
    };

    // Conta denúncias por cada autor de comentário
    const contagemDenunciados = {};
    denuncias.forEach(d => {
        const id = d.Comentario?.Utilizador?.id;
        if (!id) return;
        if (!contagemDenunciados[id]) contagemDenunciados[id] = 0;
        contagemDenunciados[id]++;
    });

    // Ordena por data OU por mais denunciado
    let denunciasOrdenadas = [...denuncias];
    if (ordemDenunciado) {
        denunciasOrdenadas.sort((a, b) => {
            const countA = contagemDenunciados[a.Comentario?.Utilizador?.id] || 0;
            const countB = contagemDenunciados[b.Comentario?.Utilizador?.id] || 0;
            return countB - countA;
        });
    } else {
        denunciasOrdenadas.sort((a, b) => {
            if (ordemData === "asc") {
                return new Date(a.dataDenuncia) - new Date(b.dataDenuncia);
            } else {
                return new Date(b.dataDenuncia) - new Date(a.dataDenuncia);
            }
        });
    }

    // Filtro final
    const denunciasFiltradas = denunciasOrdenadas
        .filter(d =>
            (d.Utilizador?.nomeUtilizador || "").toLowerCase().includes(search.toLowerCase()) ||
            (d.Comentario?.texto || "").toLowerCase().includes(search.toLowerCase()) ||
            (d.descricao || "").toLowerCase().includes(search.toLowerCase())
        );

    return (
        <>
            <Helmet>
                <title>Gerir Denúncia / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">
                <PerfilAdmin />
                <div className="container mt-4">
                    {/* Tabela */}
                    <div className="container mt-4">
                        <div className="row d-flex justify-content-between">
                            <div className="d-flex align-items-center position-relative" >
                                <button
                                    className="btn btn-sm me-4 btn-filtro"
                                    onClick={() => setShowFiltro(v => !v)}
                                    type="button"
                                >
                                    <i className="fa-solid fa-filter me-2" />
                                    Filtros
                                </button>
                                {showFiltro && (
                                    <div ref={filtroRef}
                                        className="shadow rounded p-3 mb-3"
                                        style={{
                                            position: "absolute",
                                            top: "110%",
                                            left: 0,
                                            background: "#fff",
                                            zIndex: 10,
                                            minWidth: 220,
                                        }}
                                    >
                                        <div className="mb-2">
                                            <label className="fw-semibold">Ordenar por data</label>
                                            <select
                                                className="form-select mt-1"
                                                value={ordemData}
                                                onChange={e => setOrdemData(e.target.value)}
                                                disabled={ordemDenunciado}
                                            >
                                                <option value="desc">Mais recente</option>
                                                <option value="asc">Mais antiga</option>
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label className="fw-semibold">Ordenar por mais denunciado</label>
                                            <input
                                                type="checkbox"
                                                className="form-check-input ms-2"
                                                checked={ordemDenunciado}
                                                onChange={e => setOrdemDenunciado(e.target.checked)}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-sm btn-secondary mt-2 w-100"
                                            onClick={() => {
                                                setOrdemData("desc");
                                                setOrdemDenunciado(false);
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
                                        placeholder="Procurar denúncia"
                                        aria-label="Search"
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </form>
                            </div>
                            <div className="col-12 mt-3">
                                <div
                                    className={`table-responsive mt-3" ${(!loading && denunciasFiltradas.length === 0) ? "d-flex justify-content-center align-items-center" : ""}`}
                                    style={{
                                        maxHeight: 665, 
                                        overflowY: "auto",
                                        border: "1px solid #ccc"
                                    }}
                                >
                                    <table className="table table-hover tabela-users mb-0">       
                                        <thead className="shadow-sm tabela-header">
                                            <tr>
                                                <th className="fw-semibold text-center fs-5">Nome</th>
                                                <th className="fw-semibold text-center fs-5">Data</th>
                                                <th className="fw-semibold text-center fs-5">Comentário</th>
                                                <th className="fw-semibold text-center fs-5">Autor do comentário</th>
                                                <th className="fw-semibold text-center fs-5">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center">A carregar...</td>
                                                </tr>
                                            ) : denunciasFiltradas.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center" style={{ maxHeight: 665 }}>Nenhuma denúncia encontrada.</td>
                                                </tr>
                                            ) : (
                                                denunciasFiltradas.map(denuncia => (
                                                    <tr key={denuncia.id}>
                                                        <td className="text-center align-middle">{denuncia.Utilizador?.nomeUtilizador || "-"}</td>
                                                        <td className="text-center align-middle">{denuncia.dataDenuncia ? new Date(denuncia.dataDenuncia).toLocaleDateString("pt-PT") : ""}</td>
                                                        <td className="text-center align-middle">{denuncia.Comentario?.texto || "-"}</td>
                                                        <td className="text-center align-middle">{denuncia.Comentario?.Utilizador?.nomeUtilizador || "-"}</td>
                                                        <td className="text-center align-middle">
                                                            {/* Eliminar só a denúncia */}
                                                            <i
                                                                className="fa-regular fa-flag"
                                                                title="Eliminar denúncia"
                                                                style={{ cursor: "pointer", color: "#e67e22", marginRight: 12 }}
                                                                onClick={() => handleDeleteClick(denuncia.id, "denuncia")}
                                                            />
                                                            {/* Eliminar o comentário */}
                                                            <i
                                                                className="fa-regular fa-trash-can"
                                                                title="Eliminar comentário"
                                                                style={{ cursor: "pointer", color: "#e74c3c" }}
                                                                onClick={() => handleDeleteClick(denuncia.id, "comentario")}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de confirmação de remoção */}
            {showDeleteModal && (
                <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                    style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img src={iconAviso} alt="Ícone de Aviso" style={{ width: 64, height: 64 }} />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        {tipoRemocao === "comentario" ? "Apagar comentário!" : "Apagar denúncia!"}
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    {tipoRemocao === "comentario"
                                        ? "Ao confirmar, o comentário e todas as denúncias associadas serão apagados!"
                                        : "Ao confirmar, apenas a denúncia será apagada!"}
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button type="button" className="btn btn-voltar px-4" onClick={() => setShowDeleteModal(false)}>
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-continuar px-4"
                                    onClick={tipoRemocao === "comentario" ? handleDeleteComentario : handleDeleteDenuncia}
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
                <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                    style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                    <div className={`modal-dialog modal-dialog-centered ${modalFadeOut ? "custom-fade-out" : "custom-fade-in"}`}
                        style={{ maxWidth: 550 }}
                    >
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img src={iconSucesso} alt="Ícone de sucesso" style={{ width: 64, height: 64 }} />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        {tipoRemocao === "comentario" ? "Comentário Apagado!" : "Denúncia Apagada!"}
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    {tipoRemocao === "comentario"
                                        ? "O comentário e as denúncias associadas foram apagados com sucesso."
                                        : "A denúncia foi apagada com sucesso."}
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-continuar rounded px-4"
                                    onClick={closeSuccessModal}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default GerirDenuncia;