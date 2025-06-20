import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";
import AdminSidebar from './Sidebar';
import authHeader from "../auth.header";

import iconSucesso from "../../assets/admin/svg/success_vector.svg"; 

function CriarForum() {
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [imagemForum, setImagemForum] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalFadeOut, setModalFadeOut] = useState(false);
    const location = useLocation();

    const closeSuccessModal = () => {
        setModalFadeOut(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            setModalFadeOut(false);
            navigate("/admin/gerir-forum");
        }, 250);
    };

    const [form, setForm] = useState({
        nome: location.state?.titulo || "",
        descricao: "",
        categoriaId: location.state?.categoriaId || "",
        areaId: location.state?.areaId || "",
        topicoId: location.state?.topicoId || "",
    });

    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Carregar categorias ao montar
    useEffect(() => {
        axios.get("http://localhost:3000/categoria/list")
            .then(res => setCategorias(res.data.data || []));
    }, []);

    // Carregar áreas ao escolher categoria OU se vier areaId do estado
    useEffect(() => {
        axios.get("http://localhost:3000/area/list").then(res => {
            const lista = res.data.data || [];
            setAreas(lista);

            if (location.state?.areaId && !form.categoriaId) {
                const area = lista.find(a => a.id == location.state.areaId);
                if (area) {
                    setForm(f => ({
                        ...f,
                        areaId: area.id,
                        categoriaId: area.categoriaId,
                        topicoId: location.state?.topicoId || ""
                    }));
                }
            }
        });
    }, [form.categoriaId, location.state?.areaId, location.state?.topicoId]);


    // Carregar tópicos ao escolher área
    useEffect(() => {
        axios.get("http://localhost:3000/topico-curso/list").then(res => {
            let lista = res.data.data || [];
            // Se vier topicoId do estado, mostra todos os tópicos para garantir que o select tem essa opção
            if (form.areaId) {
                lista = lista.filter(t => t.areaId == form.areaId);
            }
            setTopicos(lista);

            // Se vier topicoId do estado e não existir na lista filtrada, adiciona-o
            if (
                location.state?.topicoId &&
                !lista.some(t => t.id === location.state.topicoId)
            ) {
                axios.get(`http://localhost:3000/topico-curso/${location.state.topicoId}`)
                    .then(resp => {
                        if (resp.data && resp.data.id) {
                            setTopicos(prev => [...prev, resp.data]);
                        }
                    });
            }
        });
    }, [form.areaId, location.state?.topicoId]);

    // Filtra áreas pela categoria selecionada, ou mostra todas se vier preenchido do estado
    const areasFiltradas = form.categoriaId
        ? areas.filter(a => a.categoriaId == form.categoriaId)
        : (location.state?.categoriaId ? areas : []);

    // Filtra tópicos pela área selecionada, ou mostra todos se vier preenchido do estado
    const topicosFiltrados = form.areaId
        ? topicos.filter(t => t.areaId == form.areaId)
        : (location.state?.areaId ? topicos : []);

    // Handler para inputs
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => {
            if (name === "categoriaId") {
                return { ...f, categoriaId: value, areaId: "", topicoId: "" };
            }
            if (name === "areaId") {
                return { ...f, areaId: value, topicoId: "" };
            }
            return { ...f, [name]: value };
        });
    };

    const handleImageChange = (e) => {
        setImagemForum(e.target.files[0]);
    };

    // Submeter formulário
    const handleSubmit = async e => {
        e.preventDefault();
        setMensagem("");
        setLoading(true);
        try {
            // 1. Cria o fórum (sem imagem)
            const body = {
                nome: form.nome,
                descricao: form.descricao,
                topicoId: form.topicoId,
                categoriaId: form.categoriaId,
                areaId: form.areaId
            };
            const res = await axios.post("http://localhost:3000/forum/create", body, {
                headers: authHeader()
            });

            if (res.data.success) {
                const forumId = res.data.data.id;
                // 2. Se houver imagem, faz upload da imagem para o endpoint específico
                if (imagemForum) {
                    const formData = new FormData();
                    formData.append("imagem-forum", imagemForum);
                    await axios.post(`http://localhost:3000/forum/upload-imagem-forum/${forumId}`, formData, {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }
                setShowSuccessModal(true);
                setForm({
                    nome: "",
                    descricao: "",
                    categoriaId: "",
                    areaId: "",
                    topicoId: ""
                });
                setImagemForum(null);
            } else {
                setMensagem(res.data.message || "Erro ao criar fórum.");
            }
        } catch (err) {
            setMensagem("Erro ao criar fórum.");
        }
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Criar Fórum / SoftSkills</title>
            </Helmet>
            <AdminSidebar />
            <div className="content flex-grow-1 p-4">
                <div className="container vh-100 d-flex justify-content-center align-items-center">
                    <div className="container container-criar-curso rounded-bottom mb-5" style={{ border: "1px solid #ccc" }}>
                        <div className="row d-flex justify-content-between">
                            <div className="col-12">
                                <div className="container rounded">
                                    <div className="d-flex align-items-center mt-3">
                                        <Link to={`/admin/gerir-forum/`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <i
                                                className="fa-solid fa-arrow-left fa-2x me-3 mb-3"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Link>
                                        <h2 className="fs-1 fw-bold mb-3">Criar Fórum</h2>
                                    </div>
                                    {mensagem && <div className="alert alert-info">{mensagem}</div>}
                                    <form className="mt-3" onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div className="mb-3">
                                            <label htmlFor="nome" className="form-label">Título</label>
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                id="nome"
                                                name="nome"
                                                value={form.nome}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="descricao" className="form-label">Descrição</label>
                                            <textarea
                                                className="form-control"
                                                id="descricao"
                                                name="descricao"
                                                rows={3}
                                                value={form.descricao}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label htmlFor="categoria" className="form-label">Categoria</label>
                                                <select
                                                    className="form-select"
                                                    id="categoria"
                                                    name="categoriaId"
                                                    value={form.categoriaId}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecionar</option>
                                                    {categorias.map(c => (
                                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="area" className="form-label">Área</label>
                                                <select
                                                    className="form-select"
                                                    id="area"
                                                    name="areaId"
                                                    value={form.areaId}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={!form.categoriaId && !location.state?.categoriaId}
                                                >
                                                    <option value="">Selecionar</option>
                                                    {areasFiltradas.map(a => (
                                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="topico" className="form-label">Tópico</label>
                                                <select
                                                    className="form-select"
                                                    id="topico"
                                                    name="topicoId"
                                                    value={form.topicoId}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={!form.areaId && !location.state?.areaId}
                                                >
                                                    <option value="">Selecionar</option>
                                                    {topicosFiltrados.map(t => (
                                                        <option key={t.id} value={t.id}>{t.nomeTopico}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="imagemForum" className="form-label">Imagem do Fórum</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="imagemForum"
                                                name="imagemForum"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="submit"
                                                className="btn mt-3 mb-4"
                                                style={{
                                                    backgroundColor: "#39639D",
                                                    color: "white",
                                                    width: 150
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? "A criar..." : "Criar"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                    <h1 className="text-center fs-2 fw-bold mt-3">O fórum foi criado!</h1>
                                </div>
                                <p className="text-center fs-5">
                                    O fórum foi criado com sucesso.
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

export default CriarForum;