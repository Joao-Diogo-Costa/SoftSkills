import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"

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

        const handleDeleteClick = (id) => {
        setDenunciaParaRemover(id);
        setShowDeleteModal(true);
    };

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

    const closeSuccessModal = () => {
    setModalFadeOut(true);
    setTimeout(() => {
        setShowSuccessModal(false);
        setModalFadeOut(false);
    }, 250); 
};

    // Pesquisa dinâmica por nome do utilizador ou descrição/comentário
    const denunciasFiltradas = denuncias.filter(d =>
        (d.Utilizador?.nome || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.Comentario?.conteudo || "").toLowerCase().includes(search.toLowerCase()) ||
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
                            <button className="btn btn-sm me-4 btn-filtro">
                                <i className="fa-solid fa-filter me-2" />
                                Filtros
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
                                    placeholder="Procurar denúncia"
                                    aria-label="Search"
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </form>
                            <div className="col-12 mt-3">
                                <div
                                    className="table-responsive mt-3"
                                    style={{
                                        maxHeight: 675,
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
                                                    <td colSpan={5} className="text-center" style={{maxHeight: 665}}>Nenhuma denúncia encontrada.</td>
                                                </tr>
                                            ) : (
                                                denunciasFiltradas.map(denuncia => (
                                                    <tr key={denuncia.id}>
                                                        <td className="text-center align-middle">{denuncia.Utilizador?.nomeUtilizador || "-"}</td>
                                                        <td className="text-center align-middle">{denuncia.dataDenuncia ? new Date(denuncia.dataDenuncia).toLocaleDateString("pt-PT") : ""}</td>
                                                        <td className="text-center align-middle">{denuncia.Comentario?.texto || "-"}</td>
                                                        <td className="text-center align-middle">{denuncia.Comentario?.Utilizador?.nomeUtilizador || "-"}</td>
                                                        <td className="text-center align-middle">
                                                            {/* Modal para Remover Denuncia */}
                                                            <i
                                                                className="fa-regular fa-trash-can"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleDeleteClick(denuncia.id)}
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
                                    <h1 className="text-center fs-2 fw-bold mt-3">Apagar comentário!</h1>
                                </div>
                                <p className="text-center fs-5">
                                    Ao confirmar, o comentário será apagada!
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button type="button" className="btn btn-voltar px-4" onClick={() => setShowDeleteModal(false)}>
                                    Voltar
                                </button>
                                <button type="button" className="btn btn-continuar px-4" onClick={handleDeleteDenuncia}>
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
                                    <h1 className="text-center fs-2 fw-bold mt-3">Comentário Apagada!</h1>
                                </div>
                                <p className="text-center fs-5">
                                    O comentário foi apagada com sucesso.
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