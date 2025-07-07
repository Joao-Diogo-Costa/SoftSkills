import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import { Modal } from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../../assets/admin/css/style.css"
import authHeader from '../auth.header';


import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';

import profilePic from "../../assets/admin/img/default_profile_pic.jpg";
import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirUtilizador() {

    const [utilizadores, setUtilizadores] = useState([]);
    const [search, setSearch] = useState("");
    const [showFiltro, setShowFiltro] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState(""); // "formador", "formando" ou ""
    const [ordem, setOrdem] = useState("asc"); // "asc" ou "desc"

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [imagemPreview, setImagemPreview] = useState(profilePic);
    const [imagemFile, setImagemFile] = useState(null);

    const [utilizadorParaRemover, setUtilizadorParaRemover] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [utilizadorParaEditar, setUtilizadorParaEditar] = useState(null);

    const [imagemEditFile, setImagemEditFile] = useState(null);
    const [imagemPreviewEdit, setImagemPreviewEdit] = useState("");

    const [editModalFadeOut, setEditModalFadeOut] = useState(false);

    // Função para abrir o modal de edição
    const handleOpenEditModal = (utilizador) => {
        setUtilizadorParaEditar(utilizador);
        setShowEditModal(true);
    };

    // Função para fechar o modal de edição
    const handleCloseEditModal = () => {
        setEditModalFadeOut(true);
        setTimeout(() => {
            setUtilizadorParaEditar(null);
            setShowEditModal(false);
            setEditModalFadeOut(false);
            setImagemPreviewEdit(""); 
            setImagemEditFile(null);
        }, 250); 
    };

    // Função para remover utilizador
    const handleDeleteUtilizador = async () => {
        if (!utilizadorParaRemover) return;
        try {
            await axios.delete(
                `https://pint-web-htw2.onrender.com/utilizador/delete/${utilizadorParaRemover}`,
                { headers: authHeader() }
            );
            setUtilizadores(utilizadores.filter(u => u.id !== utilizadorParaRemover));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Erro ao apagar utilizador.");
            setShowDeleteModal(false);
        }
    };

    const [novoUtilizador, setNovoUtilizador] = useState({
        nomeUtilizador: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        dataNasc: "",
        nTel: "",
    });
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");



    // Função para atualizar campos do formulário
    const handleChange = e => {
        setNovoUtilizador({ ...novoUtilizador, [e.target.name]: e.target.value });
        setErro("");
        setSucesso("");
    };

    const [editData, setEditData] = useState({
        nomeUtilizador: "",
        role: "",
        password: "",
        confirmPassword: ""
    });

    // Preencher editData ao abrir modal
    useEffect(() => {
        if (showEditModal && utilizadorParaEditar) {
            setEditData({
                nomeUtilizador: utilizadorParaEditar.nomeUtilizador,
                role: utilizadorParaEditar.role,
                password: "",
                confirmPassword: ""
            });
        }
    }, [showEditModal, utilizadorParaEditar]);

    const handleEditChange = e => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async () => {
        if (!editData.nomeUtilizador || !editData.role) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }
        if (editData.password && editData.password !== editData.confirmPassword) {
            alert("As palavras-passe não coincidem.");
            return;
        }
        try {
            await axios.put(
                `https://pint-web-htw2.onrender.com/utilizador/update/${utilizadorParaEditar.id}`,
                {
                    nomeUtilizador: editData.nomeUtilizador,
                    role: editData.role,
                    password: editData.password
                },
                { headers: authHeader() }
            );

            // Só faz upload da imagem se o utilizador selecionou uma nova
            if (imagemEditFile) {
                const formData = new FormData();
                formData.append("imagem-perfil", imagemEditFile);
                formData.append("id", utilizadorParaEditar.id);
                await axios.post(
                    "https://pint-web-htw2.onrender.com/utilizador/upload-imagem-perfil",
                    formData,
                    { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
                );
            }

            // Atualizar lista de utilizadores
            const res = await axios.get("https://pint-web-htw2.onrender.com/utilizador/list");
            if (res.data.success) setUtilizadores(res.data.data);
            handleCloseEditModal();
            setImagemEditFile(null);
            setImagemPreviewEdit("");
        } catch (err) {
            alert("Erro ao atualizar utilizador.");
        }
    };


    // Função para submeter o formulário de adicionar utilizador
    const handleAdicionar = async e => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        // Validação simples
        if (
            !novoUtilizador.nomeUtilizador ||
            !novoUtilizador.email ||
            !novoUtilizador.password ||
            !novoUtilizador.confirmPassword ||
            !novoUtilizador.role
        ) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }
        if (novoUtilizador.password !== novoUtilizador.confirmPassword) {
            setErro("As palavras-passe não coincidem.");
            return;
        }
        // Validação do número de telefone (9 dígitos)
        if (!/^\d{9}$/.test(novoUtilizador.nTel)) {
            setErro("O nº de telefone deve ter exatamente 9 dígitos.");
            return;
        }
        if (!novoUtilizador.dataNasc) {
            setErro("Data de nascimento é obrigatória.");
            return;
        }

        try {
            const res = await axios.post("https://pint-web-htw2.onrender.com/utilizador/create", {
                nomeUtilizador: novoUtilizador.nomeUtilizador,
                email: novoUtilizador.email,
                password: novoUtilizador.password,
                role: novoUtilizador.role,
                dataNasc: novoUtilizador.dataNasc,
                nTel: novoUtilizador.nTel,
            });

            if (res.data && res.data.success) {
                setSucesso("Utilizador adicionado com sucesso!");
                setErro("");
                setNovoUtilizador({
                    nomeUtilizador: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                    dataNasc: "",
                    nTel: "",
                });

                // Atualizar lista de utilizadores
                axios.get("https://pint-web-htw2.onrender.com/utilizador/list")
                    .then(res => {
                        if (res.data.success) setUtilizadores(res.data.data);
                    });

                // Fecha o modal e limpa mensagens após um pequeno delay para mostrar o sucesso
                setTimeout(() => {
                    document.getElementById('addUserModal')?.classList.remove('show');
                    setSucesso("");
                    setErro("");
                }, 1000);
            } else {
                setErro(res.data?.message || "Erro ao adicionar utilizador.");
                setSucesso("");
            }
        } catch (err) {
            console.error("Erro ao adicionar utilizador:", err, err.response?.data);
            setErro(err.response?.data?.message || "Erro ao adicionar utilizador.");
            setSucesso("");
        }
    };

    // Quando o utilizador seleciona uma imagem
    const handleImagemChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImagemFile(file);
            setImagemPreview(URL.createObjectURL(file));

        }
    };


    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/utilizador/list")
            .then(res => {
                if (res.data.success) setUtilizadores(res.data.data);
            })
            .catch(() => setUtilizadores([]));
    }, []);

    // Pesquisa dinâmica
    const utilizadoresFiltrados = utilizadores
        .filter(u =>
            u.nomeUtilizador.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .filter(u => !filtroTipo || u.role === filtroTipo)
        .sort((a, b) => {
            if (ordem === "asc") return a.nomeUtilizador.localeCompare(b.nomeUtilizador);
            else return b.nomeUtilizador.localeCompare(a.nomeUtilizador);
        });

    return (

        <>
            <Helmet>
                <title>Gerir Utilizador / SoftSkills</title>
            </Helmet>

            <AdminSidebar />
            <div className="content flex-grow-1 p-4">

                <PerfilAdmin />

                <div className="container mt-4">
                    <div className="row d-flex justify-content-between">
                        <div className="d-flex align-items-center position-relative">
                            <button
                                className="btn btn-sm me-4 btn-filtro"
                                onClick={() => setShowFiltro(v => !v)}
                                type="button"
                            >
                                <i className="fa-solid fa-filter me-2" />
                                Filtros
                            </button>
                            {showFiltro && (
                                <div
                                    className="shadow rounded p-3"
                                    style={{
                                        position: "absolute",
                                        top: "110%",
                                        left: 0,
                                        background: "#fff",
                                        zIndex: 10,
                                        minWidth: 220
                                    }}
                                >
                                    <div className="mb-2">
                                        <label className="fw-semibold">Tipo de Utilizador</label>
                                        <select
                                            className="form-select mt-1"
                                            value={filtroTipo}
                                            onChange={e => setFiltroTipo(e.target.value)}
                                        >
                                            <option value="">Todos</option>
                                            <option value="formador">Formador</option>
                                            <option value="formando">Formando</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="fw-semibold">Ordem</label>
                                        <select
                                            className="form-select mt-1"
                                            value={ordem}
                                            onChange={e => setOrdem(e.target.value)}
                                        >
                                            <option value="asc">A-Z</option>
                                            <option value="desc">Z-A</option>
                                        </select>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-secondary mt-2 w-100"
                                        onClick={() => {
                                            setFiltroTipo("");
                                            setOrdem("asc");
                                            setShowFiltro(false);
                                        }}
                                        type="button"
                                    >
                                        Limpar Filtros
                                    </button>
                                </div>
                            )}

                            <button
                                className="btn btn-sm me-3 btn-adicionar"
                                data-bs-toggle="modal"
                                data-bs-target="#addUserModal"
                            >
                                <i className="fa-solid fa-plus me-2" />
                                Adicionar
                            </button>

                            {/* Modal para adicionar utilizador */}
                            <div
                                className="modal fade"
                                id="addUserModal"
                                tabIndex={-1}
                                aria-labelledby="addUserModalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div
                                            className="modal-header text-white py-5 position-relative"
                                            style={{
                                                background: "linear-gradient(90deg, #294873, #1C4072)"
                                            }}
                                        >
                                            <h5
                                                className="modal-title fw-bold"
                                                id="addUserModalLabel"
                                                style={{ marginRight: 75, marginLeft: "auto" }}
                                            >
                                                Adicionar Utilizador
                                            </h5>
                                            <div
                                                className="position-absolute top-100 start-0 translate-middle-y ms-5"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <img
                                                    id="profileImage"
                                                    src={imagemPreview}
                                                    alt="Novo Perfil"
                                                    className="rounded"
                                                    style={{ width: 125, height: 125, objectFit: "cover" }}
                                                    onClick={() => document.getElementById("imageUpload").click()}
                                                />
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleImagemChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-body mt-5" style={{ color: "#f5f9ff" }}>
                                            <form onSubmit={handleAdicionar}>
                                                <h5
                                                    className="fw-bold fs-3 mt-3 ms-4 text-start"
                                                    style={{ color: "#294873" }}
                                                >
                                                    Dados do Novo Utilizador
                                                </h5>
                                                {erro && <div className="alert alert-danger">{erro}</div>}
                                                {sucesso && <div className="alert alert-success">{sucesso}</div>}
                                                <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Nome
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control text-muted"
                                                        placeholder="Nome completo"
                                                        name="nomeUtilizador"
                                                        value={novoUtilizador.nomeUtilizador}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control text-muted"
                                                        placeholder="Endereço de email"
                                                        name="email"
                                                        value={novoUtilizador.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Data de Nascimento
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control text-muted"
                                                        name="dataNasc"
                                                        value={novoUtilizador.dataNasc}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Nº de Telefone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control text-muted"
                                                        placeholder="912345678"
                                                        name="nTel"
                                                        value={novoUtilizador.nTel}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Tipo de Conta
                                                    </label>
                                                    <select
                                                        className="form-select w-50 text-muted"
                                                        name="role"
                                                        value={novoUtilizador.role}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Selecionar tipo</option>
                                                        <option value="formador">Formador</option>
                                                        <option value="formando">Formando</option>
                                                        <option value="gestor">Gestor</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 ms-4 position-relative text-start">
                                                    <label className="form-label text-start fw-semibold fs-6" style={{ color: "#294873" }}>
                                                        Palavra-passe
                                                    </label>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="newPassword"
                                                        className="form-control text-muted"
                                                        placeholder="Nova palavra-passe"
                                                        name="password"
                                                        value={novoUtilizador.password}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn position-absolute bottom-0 end-0 btn-eye"
                                                        style={{ boxShadow: "none", outline: "none" }}
                                                        tabIndex={-1}
                                                        onClick={() => setShowPassword(v => !v)}
                                                    >
                                                        <i className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
                                                    </button>
                                                </div>
                                                <div className="mb-3 ms-4 position-relative text-start">
                                                    <label className="form-label fw-semibold fs-6 text-start" style={{ color: "#294873" }}>
                                                        Confirmar Palavra-passe
                                                    </label>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmNewPassword"
                                                        className="form-control text-muted focus-ring"
                                                        placeholder="Confirmar nova palavra-passe"
                                                        name="confirmPassword"
                                                        value={novoUtilizador.confirmPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn position-absolute top-50 bottom-0 end-0 btn-eye"
                                                        style={{ boxShadow: "none", outline: "none" }}
                                                        tabIndex={-1}
                                                        onClick={() => setShowConfirmPassword(v => !v)}
                                                    >
                                                        <i className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`} />
                                                    </button>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancelar me-4"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button type="submit" className="btn btn-adicionar">
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    placeholder="Procurar utilizador"
                                    aria-label="Search"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </form>
                        </div>
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
                                            <th className="fw-semibold text-center fs-5">Tipo</th>
                                            <th className="fw-semibold text-center fs-5">
                                                Data de registro
                                            </th>
                                            <th className="fw-semibold text-center fs-5">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {utilizadoresFiltrados.map(utilizador => (
                                            <tr key={utilizador.id}>
                                                <td className="d-flex p-3">
                                                    <img
                                                        src={utilizador.imagemPerfil || "assets/img/default_profile_pic.jpg"}
                                                        className="ms-3"
                                                        alt=""
                                                        style={{ width: 50, height: 50 }}
                                                    />
                                                    <div>
                                                        <h5 className="ms-3">
                                                            <Link
                                                                to={`/admin/perfil-utilizador/${utilizador.id}`}
                                                                className="text-decoration-none blue-text"
                                                                title="Ver percurso formativo"
                                                            >
                                                                {utilizador.nomeUtilizador}
                                                            </Link>
                                                        </h5>
                                                        <small className="text-muted d-block ms-3">
                                                            {utilizador.email}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="text-center align-middle">{utilizador.role.charAt(0).toUpperCase() + utilizador.role.slice(1)}</td>
                                                <td className="text-center align-middle">
                                                    {utilizador.dataRegisto
                                                        ? new Date(utilizador.dataRegisto).toLocaleDateString("pt-PT")
                                                        : ""}
                                                </td>
                                                <td className="text-center align-middle">
                                                    <i
                                                        className="fa-regular fa-pen-to-square me-3"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleOpenEditModal(utilizador)}

                                                    />
                                                    {/* Só mostra o botão de apagar se não for admin */}
                                                    {utilizador.role !== "gestor" && (
                                                        <i
                                                            className="fa-regular fa-trash-can me-3"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setUtilizadorParaRemover(utilizador.id);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        />
                                                    )}
                                                    <i className="fa-solid fa-bars-progress" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Modal de editar */}
                                {showEditModal && utilizadorParaEditar && (
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

                                            if (e.target === e.currentTarget) handleCloseEditModal();
                                        }}
                                    >
                                        <div className={`modal-dialog modal-dialog-centered ${editModalFadeOut ? "custom-fade-out" : "custom-fade-in"}`}>
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #39639D, #1C4072)"
                                                    }}
                                                >
                                                    <h5
                                                        className="modal-title fw-bold"
                                                        id="editModalLabel"
                                                        style={{ marginRight: 75, marginLeft: "auto" }}
                                                    >
                                                        Editar dados
                                                    </h5>
                                                    <div className="position-absolute top-100 start-0 translate-middle-y ms-5">
                                                        <img
                                                            src={imagemPreviewEdit || utilizadorParaEditar.imagemPerfil || profilePic}
                                                            alt="Profile"
                                                            className="rounded"
                                                            style={{ width: 125, height: 125 }}
                                                            onClick={() => document.getElementById("imageEditUpload").click()}
                                                        />
                                                        <input
                                                            type="file"
                                                            id="imageEditUpload"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            onChange={e => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setImagemEditFile(file);
                                                                    setImagemPreviewEdit(URL.createObjectURL(file));
                                                                }
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                                <div
                                                    className="modal-body mt-5"
                                                    style={{ color: "#f5f9ff" }}
                                                >
                                                    <form>
                                                        <h5
                                                            className="fw-bold fs-3 mt-3 ms-4 text-start"
                                                            style={{ color: "#39639D" }}
                                                        >
                                                            Dados Atuais
                                                        </h5>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Nome
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control text-muted"
                                                                name="nomeUtilizador"
                                                                value={editData.nomeUtilizador}
                                                                onChange={handleEditChange}
                                                            />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Tipo da conta
                                                            </label>
                                                            <select
                                                                className="form-select w-50 text-muted"
                                                                name="role"
                                                                value={editData.role}
                                                                onChange={handleEditChange}
                                                            >
                                                                <option value="formador">Formador</option>
                                                                <option value="formando">Formando</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-3 ms-4 position-relative text-start">
                                                            <label
                                                                className="form-label text-start fw-semibold fs-6"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Palavra-passe
                                                            </label>
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                id="password-edit"
                                                                className="form-control text-muted"
                                                                name="password"
                                                                value={editData.password}
                                                                onChange={handleEditChange}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn position-absolute bottom-0 end-0 btn-eye"
                                                                style={{ boxShadow: "none", outline: "none" }}
                                                                tabIndex={-1}
                                                                onClick={() => setShowPassword(v => !v)}
                                                            >
                                                                <i className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
                                                            </button>
                                                        </div>
                                                        <div className="mb-3 ms-4 position-relative text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Confirmar palavra-passe
                                                            </label>
                                                            <input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                id="confirmPassword-edit"
                                                                className="form-control text-muted focus-ring"
                                                                name="confirmPassword"
                                                                value={editData.confirmPassword}
                                                                onChange={handleEditChange}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn position-absolute top-50 bottom-0 end-0 btn-eye"
                                                                style={{ boxShadow: "none", outline: "none" }}
                                                                tabIndex={-1}
                                                                onClick={() => setShowConfirmPassword(v => !v)}
                                                            >
                                                                <i className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`} />
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-cancelar me-4"
                                                        onClick={handleCloseEditModal}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button type="button" className="btn btn-editar" onClick={handleEditSubmit}>
                                                        Editar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showDeleteModal && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-labelledby="deleteUtilizadorModalLabel"
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
                                                            Apagar utilizador!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, o utilizador será apagado! Não será possível recuperar os dados!
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
                                                        onClick={handleDeleteUtilizador}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Modal Sucesso */}
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
                                                            Utilizador Apagado!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        O utilizador foi apagado com sucesso.
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </>


    );

}

export default GerirUtilizador;