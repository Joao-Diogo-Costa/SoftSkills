import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';
import authHeader from "../auth.header";

import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirSugestao() {
    const [sugestoes, setSugestoes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [sugestaoParaApagar, setSugestaoParaApagar] = useState(null);
    const [modalFadeOut, setModalFadeOut] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/sugestao-topico/list")
            .then(res => {
                if (res.data.success) setSugestoes(res.data.data);
                else setSugestoes([]);
            })
            .catch(() => setSugestoes([]))
            .finally(() => setLoading(false));
    }, []);

    // Aceitar sugestão: redireciona para criar-forum com o título da sugestão
    const handleAceitar = sugestao => {
        navigate("/admin/gerir-forum/criar-forum", {
            state: {
                titulo: sugestao.titulo,
                topicoId: sugestao.topicoId,
                areaId: sugestao.TOPICOC?.areaId,
            }
        });
    };

    // Abrir modal para apagar sugestão
    const handleOpenDeleteModal = sugestao => {
        setSugestaoParaApagar(sugestao);
        setShowDeleteModal(true);
    };

    // Apagar sugestão
    const handleDeleteSugestao = async () => {
        if (!sugestaoParaApagar) return;
        try {
            await axios.delete(
                `https://pint-web-htw2.onrender.com/sugestao-topico/delete/${sugestaoParaApagar.id}`,
                { headers: authHeader() }
            );
            setSugestoes(sugestoes.filter(s => s.id !== sugestaoParaApagar.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch {
            alert("Erro ao apagar sugestão.");
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

    // Filtro de pesquisa
    const sugestoesFiltradas = sugestoes.filter(s =>
        (s.Utilizador?.nomeUtilizador || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.titulo || "").toLowerCase().includes(search.toLowerCase())
    );



    return (
        <>
            <Helmet>
                <title>Gerir Sugestão / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">
                <PerfilAdmin />

                <div className="container mt-4">
                    <div className="row d-flex justify-content-between">
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
                                placeholder="Procurar sugestão"
                                aria-label="Search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </form>
                        <div className="col-12 mt-3">
                            <div
                                className={`table-responsive mt-3 ${!loading && sugestoesFiltradas.length === 0 ? "d-flex justify-content-center align-items-center" : ""}`}
                                style={{
                                    maxHeight: 665,
                                    overflowY: "auto",
                                    border: "1px solid #ccc"
                                }}
                            >
                                {loading ? (
                                    <div className="w-100 text-center py-5">A carregar...</div>
                                ) : sugestoesFiltradas.length === 0 ? (
                                    <h4 className="text-muted m-0 w-100 text-center">
                                        Nenhuma sugestão encontrada.
                                    </h4>
                                ) : (
                                    <table className="table table-hover tabela-users mb-0">
                                        <thead className="shadow-sm tabela-header">
                                            <tr>
                                                <th className="fw-semibold text-center fs-5">Sugestor</th>
                                                <th className="fw-semibold text-center fs-5">Data</th>
                                                <th className="fw-semibold text-center fs-5">Título</th>
                                                <th className="fw-semibold text-center fs-5">Tópico</th>
                                                <th className="fw-semibold text-center fs-5">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sugestoesFiltradas.map(sugestao => (
                                                <tr key={sugestao.id}>
                                                    <td className="text-center align-middle">
                                                        {sugestao.UTILIZADOR?.nomeUtilizador || "-"}
                                                    </td>
                                                    <td className="text-center align-middle">
                                                        {sugestao.dataSugestao ? new Date(sugestao.dataSugestao).toLocaleDateString("pt-PT") : "-"}
                                                    </td>
                                                    <td className="text-center align-middle">
                                                        {sugestao.titulo}
                                                    </td>
                                                    <td className="text-center align-middle">
                                                        {sugestao.TOPICOC?.nomeTopico || sugestao.topicoId}
                                                    </td>
                                                    <td className="text-center align-middle">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm me-4"
                                                            style={{
                                                                backgroundColor: "#39639D",
                                                                color: "white",
                                                                width: 75
                                                            }}
                                                            onClick={() => handleAceitar(sugestao)}
                                                        >
                                                            Aceitar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm"
                                                            style={{
                                                                backgroundColor: "red",
                                                                color: "white",
                                                                width: 75
                                                            }}
                                                            onClick={() => handleOpenDeleteModal(sugestao)}
                                                        >
                                                            Apagar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmação de remoção */}
            {showDeleteModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    aria-labelledby="deleteSugestaoModalLabel"
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
                                        Apagar sugestão!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    Ao confirmar, a sugestão será apagada! Não será possível recuperar os dados!
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
                                    onClick={handleDeleteSugestao}
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
                    <div className={`modal-dialog modal-dialog-centered ${modalFadeOut ? "custom-fade-out" : "custom-fade-in"}`}
                        style={{ maxWidth: 550 }}
                    >
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src={iconSucesso}
                                        alt="Ícone de sucesso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Sugestão Apagada!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    A sugestão foi apagada com sucesso.
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

export default GerirSugestao;