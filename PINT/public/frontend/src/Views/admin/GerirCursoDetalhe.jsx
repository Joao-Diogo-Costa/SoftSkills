import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Helmet } from 'react-helmet';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"

import authHeader from '../auth.header';

import AdminSidebar from './Sidebar';

import cursoBanner from "../../assets/admin/img/mariadb_curso.png";
import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

// Datepicker
import { registerLocale } from "react-datepicker";
import pt from "date-fns/locale/pt";
registerLocale("pt", pt);

function GerirCursoDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [formadores, setFormadores] = useState([]);
    const [membros, setMembros] = useState([]);
    const [showSuccessEditModal, setShowSuccessEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fadeOutSuccessEditModal, setFadeOutSuccessEditModal] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [novaImagem, setNovaImagem] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);

    const fileInputRef = React.useRef();

    const handleCarregarImagem = () => {
        fileInputRef.current.click();
    };

    // Função para guardar a imagem escolhida e mostrar preview
    const handleImagemChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovaImagem(file);
            setPreviewImagem(URL.createObjectURL(file));
        }
    };

    // Estados para todos os campos editáveis
    const [nome, setNome] = useState("");
    const [descricaoCurso, setDescricaoCurso] = useState("");
    const [vaga, setVaga] = useState("");
    const [tipoCurso, setTipoCurso] = useState("Online");
    const [duracao, setDuracao] = useState("");
    const [nivel, setNivel] = useState("Básico");
    const [pontuacao, setPontuacao] = useState(100);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [categoriaId, setCategoriaId] = useState(null);
    const [areaId, setAreaId] = useState(null);
    const [topicoId, setTopicoId] = useState(null);
    const [formadorId, setFormadorId] = useState(null);


    const [cursoParaRemover, setCursoParaRemover] = useState(null);


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

    const estadoTexto = (estado) => {
        switch (estado) {
            case 0:
                return "Pendente";
            case 1:
                return "Em Curso";
            case 2:
                return "Terminado";
            default:
                return "Desconhecido";
        }
    };

    const getEstadoClass = (estado) => {
        switch (estado) {
            case 0:
                return "text-secondary"; // cinzento
            case 1:
                return "text-success";   // verde
            case 2:
                return "text-danger";    // vermelho
            default:
                return "text-dark";
        }
    };

    useEffect(() => {
        axios.get(`https://pint-web-htw2.onrender.com/curso/get/${id}`)
            .then(res => setCurso(res.data.data))
            .catch(err => console.error("Erro ao buscar curso:", err));
        // Buscar categorias
        axios.get("https://pint-web-htw2.onrender.com/categoria/list")
            .then(res => setCategorias(res.data.data || []))
            .catch(() => setCategorias([]));

        // Buscar áreas
        axios.get("https://pint-web-htw2.onrender.com/area/list")
            .then(res => setAreas(res.data.data || []))
            .catch(() => setAreas([]));

        // Buscar tópicos
        axios.get("https://pint-web-htw2.onrender.com/topico-curso/list")
            .then(res => setTopicos(res.data.data || []))
            .catch(() => setTopicos([]));

        // Buscar formadores (role = 'formador')
        axios.get("https://pint-web-htw2.onrender.com/utilizador/list")
            .then(res => {
                const lista = (res.data.data || []).filter(u => u.role === "formador");
                setFormadores(lista);
            })
            .catch(() => setFormadores([]));

        axios.get(`https://pint-web-htw2.onrender.com/inscricao/curso/${id}`)
        .then(res => {
                const inscritos = (res.data.data || [])
                    .map(insc => insc.UTILIZADOR)
                    .filter(Boolean);
                setMembros(inscritos);
            })
            .catch(() => setMembros([]));

    }, [id]);

    useEffect(() => {
        if (curso) {
            setDataInicio(curso.dataInicio ? new Date(curso.dataInicio) : null);
            setDataFim(curso.dataFim ? new Date(curso.dataFim) : null);
        }
    }, [curso]);

    // Preencher estados com dados do curso ao carregar
    useEffect(() => {
        if (curso && topicos.length && areas.length && categorias.length) {
            const topicoSelecionado = topicos.find(t => t.id === curso.topicoId);
            const areaSelecionada = topicoSelecionado ? areas.find(a => a.id === topicoSelecionado.areaId) : null;
            const categoriaSelecionada = areaSelecionada ? categorias.find(c => c.id === areaSelecionada.categoriaId) : null;

            setNome(curso.nome || "");
            setDescricaoCurso(curso.descricaoCurso || "");
            setVaga(curso.vaga ?? "");
            setTipoCurso(curso.tipoCurso || "Online");
            setDuracao(curso.duracao || "");
            setNivel(curso.nivel || "Básico");
            setPontuacao(curso.pontuacao || 100);
            setDataInicio(curso.dataInicio ? new Date(curso.dataInicio) : null);
            setDataFim(curso.dataFim ? new Date(curso.dataFim) : null);
            setCategoriaId(categoriaSelecionada?.id || null);
            setAreaId(areaSelecionada?.id || null);
            setTopicoId(curso.topicoId || null);
            setFormadorId(curso.formadorId || null);
        }
    }, [curso, topicos, areas, categorias]);

    const handleUpdateCurso = async (e) => {
        e.preventDefault();
        try {
            // Atualiza os dados do curso
            await axios.put(
                `https://pint-web-htw2.onrender.com/curso/update/${curso.id}`,
                {
                    nome,
                    descricaoCurso,
                    vaga: tipoCurso === "Presencial" ? vaga : null,
                    tipoCurso,
                    duracao,
                    nivel,
                    pontuacao,
                    topicoId,
                    formadorId,
                    dataInicio,
                    dataFim
                },
                { headers: authHeader() }
            );

            // Se houver nova imagem, faz upload
            if (novaImagem) {
                const formData = new FormData();
                formData.append("imagem-banner", novaImagem);
                await axios.post(
                    `https://pint-web-htw2.onrender.com/curso/upload-imagem-banner/${curso.id}`,
                    formData,
                    { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
                );
            }

            setShowSuccessEditModal(true);
        } catch (err) {
            setMensagem("Erro ao atualizar curso.");
        }
    };

    const closeSuccessEditModal = () => {
        setFadeOutSuccessEditModal(true);
        setTimeout(() => {
            setShowSuccessEditModal(false);
            setFadeOutSuccessEditModal(false);
        }, 250); // 250ms deve ser igual à duração do fadeOutModal no CSS
    };

    const handleDeleteClick = (id) => {
        setCursoParaRemover(id);
        setShowDeleteModal(true);
    };

    const handleDeleteCurso = async () => {
        if (!cursoParaRemover) return;
        try {
            await axios.delete(`https://pint-web-htw2.onrender.com/curso/delete/${id}`, {
                headers: authHeader()
            });
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            setMensagem("Erro ao apagar curso.");
            setShowDeleteModal(false);
        }
    };

    const handleVerAulas = () => {
        if (curso?.tipoCurso === "Presencial") {
            navigate(`/curso-formador/gerir/${curso.id}`);
        } else if (curso?.tipoCurso === "Online") {
            navigate(`/curso-formador/gerir-assincrono/${curso.id}`);
        }
    };


    if (!curso || topicos.length === 0 || areas.length === 0 || categorias.length === 0) {
        return <p>A carregar curso...</p>;
    }

    const topicoSelecionado = topicos.find(t => t.id === curso.topicoId);
    const areaSelecionada = areas.find(a => a.id === topicoSelecionado?.areaId);
    const categoriaSelecionada = categorias.find(c => c.id === areaSelecionada?.categoriaId);

    return (
        <>

            <Helmet>
                <title>Detalhes - {curso.nome} / SoftSkills</title>
            </Helmet>
            
            <AdminSidebar />

            <div className="content flex-grow-1 p-4 ">
                {/* Centro */}
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
                                            <Link to={`/admin/gerir-curso/`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <i
                                                    className="fa-solid fa-arrow-left fa-2x me-3 mb-3"
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Link>
                                            <h2 className="fs-1 fw-bold mb-3">Detalhes</h2>
                                        </div>
                                        <form className="mt-3">
                                            <div className="mb-3">
                                                <label htmlFor="titulo" className="form-label">
                                                    Título
                                                </label>
                                                <div className="d-flex align-items-center flex-wrap gap-3">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded"
                                                        id="titulo"
                                                        value={nome || ""}
                                                        onChange={e => setNome(e.target.value)}
                                                        style={{ maxWidth: 500 }}
                                                    />
                                                    <h1 className={`fs-5 fw-bold mb-0 ms-5 me-3 ${getEstadoClass(curso?.estado)}`}>
                                                        {estadoTexto(curso?.estado)}
                                                    </h1>
                                                    <button
                                                        type="button"
                                                        className="btn ms-5"
                                                        style={{
                                                            backgroundColor: "#39639D",
                                                            color: "white",
                                                            width: 150
                                                        }}
                                                        onClick={handleVerAulas}
                                                    >
                                                        Ver aulas
                                                    </button>
                                                </div>
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
                                                            setAreaId(null); // Limpa área ao mudar categoria
                                                            setTopicoId(null); // Limpa tópico ao mudar categoria
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
                                                            setTopicoId(null); // Limpa tópico ao mudar área
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
                                                <div className="col-md-3">
                                                    <label htmlFor="formador" className="form-label">
                                                        Formador
                                                    </label>
                                                    <Select
                                                        id="formador"
                                                        options={formadores.map(formador => ({ value: formador.id, label: formador.nomeUtilizador }))}
                                                        value={formadores.find(formador => formador.id === formadorId) ? { value: formadorId, label: formadores.find(formador => formador.id === formadorId).nomeUtilizador } : null}
                                                        onChange={option => setFormadorId(option ? option.value : null)}
                                                        menuPlacement="bottom"
                                                        styles={selectEstilos}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3" style={{ maxWidth: 250 }}>
                                                <label
                                                    htmlFor="vagas"
                                                    className="form-label"
                                                    style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                                    title="Número de vagas - AVISO: Se o curso não tiver vagas, deixe em branco"
                                                >
                                                    Número de vagas - AVISO: Se o curso não tiver vagas, deixe em branco
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control rounded"
                                                    id="vagas"
                                                    value={vaga}
                                                    onChange={e => setVaga(e.target.value)}
                                                />
                                            </div>
                                            <div className="row mb-4 mt-4 align-items-stretch">
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label className="form-label">Data de Início</label>
                                                    <DatePicker
                                                        selected={dataInicio}
                                                        onChange={date => setDataInicio(date)}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control"
                                                        placeholderText="Escolha a data"
                                                        popperPlacement="bottom-end"
                                                        locale="pt"
                                                    />
                                                </div>
                                                <div className="col-md-3 d-flex flex-column">
                                                    <label className="form-label">Data Final</label>
                                                    <DatePicker
                                                        selected={dataFim}
                                                        onChange={date => setDataFim(date)}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control"
                                                        placeholderText="Escolha a data"
                                                        popperPlacement="bottom-end"
                                                        locale="pt"
                                                    />
                                                </div>
                                                <div className="col-md-6 d-flex flex-column">
                                                    <label className="form-label">Imagem banner</label>
                                                    <div
                                                        className="border rounded p-3 mb-3 d-flex align-items-center"
                                                        style={{ maxWidth: 200 }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-sm me-2"
                                                            onClick={handleCarregarImagem}
                                                        >
                                                            Carregar imagem
                                                        </button>
                                                        <i className="fas fa-upload" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            ref={fileInputRef}
                                                            onChange={handleImagemChange}
                                                        />
                                                    </div>
                                                    <label className="form-label">Descrição do curso</label>
                                                    <textarea
                                                        className="form-control mt-auto"
                                                        rows={4}
                                                        placeholder="Descrição do curso"
                                                        value={descricaoCurso}
                                                        onChange={e => setDescricaoCurso(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-3 mt-4">
                                    <img
                                        src={previewImagem || curso.imagemBanner || cursoBanner}
                                        alt=""
                                        className="mx-auto d-block w-100 mb-3"
                                        style={{ objectFit: "cover", maxHeight: 200, cursor: "pointer" }}
                                        onClick={handleCarregarImagem}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        onChange={handleImagemChange}
                                    />
                                    <label className="form-label" />
                                    <div
                                        className="border rounded p-3"
                                        style={{ minHeight: 600, backgroundColor: "#fff" }}
                                    >
                                        <p className="fw-semibold">Lista de membros</p>
                                        <ul
                                            className="list-group d-flex justify-content-start align-items-start"
                                            style={{ height: "100%" }}
                                        >
                                            {membros.length === 0 ? (
                                                <p className="text-center text-muted">
                                                    Nenhum membro inscrito neste curso
                                                </p>
                                            ) : (
                                                membros.map(membro => (
                                                    <li key={membro.id} className="list-group-item d-flex align-items-center border-0 text-start">
                                                        <img
                                                            src={membro.imagemPerfil || "assets/img/default_profile_pic.jpg"}
                                                            className="rounded me-3"
                                                            style={{ width: 32, height: 32, objectFit: "cover" }}
                                                            alt={membro.nomeUtilizador}
                                                        />
                                                        {membro.nomeUtilizador}
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn mt-3 me-4 mb-2"
                                        style={{ backgroundColor: "red", color: "white", width: 150 }}
                                        onClick={() => handleDeleteClick(curso.id)}
                                    >
                                        Apagar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn mt-3 mb-2"
                                        style={{ backgroundColor: "#39639D", color: "white", width: 150 }}
                                        onClick={handleUpdateCurso}
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
                                        Curso Atualizado!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    O curso foi atualizado com sucesso.
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
                    aria-labelledby="deleteCursoModalLabel"
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
                                        Apagar curso!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    Ao confirmar, o curso será apagado! Não será possível recuperar os dados!
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
                                    onClick={handleDeleteCurso}
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
                                        Curso Apagado!
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    O curso foi apagado com sucesso.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-continuar rounded px-4"
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate("/admin/gerir-curso/");
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

export default GerirCursoDetalhe;