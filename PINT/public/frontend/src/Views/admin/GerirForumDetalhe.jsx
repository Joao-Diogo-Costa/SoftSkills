import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

import authHeader from '../auth.header';
import AdminSidebar from './Sidebar';

import cursoBanner from "../../assets/admin/img/mariadb_curso.png";
import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirForumDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [forum, setForum] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [showSuccessEditModal, setShowSuccessEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fadeOutSuccessEditModal, setFadeOutSuccessEditModal] = useState(false);
    const [novaImagem, setNovaImagem] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);
    const [mensagem, setMensagem] = useState("");

    // Estados para todos os campos editáveis
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [topicoId, setTopicoId] = useState(null);
    const [areaId, setAreaId] = useState(null);
    const [categoriaId, setCategoriaId] = useState(null);

    const [forumParaRemover, setForumParaRemover] = useState(null);

    const selectEstilos = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "#fff",
            borderColor: state.isFocused ? "#39639D" : "#ccc",
            boxShadow: state.isFocused ? "0 0 0 2px #39639D33" : "none",
            minHeight: 38,
        }),
        menu: base => ({
            ...base,
            backgroundColor: "#F5F9FF"
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "#deebff"
                : state.isSelected
                    ? "#deebff"
                    : "#F5F9FF",
            color: "#39639D",
            cursor: "pointer",
            padding: "8px 12px"
        }),
        singleValue: base => ({
            ...base,
            color: "#333333",
        }),
    };

    useEffect(() => {
        axios.get(`http://localhost:3000/forum/get/${id}`)
            .then(res => setForum(res.data.data))
            .catch(err => console.error("Erro ao buscar fórum:", err));
        // Buscar categorias
        axios.get("http://localhost:3000/categoria/list")
            .then(res => setCategorias(res.data.data || []))
            .catch(() => setCategorias([]));

        // Buscar áreas
        axios.get("http://localhost:3000/area/list")
            .then(res => setAreas(res.data.data || []))
            .catch(() => setAreas([]));

        // Buscar tópicos
        axios.get("http://localhost:3000/topico-curso/list")
            .then(res => setTopicos(res.data.data || []))
            .catch(() => setTopicos([]));
    }, [id]);

    // Preencher estados com dados do fórum ao carregar
    useEffect(() => {
        if (forum && topicos.length && areas.length && categorias.length) {
            const topicoSelecionado = topicos.find(t => t.id === forum.topicoId);
            const areaSelecionada = topicoSelecionado ? areas.find(a => a.id === topicoSelecionado.areaId) : null;
            const categoriaSelecionada = areaSelecionada ? categorias.find(c => c.id === areaSelecionada.categoriaId) : null;

            setNome(forum.nome || "");
            setDescricao(forum.descricao || "");
            setCategoriaId(categoriaSelecionada?.id || null);
            setAreaId(areaSelecionada?.id || null);
            setTopicoId(forum.topicoId || null);
        }
    }, [forum, topicos, areas, categorias]);

