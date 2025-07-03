import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";
import AdminSidebar from './Sidebar';
import authHeader from "../auth.header";

function CriarCurso() {
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [formadores, setFormadores] = useState([]);
    const [form, setForm] = useState({
        nome: "",
        categoriaId: "",
        areaId: "",
        topicoId: "",
        formadorId: "",
        tipoCurso: "Online",
        vaga: "",
        descricaoCurso: "",
        duracao: "01:00:00",
        nivel: "Básico",
        pontuacao: 100,
        dataInicio: "",
        dataFim: "",
        imagemBanner: "",
    });
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);

    // Carregar categorias e formadores
    useEffect(() => {
        axios.get("http://localhost:3000/categoria/list").then(res => setCategorias(res.data.data || []));
        axios.get("http://localhost:3000/utilizador/list").then(res => {
            // Apenas formadores
            setFormadores((res.data.data || []).filter(u => u.role === "formador"));
        });
    }, []);

    // Carregar áreas ao escolher categoria
    useEffect(() => {
        if (form.categoriaId) {
            axios.get("http://localhost:3000/area/list").then(res => {
                setAreas((res.data.data || []).filter(a => a.CATEGORIAC?.id == form.categoriaId));
            });
        } else {
            setAreas([]);
        }
        setForm(f => ({ ...f, areaId: "", topicoId: "" }));
        setTopicos([]);
    }, [form.categoriaId]);

    // Carregar tópicos ao escolher área
    useEffect(() => {
        if (form.areaId) {
            axios.get("http://localhost:3000/topico-curso/list").then(res => {
                setTopicos((res.data.data || []).filter(t => t.areaId == form.areaId));
            });
        } else {
            setTopicos([]);
        }
        setForm(f => ({ ...f, topicoId: "" }));
    }, [form.areaId]);

    // Handler para inputs
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    // Handler para datas
    const handleDateChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    // Handler para imagem (apenas URL para simplificar)
    const handleImageChange = e => {
        setForm(f => ({ ...f, imagemBanner: e.target.value }));
    };

    // Submeter formulário
    const handleSubmit = async e => {
        e.preventDefault();
        setMensagem("");
        setLoading(true);
        try {
            const body = {
                nome: form.nome,
                dataUpload: new Date(),
                tipoCurso: form.tipoCurso,
                vaga: form.tipoCurso === "Presencial" ? Number(form.vaga) : null,
                descricaoCurso: form.descricaoCurso,
                duracao: form.duracao,
                nivel: form.nivel,
                pontuacao: Number(form.pontuacao),
                dataInicio: form.dataInicio,
                dataFim: form.dataFim,
                imagemBanner: form.imagemBanner,
                topicoId: form.topicoId,
                formadorId: form.formadorId,
            };
            const res = await axios.post("http://localhost:3000/curso/create", body, {
                headers: authHeader(),
            });
            if (res.data.success) {
                setMensagem("Curso criado com sucesso!");
                setForm({
                    nome: "",
                    categoriaId: "",
                    areaId: "",
                    topicoId: "",
                    formadorId: "",
                    tipoCurso: "Online",
                    vaga: "",
                    descricaoCurso: "",
                    duracao: "01:00:00",
                    nivel: "Básico",
                    pontuacao: 100,
                    dataInicio: "",
                    dataFim: "",
                    imagemBanner: "",
                });
            } else {
                setMensagem(res.data.message || "Erro ao criar curso.");
            }
        } catch (err) {
            setMensagem("Erro ao criar curso.");
        }
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Criar Curso / SoftSkills</title>
            </Helmet>
            <AdminSidebar />
            <div className="content flex-grow-1 p-4">
                <div className="container vh-100 d-flex justify-content-center align-items-center">
                    <div className="container container-criar-curso rounded-bottom" style={{ border: "1px solid #ccc" }}>
                        <div className="row d-flex justify-content-between">
                            <div className="col-12">
                                <div className="container rounded">
                                    <div className="d-flex align-items-center mt-3">
                                        <Link to={`/admin/gerir-curso/`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <i
                                                className="fa-solid fa-arrow-left fa-2x me-3 mb-3"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Link>
                                        <h2 className="fs-1 fw-bold mb-3">Criar Curso</h2>
                                    </div>
                                    {mensagem && <div className="alert alert-info">{mensagem}</div>}
                                    <form className="mt-3" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="nome" className="form-label">Título</label>
                                            <input type="text" className="form-control rounded" id="nome" name="nome" value={form.nome} onChange={handleChange} required />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label htmlFor="categoria" className="form-label">Categoria</label>
                                                <select className="form-select" id="categoria" name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                                                    <option value="">Selecionar</option>
                                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="area" className="form-label">Área</label>
                                                <select className="form-select" id="area" name="areaId" value={form.areaId} onChange={handleChange} required>
                                                    <option value="">Selecionar</option>
                                                    {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="topico" className="form-label">Tópico</label>
                                                <select className="form-select" id="topico" name="topicoId" value={form.topicoId} onChange={handleChange} required>
                                                    <option value="">Selecionar</option>
                                                    {topicos.map(t => <option key={t.id} value={t.id}>{t.nomeTopico}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="formador" className="form-label">Formador</label>
                                                <select className="form-select" id="formador" name="formadorId" value={form.formadorId} onChange={handleChange} required>
                                                    <option value="">Selecionar</option>
                                                    {formadores.map(f => <option key={f.id} value={f.id}>{f.nomeUtilizador}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label htmlFor="tipoCurso" className="form-label">Tipo de Curso</label>
                                                <select className="form-select" id="tipoCurso" name="tipoCurso" value={form.tipoCurso} onChange={handleChange}>
                                                    <option value="Online">Online</option>
                                                    <option value="Presencial">Presencial</option>
                                                </select>
                                            </div>
                                            {form.tipoCurso === "Presencial" && (
                                                <div className="col-md-3">
                                                    <label htmlFor="vaga" className="form-label">Número de vagas</label>
                                                    <input type="number" className="form-control rounded" id="vaga" name="vaga" value={form.vaga} onChange={handleChange} min={1} />
                                                </div>
                                            )}
                                            <div className="col-md-3">
                                                <label htmlFor="nivel" className="form-label">Nível</label>
                                                <select className="form-select" id="nivel" name="nivel" value={form.nivel} onChange={handleChange}>
                                                    <option value="Básico">Básico</option>
                                                    <option value="Intermediário">Intermediário</option>
                                                    <option value="Avançado">Avançado</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label htmlFor="pontuacao" className="form-label">Pontuação</label>
                                                <input type="number" className="form-control rounded" id="pontuacao" name="pontuacao" value={form.pontuacao} onChange={handleChange} min={0} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="descricaoCurso" className="form-label">Descrição do curso</label>
                                            <textarea className="form-control" id="descricaoCurso" name="descricaoCurso" rows={3} value={form.descricaoCurso} onChange={handleChange} required />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="dataInicio" className="form-label">Data de Início</label>
                                                <input type="date" className="form-control" id="dataInicio" name="dataInicio" value={form.dataInicio} onChange={handleDateChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="dataFim" className="form-label">Data Final</label>
                                                <input type="date" className="form-control" id="dataFim" name="dataFim" value={form.dataFim} onChange={handleDateChange} required />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="imagemBanner" className="form-label">Imagem banner (URL)</label>
                                            <input type="text" className="form-control" id="imagemBanner" name="imagemBanner" value={form.imagemBanner} onChange={handleImageChange} />
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
        </>
    );
}

export default CriarCurso;