const handleUpdateForum = async (e) => {
    e.preventDefault();
    try {
        // Atualiza os dados do fórum
        await axios.put(`http://localhost:3000/forum/update/${forum.id}`, {
            nome,
            descricao,
            topicoId
        }, {
            headers: authHeader()
        });

        // Se houver nova imagem, faz upload
        if (novaImagem) {
            const formData = new FormData();
            formData.append("imagem-forum", novaImagem);
            await axios.post(
                `http://localhost:3000/forum/upload-imagem-forum/${forum.id}`,
                formData,
                { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
            );
        }

        setShowSuccessEditModal(true);
        setNovaImagem(null);
        setPreviewImagem(null);

        // Atualiza a imagem no estado do fórum
        const res = await axios.get(`http://localhost:3000/forum/get/${forum.id}`);
        setForum(res.data.data);

    } catch (err) {
        setMensagem("Erro ao atualizar fórum.");
    }
};

    const closeSuccessEditModal = () => {
        setFadeOutSuccessEditModal(true);
        setTimeout(() => {
            setShowSuccessEditModal(false);
            setFadeOutSuccessEditModal(false);
        }, 250);
    };

    const handleDeleteClick = (id) => {
        setForumParaRemover(id);
        setShowDeleteModal(true);
    };

    const handleDeleteForum = async () => {
        if (!forumParaRemover) return;
        try {
            await axios.delete(`http://localhost:3000/forum/delete/${id}`, {
                headers: authHeader()
            });
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            setMensagem("Erro ao apagar fórum.");
            setShowDeleteModal(false);
        }
    };

    //Imagem
    const fileInputRef = React.useRef();

    const handleImagemClick = () => {
        fileInputRef.current.click();
    };

    const handleImagemChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovaImagem(file);
            setPreviewImagem(URL.createObjectURL(file));
        }
    };

    if (!forum || topicos.length === 0 || areas.length === 0 || categorias.length === 0) {
        return <p>A carregar fórum...</p>;
    }

    const topicoSelecionado = topicos.find(t => t.id === forum.topicoId);
    const areaSelecionada = areas.find(a => a.id === topicoSelecionado?.areaId);
    const categoriaSelecionada = categorias.find(c => c.id === areaSelecionada?.categoriaId);

    return (
        <>
            <Helmet>
                <title>Detalhes - {forum.nome} / SoftSkills</title>
            </Helmet>
            <AdminSidebar />

            <div className="content flex-grow-1 p-4 ">
                {mensagem && <div className="alert alert-info">{mensagem}</div>}
                <div className="container vh-100 d-flex justify-content-center align-items-center">
                    <div
                        className="container container-criar-curso rounded-bottom"
                        style={{ border: "1px solid #ccc", }}
                    >
                        <div className="d-flex justify-content-center">
                            <div className="row d-flex justify-content-between ">
                                <div className="col-md-9">
                                    <div className="container rounded">
                                        <div className="d-flex align-items-center mt-5">
                                            <Link to={`/admin/gerir-forum/`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <i
                                                    className="fa-solid fa-arrow-left fa-2x me-3 mb-3"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Link>
                                            <h2 className="fs-1 fw-bold mb-3">Detalhes do Fórum</h2>
                                        </div>
                                        <form className="mt-3">
                                            <div className="mb-3">
                                                <label htmlFor="titulo" className="form-label">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control rounded"
                                                    id="titulo"
                                                    value={nome || ""}
                                                    onChange={e => setNome(e.target.value)}
                                                    style={{ maxWidth: 500 }}
                                                />
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label htmlFor="categoria" className="form-label">
                                                        Categoria
                                                    </label>
                                                    <Select
                                                        id="categoria"
                                                        options={categorias.map(cat => ({ value: cat.id, label: cat.nome }))}
                                                        value={categorias.find(cat => cat.id === categoriaId) ? { value: categoriaId, label: categorias.find(cat => cat.id === categoriaId).nome } : null}
                                                        onChange={option => {
                                                            setCategoriaId(option ? option.value : null);
                                                            setAreaId(null);
                                                            setTopicoId(null);
                                                        }}
                                                        menuPlacement="bottom"
                                                        styles={selectEstilos}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="area" className="form-label">
                                                        Área
                                                    </label>
                                                    <Select
                                                        id="area"
                                                        options={areas.filter(area => area.categoriaId === categoriaId).map(area => ({ value: area.id, label: area.nome }))}
                                                        value={areas.find(area => area.id === areaId) ? { value: areaId, label: areas.find(area => area.id === areaId).nome } : null}
                                                        onChange={option => {
                                                            setAreaId(option ? option.value : null);
                                                            setTopicoId(null);
                                                        }}
                                                        menuPlacement="bottom"
                                                        styles={selectEstilos}
                                                        isDisabled={!categoriaId}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="topico" className="form-label">
                                                        Tópico
                                                    </label>
                                                    <Select
                                                        id="topico"
                                                        options={topicos.filter(topico => topico.areaId === areaId).map(topico => ({ value: topico.id, label: topico.nomeTopico }))}
                                                        value={topicos.find(topico => topico.id === topicoId) ? { value: topicoId, label: topicos.find(topico => topico.id === topicoId).nomeTopico } : null}
                                                        onChange={option => setTopicoId(option ? option.value : null)}
                                                        menuPlacement="bottom"
                                                        styles={selectEstilos}
                                                        isDisabled={!areaId}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Descrição</label>
                                                <textarea
                                                    className="form-control mt-auto"
                                                    rows={4}
                                                    placeholder="Descrição do fórum"
                                                    value={descricao}
                                                    onChange={e => setDescricao(e.target.value)}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-3 mt-4">
                                    <img
                                        src={previewImagem || forum.imagemForum || cursoBanner}
                                        alt=""
                                        className="mx-auto d-block w-100 mb-3"
                                        style={{ objectFit: "cover", maxHeight: 200, cursor: "pointer" }}
                                        onClick={handleImagemClick}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        onChange={handleImagemChange}
                                    />
                                </div>


                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn mt-3 me-4 mb-2"
                                        style={{ backgroundColor: "red", color: "white", width: 150 }}
                                        onClick={() => handleDeleteClick(forum.id)}
                                    >
                                        Apagar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn mt-3 mb-2"
                                        style={{ backgroundColor: "#39639D", color: "white", width: 150 }}
                                        onClick={handleUpdateForum}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccessEditModal && (
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
                    <div className={`modal-dialog modal-dialog-centered ${fadeOutSuccessEditModal ? "custom-fade-out" : "custom-fade-in"}`} style={{ maxWidth: 550 }}>
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src={iconSucesso}
                                        alt="Ícone de sucesso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Fórum Atualizado!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    O fórum foi atualizado com sucesso.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-continuar rounded px-4"
                                    onClick={closeSuccessEditModal}
                                >
                                    Continuar
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
                    aria-labelledby="deleteForumModalLabel"
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
                                        Apagar fórum!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    Ao confirmar, o fórum será apagado! Não será possível recuperar os dados!
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
                                    onClick={handleDeleteForum}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                        Fórum Apagado!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    O fórum foi apagado com sucesso.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-continuar rounded px-4"
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate("/admin/gerir-forum/");
                                    }}
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

export default GerirForumDetalhe;