import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";

import authHeader from "../auth.header";
import cursoBanner from "../../assets/admin/img/mariadb_curso.png";
import iconAviso from "../../assets/admin/svg/warning_vector.svg";
import iconSucesso from "../../assets/admin/svg/success_vector.svg";

function GerirConteudoCurso() {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));

    const [conteudo, setConteudo] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [membros, setMembros] = useState([]);
    const [curso, setCurso] = useState(null);

    // Conteudo
    const [showModal, setShowModal] = useState(false);
    const [novoConteudo, setNovoConteudo] = useState({ titulo: "", descricao: "", ordem: "" });
    const [ficheiros, setFicheiros] = useState([]);
    const [modalFade, setModalFade] = useState("custom-fade-in");
    const modalRef = useRef();
    const [loading, setLoading] = useState(false);

    // Editar Conteudo
    const [showEditModal, setShowEditModal] = useState(false);
    const [editModalFade, setEditModalFade] = useState("custom-fade-in");
    const editModalRef = useRef();
    const [conteudoEditar, setConteudoEditar] = useState({ id: null, titulo: "", descricao: "", ordem: "" });
    const [editFicheiros, setEditFicheiros] = useState([]);
    const [loadingEdit, setLoadingEdit] = useState(false);

    // Eliminar Conteudo
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [conteudoAEliminar, setConteudoAEliminar] = useState(null);

    // Estados para modal de apagar ficheiro
    const [showDeleteFicheiroModal, setShowDeleteFicheiroModal] = useState(false);
    const [showSuccessFicheiroModal, setShowSuccessFicheiroModal] = useState(false);
    const [ficheiroAEliminar, setFicheiroAEliminar] = useState({ ficheiroId: null, conteudoId: null });

    // Tarefa
    const [showTarefaModal, setShowTarefaModal] = useState(false);
    const [modalTarefaFade, setModalTarefaFade] = useState("custom-fade-in");
    const tarefaModalRef = useRef();
    const [novaTarefa, setNovaTarefa] = useState({
        titulo: "",
        descricao: "",
        dataLimite: "",
    });
    const [tarefaFicheiros, setTarefaFicheiros] = useState([]);
    const [loadingTarefa, setLoadingTarefa] = useState(false);

    // Estados para modais de tarefa
    const [showEditTarefaModal, setShowEditTarefaModal] = useState(false);
    const [editTarefaModalFade, setEditTarefaModalFade] = useState("custom-fade-in");
    const editTarefaModalRef = useRef();
    const [tarefaEditar, setTarefaEditar] = useState({ id: null, titulo: "", descricao: "", dataLimite: "" });
    const [editTarefaFicheiros, setEditTarefaFicheiros] = useState([]);
    const [loadingEditTarefa, setLoadingEditTarefa] = useState(false);

    const [showDeleteTarefaModal, setShowDeleteTarefaModal] = useState(false);
    const [showSuccessTarefaModal, setShowSuccessTarefaModal] = useState(false);
    const [tarefaAEliminar, setTarefaAEliminar] = useState(null);

    const [showDeleteTarefaFicheiroModal, setShowDeleteTarefaFicheiroModal] = useState(false);
    const [showSuccessTarefaFicheiroModal, setShowSuccessTarefaFicheiroModal] = useState(false);
    const [tarefaFicheiroAEliminar, setTarefaFicheiroAEliminar] = useState({ ficheiroId: null, tarefaId: null });

    
    // Aviso
    const [showAvisoModal, setShowAvisoModal] = useState(false);
    const [modalAvisoFade, setModalAvisoFade] = useState("custom-fade-in");
    const avisoModalRef = useRef();
    const [novoAviso, setNovoAviso] = useState({
        titulo: "",
        descricao: "",
        dataPublicacao: "",
        tipo: "aviso_geral", // valor por defeito
    });
    const [loadingAviso, setLoadingAviso] = useState(false);

    const tipoOptions = [
        { value: "aviso_geral", label: "Aviso Geral" },
        { value: "alteracao_data", label: "Alteração de Data" },
        { value: "nova_aula", label: "Nova Aula" },
        { value: "novo_material", label: "Novo Material" },
        { value: "avaliacao_disponivel", label: "Avaliação Disponível" },
    ];

    // Estados para editar aviso
    const [showEditAvisoModal, setShowEditAvisoModal] = useState(false);
    const [editAvisoModalFade, setEditAvisoModalFade] = useState("custom-fade-in");
    const editAvisoModalRef = useRef();
    const [avisoEditar, setAvisoEditar] = useState({ id: null, titulo: "", descricao: "" });
    const [loadingEditAviso, setLoadingEditAviso] = useState(false);

    // Estados para apagar aviso
    const [showDeleteAvisoModal, setShowDeleteAvisoModal] = useState(false);
    const [showSuccessAvisoModal, setShowSuccessAvisoModal] = useState(false);
    const [avisoAEliminar, setAvisoAEliminar] = useState(null);


    // Notas
    const [showNotasModal, setShowNotasModal] = useState(false);
    const [notasMembro, setNotasMembro] = useState([]);
    const [membroSelecionado, setMembroSelecionado] = useState(null);
    const [notaFinal, setNotaFinal] = useState("");
    const [loadingNotaFinal, setLoadingNotaFinal] = useState(false);
    const [sucessoNotaFinal, setSucessoNotaFinal] = useState("");
    const [notasModalFade, setNotasModalFade] = useState("custom-fade-in");

    useEffect(() => {
        // Carregar dados do curso
        axios.get(`https://pint-web-htw2.onrender.com/curso/get/${id}`,
            { headers: authHeader() })
            .then(res => setCurso(res.data.data));

        // Carregar conteudo
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/conteudo`,
            { headers: authHeader() })
            .then(res => setConteudo(res.data.data || []));

        // Carregar tarefas
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/tarefa`,
            { headers: authHeader() })
            .then(res => setTarefas(res.data.data || []));

        // Carregar avisos
        axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/aviso`,
            { headers: authHeader() })
            .then(res => setAvisos(res.data.data || []));

        // Carregar membros
        axios.get(`https://pint-web-htw2.onrender.com/inscricao/curso/${id}`, { headers: authHeader() })
            .then(res => {
                const inscritos = (res.data.data || [])
                    .map(insc => insc.UTILIZADOR)
                    .filter(Boolean);
                setMembros(inscritos);
            })
            .catch(() => setMembros([]));
    }, [id]);

    // Função para criar conteúdo e fazer upload dos ficheiros
    const handleCriarConteudo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Criar o conteúdo
            const res = await axios.post(
                "https://pint-web-htw2.onrender.com/conteudo/create",
                { ...novoConteudo, cursoId: id },
                { headers: authHeader() }
            );
            const conteudoId = res.data.data.id;

            // 2. Se houver ficheiros, fazer upload
            if (ficheiros.length > 0) {
                const formData = new FormData();
                for (let file of ficheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `https://pint-web-htw2.onrender.com/conteudo-ficheiro/${conteudoId}/ficheiros`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // 3. Atualizar lista de conteúdos
            axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/conteudo`, { headers: authHeader() })
                .then(res => setConteudo(res.data.data || []));

            setShowModal(false);
            setNovoConteudo({ titulo: "", descricao: "", ordem: "" });
            setFicheiros([]);
        } catch (err) {
            alert("Erro ao criar conteúdo ou fazer upload dos ficheiros.");
        }
        setLoading(false);
    };

    // Fechar modal ao clicar fora
    useEffect(() => {
        if (!showModal) return;
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalFade("custom-fade-out");
                setTimeout(() => setShowModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    // Editar conteúdo
    function handleEditarConteudo(conteudo) {
        setConteudoEditar({
            id: conteudo.id,
            titulo: conteudo.titulo,
            descricao: conteudo.descricao,
            ordem: conteudo.ordem
        });
        setEditFicheiros([]);
        setEditModalFade("custom-fade-in");
        setShowEditModal(true);
    }

    const handleEditarConteudoSubmit = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        try {
            // Atualizar dados do conteúdo
            await axios.put(
                `https://pint-web-htw2.onrender.com/conteudo/update/${conteudoEditar.id}`,
                {
                    titulo: conteudoEditar.titulo,
                    descricao: conteudoEditar.descricao,
                    ordem: conteudoEditar.ordem,
                },
                { headers: authHeader() }
            );

            // Se houver ficheiros novos, fazer upload
            if (editFicheiros.length > 0) {
                const formData = new FormData();
                for (let file of editFicheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `https://pint-web-htw2.onrender.com/conteudo-ficheiro/${conteudoEditar.id}/ficheiros`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // Atualizar lista de conteúdos
            const res = await axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/conteudo`, { headers: authHeader() });
            setConteudo(res.data.data || []);

            setShowEditModal(false);
            setConteudoEditar({ id: null, titulo: "", descricao: "", ordem: "" });
            setEditFicheiros([]);
        } catch (err) {
            alert("Erro ao editar conteúdo.");
        }
        setLoadingEdit(false);
    };

    useEffect(() => {
        if (!showEditModal) return;
        function handleClickOutside(event) {
            if (editModalRef.current && !editModalRef.current.contains(event.target)) {
                setEditModalFade("custom-fade-out");
                setTimeout(() => setShowEditModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEditModal]);

    // Função para abrir o modal de apagar
    function handleOpenDeleteModal(conteudoId) {
        setConteudoAEliminar(conteudoId);
        setShowDeleteModal(true);
    }


    // Eliminar conteúdo
    async function handleDeleteConteudo() {
        try {
            await axios.delete(`https://pint-web-htw2.onrender.com/conteudo/delete/${conteudoAEliminar}`, { headers: authHeader() });
            setConteudo(conteudo => conteudo.filter(c => c.id !== conteudoAEliminar));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            alert("Erro ao apagar conteúdo.");
            setShowDeleteModal(false);
        }
    }

    // Função para abrir modal de apagar ficheiro
    function handleOpenDeleteFicheiroModal(ficheiroId, conteudoId) {
        setFicheiroAEliminar({ ficheiroId, conteudoId });
        setShowDeleteFicheiroModal(true);
    }

    // Função para eliminar ficheiro
    async function handleDeleteFicheiro() {
        try {
            await axios.delete(
                `https://pint-web-htw2.onrender.com/conteudo-ficheiro/ficheiro/${ficheiroAEliminar.ficheiroId}`,
                { headers: authHeader() }
            );
            setConteudo(conteudo =>
                conteudo.map(c =>
                    c.id === ficheiroAEliminar.conteudoId
                        ? { ...c, ficheiros: c.ficheiros.filter(f => f.id !== ficheiroAEliminar.ficheiroId) }
                        : c
                )
            );
            setShowDeleteFicheiroModal(false);
            setShowSuccessFicheiroModal(true);
        } catch (err) {
            alert("Erro ao apagar ficheiro.");
            setShowDeleteFicheiroModal(false);
        }
    }

    // Fechar modal de tarefa ao clicar fora
    useEffect(() => {
        if (!showTarefaModal) return;
        function handleClickOutside(event) {
            if (tarefaModalRef.current && !tarefaModalRef.current.contains(event.target)) {
                setModalTarefaFade("custom-fade-out");
                setTimeout(() => setShowTarefaModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showTarefaModal]);

    // Função para criar tarefa e fazer upload dos ficheiros
    const handleCriarTarefa = async (e) => {
        e.preventDefault();
        setLoadingTarefa(true);
        try {
            // 1. Criar a tarefa
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.post(
                "https://pint-web-htw2.onrender.com/tarefa/create",
                {
                    ...novaTarefa,
                    cursoId: id,
                    utilizadorId: user?.id,
                },
                { headers: authHeader() }
            );
            const tarefaId = res.data.data.id;

            // 2. Se houver ficheiros, fazer upload
            if (tarefaFicheiros.length > 0) {
                const formData = new FormData();
                for (let file of tarefaFicheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `https://pint-web-htw2.onrender.com/tarefa-ficheiro/${tarefaId}/ficheiro`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // 3. Atualizar lista de tarefas
            axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/tarefa`, { headers: authHeader() })
                .then(res => setTarefas(res.data.data || []));

            setShowTarefaModal(false);
            setNovaTarefa({ titulo: "", descricao: "", dataLimite: "" });
            setTarefaFicheiros([]);
        } catch (err) {
            alert("Erro ao criar tarefa ou fazer upload dos ficheiros.");
        }
        setLoadingTarefa(false);
    };

    // Fechar modal ao clicar fora
    useEffect(() => {
        if (!showTarefaModal) return;
        function handleClickOutside(event) {
            if (tarefaModalRef.current && !tarefaModalRef.current.contains(event.target)) {
                setModalTarefaFade("custom-fade-out");
                setTimeout(() => setShowTarefaModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showTarefaModal]);

    // Editar tarefa
    function handleEditarTarefa(tarefa) {
        setTarefaEditar({
            id: tarefa.id,
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            dataLimite: tarefa.dataLimite ? tarefa.dataLimite.slice(0, 10) : ""
        });
        setEditTarefaFicheiros([]);
        setEditTarefaModalFade("custom-fade-in");
        setShowEditTarefaModal(true);
    }

    const handleEditarTarefaSubmit = async (e) => {
        e.preventDefault();
        setLoadingEditTarefa(true);
        try {
            // Atualizar dados da tarefa
            await axios.put(
                `https://pint-web-htw2.onrender.com/tarefa/update/${tarefaEditar.id}`,
                {
                    titulo: tarefaEditar.titulo,
                    descricao: tarefaEditar.descricao,
                    dataLimite: tarefaEditar.dataLimite,
                },
                { headers: authHeader() }
            );

            // Se houver ficheiros novos, fazer upload
            if (editTarefaFicheiros.length > 0) {
                const formData = new FormData();
                for (let file of editTarefaFicheiros) {
                    formData.append("ficheiros", file);
                }
                await axios.post(
                    `https://pint-web-htw2.onrender.com/tarefa-ficheiro/${tarefaEditar.id}/ficheiro`,
                    formData,
                    {
                        headers: {
                            ...authHeader(),
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // Atualizar lista de tarefas
            const res = await axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/tarefa`, { headers: authHeader() });
            setTarefas(res.data.data || []);

            setShowEditTarefaModal(false);
            setTarefaEditar({ id: null, titulo: "", descricao: "", dataLimite: "" });
            setEditTarefaFicheiros([]);
        } catch (err) {
            alert("Erro ao editar tarefa.");
        }
        setLoadingEditTarefa(false);
    };

    useEffect(() => {
        if (!showEditTarefaModal) return;
        function handleClickOutside(event) {
            if (editTarefaModalRef.current && !editTarefaModalRef.current.contains(event.target)) {
                setEditTarefaModalFade("custom-fade-out");
                setTimeout(() => setShowEditTarefaModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEditTarefaModal]);

    // Função para abrir o modal de apagar tarefa
    function handleOpenDeleteTarefaModal(tarefaId) {
        setTarefaAEliminar(tarefaId);
        setShowDeleteTarefaModal(true);
    }

    // Eliminar tarefa
    async function handleDeleteTarefa() {
        try {
            await axios.delete(`https://pint-web-htw2.onrender.com/tarefa/delete/${tarefaAEliminar}`, { headers: authHeader() });
            setTarefas(tarefas => tarefas.filter(t => t.id !== tarefaAEliminar));
            setShowDeleteTarefaModal(false);
            setShowSuccessTarefaModal(true);
        } catch (err) {
            alert("Erro ao apagar tarefa.");
            setShowDeleteTarefaModal(false);
        }
    }

    // Função para abrir modal de apagar ficheiro de tarefa
    function handleOpenDeleteTarefaFicheiroModal(ficheiroId, tarefaId) {
        setTarefaFicheiroAEliminar({ ficheiroId, tarefaId });
        setShowDeleteTarefaFicheiroModal(true);
    }

    // Função para eliminar ficheiro de tarefa
    async function handleDeleteTarefaFicheiro() {
        try {
            await axios.delete(
                `https://pint-web-htw2.onrender.com/tarefa-ficheiro/ficheiro/${tarefaFicheiroAEliminar.ficheiroId}`,
                { headers: authHeader() }
            );
            setTarefas(tarefas =>
                tarefas.map(t =>
                    t.id === tarefaFicheiroAEliminar.tarefaId
                        ? { ...t, ficheiros: t.ficheiros.filter(f => f.id !== tarefaFicheiroAEliminar.ficheiroId) }
                        : t
                )
            );
            setShowDeleteTarefaFicheiroModal(false);
            setShowSuccessTarefaFicheiroModal(true);
        } catch (err) {
            alert("Erro ao apagar ficheiro.");
            setShowDeleteTarefaFicheiroModal(false);
        }
    }

    // Fechar modal de aviso ao clicar fora
    useEffect(() => {
        if (!showAvisoModal) return;
        function handleClickOutside(event) {
            if (avisoModalRef.current && !avisoModalRef.current.contains(event.target)) {
                setModalAvisoFade("custom-fade-out");
                setTimeout(() => setShowAvisoModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAvisoModal]);

    // Função para criar aviso
    const handleCriarAviso = async (e) => {
        e.preventDefault();
        setLoadingAviso(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await axios.post(
                "https://pint-web-htw2.onrender.com/aviso/create",
                {
                    ...novoAviso,
                    cursoId: id,
                    utilizadorId: user?.id,
                    dataPublicacao: new Date(),
                },
                { headers: authHeader() }
            );

            // Atualizar lista de avisos (tente, mas não mostre erro se falhar)
            try {
                const res = await axios.get(`https://pint-web-htw2.onrender.com/curso/${id}/aviso`, { headers: authHeader() });
                setAvisos(res.data.data || []);
            } catch (err) {
                // Silencie o erro, pois o aviso já foi criado
            }

            setShowAvisoModal(false);
            setNovoAviso({ titulo: "", descricao: "", dataPublicacao: "" });
        } catch (err) {
            alert("Erro ao criar aviso.");
        }
        setLoadingAviso(false);
    };

    // Editar aviso
    function handleEditarAviso(aviso) {
        setAvisoEditar({
            id: aviso.id,
            titulo: aviso.titulo,
            descricao: aviso.descricao
        });
        setEditAvisoModalFade("custom-fade-in");
        setShowEditAvisoModal(true);
    }

    const handleEditarAvisoSubmit = async (e) => {
        e.preventDefault();
        setLoadingEditAviso(true);
        try {
            await axios.put(
                `https://pint-web-htw2.onrender.com/aviso/update/${avisoEditar.id}`,
                {
                    titulo: avisoEditar.titulo,
                    descricao: avisoEditar.descricao,
                },
                { headers: authHeader() }
            );

            // Atualizar lista de avisos
            const res = await axios.get(`https://pint-web-htw2.onrender.com/aviso/list?cursoId=${id}`, { headers: authHeader() });
            setAvisos(res.data.data || []);

            setShowEditAvisoModal(false);
            setAvisoEditar({ id: null, titulo: "", descricao: "" });
        } catch (err) {
            alert("Erro ao editar aviso.");
        }
        setLoadingEditAviso(false);
    };

    useEffect(() => {
        if (!showEditAvisoModal) return;
        function handleClickOutside(event) {
            if (editAvisoModalRef.current && !editAvisoModalRef.current.contains(event.target)) {
                setEditAvisoModalFade("custom-fade-out");
                setTimeout(() => setShowEditAvisoModal(false), 250);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEditAvisoModal]);

    // Função para abrir o modal de apagar aviso
    function handleOpenDeleteAvisoModal(avisoId) {
        setAvisoAEliminar(avisoId);
        setShowDeleteAvisoModal(true);
    }

    // Eliminar aviso
    async function handleDeleteAviso() {
        try {
            await axios.delete(`https://pint-web-htw2.onrender.com/aviso/delete/${avisoAEliminar}`, { headers: authHeader() });
            setAvisos(avisos => avisos.filter(a => a.id !== avisoAEliminar));
            setShowDeleteAvisoModal(false);
            setShowSuccessAvisoModal(true);
        } catch (err) {
            alert("Erro ao apagar aviso.");
            setShowDeleteAvisoModal(false);
        }
    }

    // Função para abrir o modal e buscar as notas do membro
    async function handleAbrirNotasModal(membro) {
        setMembroSelecionado(membro);
        setShowNotasModal(true);
        try {
            const res = await axios.get(
                `https://pint-web-htw2.onrender.com/curso/${id}/utilizador/${membro.id}/notas-tarefas`,
                { headers: authHeader() }
            );
            setNotasMembro(res.data.data);
        } catch {
            setNotasMembro([]);
        }
    }

    function handleCloseNotasModal() {
        setNotasModalFade("custom-fade-out");
        setTimeout(() => {
            setShowNotasModal(false);
            setNotasModalFade("custom-fade-in");
            setNotaFinal("");
            setSucessoNotaFinal("");
        }, 250); // tempo igual à animação CSS
    }

    // Função para submeter a nota final
    async function handleSubmeterNotaFinal() {
        if (!notaFinal || isNaN(notaFinal)) {
            setSucessoNotaFinal("Insira um valor numérico válido.");
            return;
        }
        setLoadingNotaFinal(true);
        setSucessoNotaFinal("");
        try {
            // 1. Buscar a inscrição do membro neste curso
            const res = await axios.get(
                `https://pint-web-htw2.onrender.com/inscricao/curso/${id}`,
                { headers: authHeader() }
            );
            // Encontrar a inscrição correta
            const inscricao = (res.data.data || []).find(
                insc => insc.utilizadorId === membroSelecionado.id
            );
            if (!inscricao) {
                setSucessoNotaFinal("Inscrição não encontrada.");
                setLoadingNotaFinal(false);
                return;
            }

            // 2. Atualizar a nota final via PUT
            await axios.put(
                `https://pint-web-htw2.onrender.com/inscricao/update/${inscricao.id}`,
                { notaFinal: Number(notaFinal) },
                { headers: authHeader() }
            );
            setSucessoNotaFinal("Nota final definida com sucesso!");
        } catch {
            setSucessoNotaFinal("Erro ao definir nota final.");
        }
        setLoadingNotaFinal(false);
    }

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

    return (
        <>
            <Helmet>
                <title>Gerir Conteúdo do Curso / SoftSkills</title>
            </Helmet>
            <div className="content flex-grow-1 no-sidebar mt-4">
                <div className="container py-4" style={{ background: "#f5f9ff", borderRadius: 8, minHeight: "90vh", overflowY: "auto", border: "1px solid #ccc" }}>
                    {/* Banner e botão voltar */}
                    <div className="row mb-4">
                        <div className="col-12 position-relative mb-5">
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    border: "none",
                                    textDecoration: "none",
                                    color: "inherit",
                                    position: "absolute",
                                    top: 20,
                                    left: 30,
                                    padding: 0
                                }}
                                onClick={() => {
                                    if (user?.role === "gestor") {
                                        navigate(-1);
                                    } else {
                                        navigate("/curso-formador");
                                    }
                                }}
                            >
                                <i
                                    className="fa-solid fa-arrow-left fa-2x me-3 mb-3"
                                    style={{ cursor: "pointer" }}
                                />
                            </button>
                            <h4 className="text-center w-100" style={{ marginTop: 20 }}>
                                {curso?.nome}
                            </h4>
                        </div>
                    </div>
                    {/* Conteúdo principal */}
                    <div className="row">
                        {/* Coluna esquerda: Conteudo, Tarefas, Avisos */}
                        <div className="col-md-8">
                            {/* Conteudo */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-bold" style={{ color: "#39639D" }}>Conteudo</h5>
                                    <button
                                        className="btn btn-primary"
                                        style={{ borderRadius: 12 }}
                                        onClick={() => {
                                            setModalFade("custom-fade-in");
                                            setShowModal(true);
                                        }}
                                    >
                                        Criar conteudo
                                    </button>
                                </div>
                                {/* Modal para criar conteúdo */}
                                {showModal && (
                                    <div
                                        className={`modal fade show ${modalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
                                            <form className="modal-content" onSubmit={handleCriarConteudo}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Dados do Novo Conteúdo
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título do conteúdo"
                                                            value={novoConteudo.titulo}
                                                            onChange={e => setNovoConteudo({ ...novoConteudo, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição do conteúdo"
                                                            value={novoConteudo.descricao}
                                                            onChange={e => setNovoConteudo({ ...novoConteudo, descricao: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Ordem
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control text-muted"
                                                            placeholder="Ordem"
                                                            value={novoConteudo.ordem}
                                                            onChange={e => setNovoConteudo({ ...novoConteudo, ordem: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setModalFade("custom-fade-out");
                                                                setTimeout(() => setShowModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loading}
                                                        >
                                                            {loading ? "A criar..." : "Criar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {/* Modal para editar conteudo */}
                                {showEditModal && (
                                    <div
                                        className={`modal fade show ${editModalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={editModalRef}>
                                            <form className="modal-content" onSubmit={handleEditarConteudoSubmit}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Editar Conteúdo
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título do conteúdo"
                                                            value={conteudoEditar.titulo}
                                                            onChange={e => setConteudoEditar({ ...conteudoEditar, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição do conteúdo"
                                                            value={conteudoEditar.descricao}
                                                            onChange={e => setConteudoEditar({ ...conteudoEditar, descricao: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Ordem
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control text-muted"
                                                            placeholder="Ordem"
                                                            value={conteudoEditar.ordem}
                                                            onChange={e => setConteudoEditar({ ...conteudoEditar, ordem: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Adicionar Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setEditFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setEditModalFade("custom-fade-out");
                                                                setTimeout(() => setShowEditModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingEdit}
                                                        >
                                                            {loadingEdit ? "A guardar..." : "Guardar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {/* Modal de delete */}
                                {showDeleteModal && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-labelledby="deleteConteudoModalLabel"
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
                                                            Apagar conteúdo!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, o conteúdo será apagado! Não será possível recuperar os dados!
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
                                                        onClick={handleDeleteConteudo}
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
                                                            Conteúdo Apagado!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        O conteúdo foi apagado com sucesso.
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

                                {showDeleteFicheiroModal && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-labelledby="deleteFicheiroModalLabel"
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
                                                            Apagar ficheiro!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, o ficheiro será apagado! Não será possível recuperar os dados!
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-voltar px-4"
                                                        onClick={() => setShowDeleteFicheiroModal(false)}
                                                    >
                                                        Voltar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-continuar px-4"
                                                        onClick={handleDeleteFicheiro}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showSuccessFicheiroModal && (
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
                                                            Ficheiro Apagado!
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        O ficheiro foi apagado com sucesso.
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-continuar rounded px-4"
                                                        onClick={() => setShowSuccessFicheiroModal(false)}
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded p-3">
                                    {conteudo.length === 0 ? (
                                        <div className="text-muted">Nenhum conteúdo criado.</div>
                                    ) : (
                                        [...conteudo]
                                            .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                                            .map(conteudo => (
                                                <div
                                                    key={conteudo.id}
                                                    className="mb-4 p-3 bg-white shadow-sm position-relative"
                                                    style={{
                                                        borderLeft: "6px solid #39639D",
                                                        borderRadius: 8,
                                                        boxShadow: "0 2px 8px #e0e7ef"
                                                    }}
                                                >
                                                    {/* Botões editar/eliminar conteúdo */}
                                                    <div className="position-absolute top-0 end-0 mt-2 me-2 d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Editar conteúdo"
                                                            onClick={() => handleEditarConteudo(conteudo)}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square" style={{ color: "#39639D" }} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Eliminar conteúdo"
                                                            onClick={() => handleOpenDeleteModal(conteudo.id)}
                                                        >
                                                            <i className="fa-solid fa-trash" style={{ color: "#c0392b" }} />
                                                        </button>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="fa-solid fa-book-open me-2" style={{ color: "#39639D", fontSize: 22 }} />
                                                        <span className="fw-bold fs-5" style={{ color: "#294873" }}>
                                                            {conteudo.titulo}
                                                        </span>
                                                    </div>
                                                    {conteudo.descricao && (
                                                        <div className="mb-2 ms-4 text-muted" style={{ fontSize: 15 }}>
                                                            {conteudo.descricao}
                                                        </div>
                                                    )}
                                                    {/* Ficheiros associados ao conteúdo */}
                                                    {conteudo.ficheiros && conteudo.ficheiros.length > 0 && (
                                                        <ul className="list-unstyled mb-0 ms-4">
                                                            {conteudo.ficheiros.map(fich => {
                                                                const nome = fich.nomeOriginal || "";
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
                                                                    <li key={fich.id} className="d-flex align-items-center mb-1">
                                                                        <i className={`fa-solid ${icon} me-2`} style={{ color: "#39639D", fontSize: 18 }} />
                                                                        {isImage ? (
                                                                            <a
                                                                                href={fich.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="fw-semibold file-link"
                                                                                style={{ color: "#294873", textDecoration: "underline" }}
                                                                            >
                                                                                {nome}
                                                                            </a>
                                                                        ) : (
                                                                            <a
                                                                                href={fich.url}
                                                                                download={nome}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="fw-semibold file-link"
                                                                                style={{ color: "#294873", textDecoration: "underline" }}
                                                                            >
                                                                                {nome}
                                                                            </a>
                                                                        )}
                                                                        {/* Botão eliminar ficheiro */}
                                                                        <button
                                                                            className="btn btn-sm btn-link ms-2 p-0"
                                                                            title="Eliminar ficheiro"
                                                                            onClick={() => handleOpenDeleteFicheiroModal(fich.id, conteudo.id)}
                                                                            style={{ color: "#c0392b" }}
                                                                        >
                                                                            <i className="fa-solid fa-trash" />
                                                                        </button>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                            {/* Tarefas */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-bold" style={{ color: "#39639D" }}>Tarefas</h5>
                                    <button
                                        className="btn btn-primary"
                                        style={{ borderRadius: 12 }}
                                        onClick={() => {
                                            setModalTarefaFade("custom-fade-in");
                                            setShowTarefaModal(true);
                                        }}
                                    >
                                        Criar tarefa
                                    </button>
                                </div>
                                {/* Modal para criar tarefa */}
                                {showTarefaModal && (
                                    <div
                                        className={`modal fade show ${modalTarefaFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={tarefaModalRef}>
                                            <form className="modal-content" onSubmit={handleCriarTarefa}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Dados da Nova Tarefa
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título da tarefa"
                                                            value={novaTarefa.titulo}
                                                            onChange={e => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição da tarefa"
                                                            value={novaTarefa.descricao}
                                                            onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Data Limite
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control text-muted"
                                                            value={novaTarefa.dataLimite}
                                                            onChange={e => setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setTarefaFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setModalTarefaFade("custom-fade-out");
                                                                setTimeout(() => setShowTarefaModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingTarefa}
                                                        >
                                                            {loadingTarefa ? "A criar..." : "Criar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Modal para editar tarefa */}
                                {showEditTarefaModal && (
                                    <div
                                        className={`modal fade show ${editTarefaModalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={editTarefaModalRef}>
                                            <form className="modal-content" onSubmit={handleEditarTarefaSubmit}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Editar Tarefa
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título da tarefa"
                                                            value={tarefaEditar.titulo}
                                                            onChange={e => setTarefaEditar({ ...tarefaEditar, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição da tarefa"
                                                            value={tarefaEditar.descricao}
                                                            onChange={e => setTarefaEditar({ ...tarefaEditar, descricao: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Data Limite
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control text-muted"
                                                            value={tarefaEditar.dataLimite}
                                                            onChange={e => setTarefaEditar({ ...tarefaEditar, dataLimite: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Adicionar Ficheiros
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control text-muted"
                                                            multiple
                                                            onChange={e => setEditTarefaFicheiros([...e.target.files])}
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setEditTarefaModalFade("custom-fade-out");
                                                                setTimeout(() => setShowEditTarefaModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingEditTarefa}
                                                        >
                                                            {loadingEditTarefa ? "A guardar..." : "Guardar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {showDeleteTarefaModal && (
                                    <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src={iconAviso} alt="Ícone de Aviso" style={{ width: 64, height: 64 }} />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Apagar tarefa!</h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, a tarefa será apagada! Não será possível recuperar os dados!
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button type="button" className="btn btn-voltar px-4" onClick={() => setShowDeleteTarefaModal(false)}>
                                                        Voltar
                                                    </button>
                                                    <button type="button" className="btn btn-continuar px-4" onClick={handleDeleteTarefa}>
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showSuccessTarefaModal && (
                                    <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src={iconSucesso} alt="Ícone de sucesso" style={{ width: 64, height: 64 }} />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Tarefa Apagada!</h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        A tarefa foi apagada com sucesso.
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button type="button" className="btn btn-continuar rounded px-4" onClick={() => setShowSuccessTarefaModal(false)}>
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showDeleteTarefaFicheiroModal && (
                                    <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src={iconAviso} alt="Ícone de Aviso" style={{ width: 64, height: 64 }} />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Apagar ficheiro!</h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        Ao confirmar, o ficheiro será apagado! Não será possível recuperar os dados!
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button type="button" className="btn btn-voltar px-4" onClick={() => setShowDeleteTarefaFicheiroModal(false)}>
                                                        Voltar
                                                    </button>
                                                    <button type="button" className="btn btn-continuar px-4" onClick={handleDeleteTarefaFicheiro}>
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showSuccessTarefaFicheiroModal && (
                                    <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src={iconSucesso} alt="Ícone de sucesso" style={{ width: 64, height: 64 }} />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Ficheiro Apagado!</h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        O ficheiro foi apagado com sucesso.
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button type="button" className="btn btn-continuar rounded px-4" onClick={() => setShowSuccessTarefaFicheiroModal(false)}>
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded p-3 shadow-sm mb-2">
                                    {tarefas.length === 0 ? (
                                        <div className="text-muted">Nenhuma tarefa criada.</div>
                                    ) : (
                                        tarefas
                                            .sort((a, b) => new Date(a.dataLimite) - new Date(b.dataLimite))
                                            .map(tarefa => (
                                                <div
                                                    key={tarefa.id}
                                                    className="mb-4 p-4 bg-white shadow-sm position-relative"
                                                    style={{
                                                        borderLeft: "6px solid #39639D",
                                                        borderRadius: 8,
                                                        boxShadow: "0 2px 8px #e0e7ef",
                                                        minHeight: 120,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    {/* Botões editar/eliminar tarefa */}
                                                    <div className="position-absolute top-0 end-0 mt-2 me-2 d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Editar tarefa"
                                                            onClick={() => handleEditarTarefa(tarefa)}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square" style={{ color: "#39639D" }} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light border"
                                                            title="Eliminar tarefa"
                                                            onClick={() => handleOpenDeleteTarefaModal(tarefa.id)}
                                                        >
                                                            <i className="fa-solid fa-trash" style={{ color: "#c0392b" }} />
                                                        </button>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="fw-bold" style={{ color: "#294873", fontSize: 18 }}>
                                                            {tarefa.titulo}
                                                        </div>
                                                        <div className="text-muted mb-2" style={{ fontSize: 15 }}>
                                                            {tarefa.descricao}
                                                        </div>
                                                        <div className="text-muted small mb-3" style={{ fontSize: 13 }}>
                                                            Data limite:{" "}
                                                            {tarefa.dataLimite
                                                                ? new Date(tarefa.dataLimite).toLocaleDateString("pt-PT")
                                                                : "-"}
                                                        </div>
                                                        {/* Ficheiros associados à tarefa */}
                                                        {tarefa.ficheiros && tarefa.ficheiros.length > 0 && (
                                                            <ul className="list-unstyled mb-2">
                                                                {tarefa.ficheiros.map(fich => {
                                                                    const nome = fich.nomeOriginal || "";
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
                                                                        <li key={fich.id} className="d-flex align-items-center mb-1">
                                                                            <i className={`fa-solid ${icon} me-2`} style={{ color: "#39639D", fontSize: 18 }} />
                                                                            {isImage ? (
                                                                                <a
                                                                                    href={fich.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="fw-semibold file-link"
                                                                                    style={{ color: "#294873", textDecoration: "underline" }}
                                                                                >
                                                                                    {nome}
                                                                                </a>
                                                                            ) : (
                                                                                <a
                                                                                    href={fich.url}
                                                                                    download={nome}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="fw-semibold file-link"
                                                                                    style={{ color: "#294873", textDecoration: "underline" }}
                                                                                >
                                                                                    {nome}
                                                                                </a>
                                                                            )}
                                                                            {/* Botão eliminar ficheiro */}
                                                                            <button
                                                                                className="btn btn-sm btn-link ms-2 p-0"
                                                                                title="Eliminar ficheiro"
                                                                                onClick={() => handleOpenDeleteTarefaFicheiroModal(fich.id, tarefa.id)}
                                                                                style={{ color: "#c0392b" }}
                                                                            >
                                                                                <i className="fa-solid fa-trash" />
                                                                            </button>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        )}
                                                            <Link
                                                                to={`/curso-formador/gerir/${id}/gerir-submissao/${tarefa.id}`}
                                                                className="btn"
                                                                style={{
                                                                    background: "#39639D",
                                                                    color: "#fff",
                                                                    borderRadius: 20,
                                                                    padding: "6px 24px",
                                                                    fontWeight: 500,
                                                                    fontSize: 15,
                                                                    boxShadow: "0 2px 8px #b5cbe6"
                                                                }}
                                                            >
                                                                Ver submissões
                                                            </Link>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                            {/* Avisos */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-bold" style={{ color: "#39639D" }}>Avisos</h5>
                                    <button
                                        className="btn btn-primary"
                                        style={{ borderRadius: 12 }}
                                        onClick={() => {
                                            setModalAvisoFade("custom-fade-in");
                                            setShowAvisoModal(true);
                                        }}
                                    >
                                        Criar aviso
                                    </button>
                                </div>
                                {/* Modal para criar aviso */}
                                {showAvisoModal && (
                                    <div
                                        className={`modal fade show ${modalAvisoFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={avisoModalRef}>
                                            <form className="modal-content" onSubmit={handleCriarAviso}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Dados do Novo Aviso
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título do aviso"
                                                            value={novoAviso.titulo}
                                                            onChange={e => setNovoAviso({ ...novoAviso, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição do aviso"
                                                            value={novoAviso.descricao}
                                                            onChange={e => setNovoAviso({ ...novoAviso, descricao: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                    <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                        Tipo de Notificação
                                                    </label>
                                                    <Select
                                                        options={tipoOptions}
                                                        value={tipoOptions.find(opt => opt.value === novoAviso.tipo)}
                                                        onChange={opt => setNovoAviso({ ...novoAviso, tipo: opt.value })}
                                                        styles={selectEstilos}
                                                        isSearchable={false}
                                                        placeholder="Selecione o tipo..."
                                                        required
                                                    />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setModalAvisoFade("custom-fade-out");
                                                                setTimeout(() => setShowAvisoModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingAviso}
                                                        >
                                                            {loadingAviso ? "A criar..." : "Criar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {/* Modal para editar aviso */}
                                {showEditAvisoModal && (
                                    <div
                                        className={`modal fade show ${editAvisoModalFade}`}
                                        style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" ref={editAvisoModalRef}>
                                            <form className="modal-content" onSubmit={handleEditarAvisoSubmit}>
                                                <div
                                                    className="modal-header text-white py-5 position-relative"
                                                    style={{
                                                        background: "linear-gradient(90deg, #294873, #1C4072)"
                                                    }}
                                                >
                                                    <h5 className="fw-bold fs-3 m-0 text-start">
                                                        Editar Aviso
                                                    </h5>
                                                </div>
                                                <div className="modal-body mt-5" style={{ color: "#294873" }}>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Título
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-muted"
                                                            placeholder="Título do aviso"
                                                            value={avisoEditar.titulo}
                                                            onChange={e => setAvisoEditar({ ...avisoEditar, titulo: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6" style={{ color: "#294873" }}>
                                                            Descrição
                                                        </label>
                                                        <textarea
                                                            className="form-control text-muted"
                                                            placeholder="Descrição do aviso"
                                                            value={avisoEditar.descricao}
                                                            onChange={e => setAvisoEditar({ ...avisoEditar, descricao: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="modal-footer d-flex justify-content-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-cancelar me-4"
                                                            style={{ background: "#e0e7ef", color: "#294873", border: "none" }}
                                                            onClick={() => {
                                                                setEditAvisoModalFade("custom-fade-out");
                                                                setTimeout(() => setShowEditAvisoModal(false), 250);
                                                            }}
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            disabled={loadingEditAviso}
                                                        >
                                                            {loadingEditAviso ? "A guardar..." : "Guardar"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                                {showDeleteAvisoModal && (
                                <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                    style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                    <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                        <div className="modal-content">
                                            <div className="modal-body py-4">
                                                <div className="d-flex flex-column align-items-center mb-3">
                                                    <img src={iconAviso} alt="Ícone de Aviso" style={{ width: 64, height: 64 }} />
                                                    <h1 className="text-center fs-2 fw-bold mt-3">Apagar aviso!</h1>
                                                </div>
                                                <p className="text-center fs-5">
                                                    Ao confirmar, o aviso será apagado! Não será possível recuperar os dados!
                                                </p>
                                            </div>
                                            <div className="modal-footer justify-content-center py-3">
                                                <button type="button" className="btn btn-voltar px-4" onClick={() => setShowDeleteAvisoModal(false)}>
                                                    Voltar
                                                </button>
                                                <button type="button" className="btn btn-continuar px-4" onClick={handleDeleteAviso}>
                                                    Continuar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showSuccessAvisoModal && (
                                <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog"
                                    style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                    <div className="modal-dialog modal-dialog-centered custom-fade-in" style={{ maxWidth: 550 }}>
                                        <div className="modal-content">
                                            <div className="modal-body py-4">
                                                <div className="d-flex flex-column align-items-center mb-3">
                                                    <img src={iconSucesso} alt="Ícone de sucesso" style={{ width: 64, height: 64 }} />
                                                    <h1 className="text-center fs-2 fw-bold mt-3">Aviso Apagado!</h1>
                                                </div>
                                                <p className="text-center fs-5">
                                                    O aviso foi apagado com sucesso.
                                                </p>
                                            </div>
                                            <div className="modal-footer justify-content-center py-3">
                                                <button type="button" className="btn btn-continuar rounded px-4" onClick={() => setShowSuccessAvisoModal(false)}>
                                                    Continuar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="bg-white rounded p-3 shadow-sm mb-2">
                                    {avisos.length === 0 ? (
                                        <div className="text-muted">Nenhum aviso criado.</div>
                                    ) : (
                                        avisos.map(aviso => (
                                            <div
                                                key={aviso.id}
                                                className="d-flex justify-content-between align-items-center mb-3 position-relative p-3 bg-white shadow-sm"
                                                style={{
                                                    borderLeft: "6px solid #39639D",
                                                    borderRadius: 8,
                                                    boxShadow: "0 2px 8px #e0e7ef"
                                                }}
                                            >
                                                <div>
                                                <div
                                                    className="fw-semibold"
                                                    style={{
                                                        color: "#39639D",
                                                        fontSize: 18,
                                                        wordBreak: "break-word",
                                                        whiteSpace: "pre-line"   
                                                    }}
                                                >
                                                    {aviso.titulo}
                                                </div>
                                                <div className="text-muted small mb-2" style={{ fontSize: 15, wordBreak: "break-word", whiteSpace: "pre-line" }}>
                                                    {aviso.descricao}
                                                </div>
                                                    <div className="text-muted small mb-2" style={{ fontSize: 13 }}>
                                                        {/* Mostra a data de publicação do aviso */}
                                                        {aviso.dataPublicacao
                                                            ? `Publicado em: ${new Date(aviso.dataPublicacao).toLocaleString("pt-PT")}`
                                                            : ""}
                                                    </div>
                                                </div>
                                                {/* Botões editar/remover aviso */}
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-light border"
                                                        title="Editar aviso"
                                                        onClick={() => handleEditarAviso(aviso)}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square" style={{ color: "#39639D" }} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light border"
                                                        title="Eliminar aviso"
                                                        onClick={() => handleOpenDeleteAvisoModal(aviso.id)}
                                                    >
                                                        <i className="fa-solid fa-trash" style={{ color: "#c0392b" }} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Coluna direita: Lista de membros */}
                        <div className="col-md-4">
                            <div className="bg-white rounded p-4 h-100" style={{ minHeight: 350, border: "1px solid #e0e7ef" }}>
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
                                                    src={membro.imagemPerfil || "/assets/img/default_profile_pic.jpg"}
                                                    className="rounded me-3"
                                                    style={{ width: 32, height: 32, objectFit: "cover" }}
                                                    alt={membro.nomeUtilizador}
                                                />
                                                {membro.nomeUtilizador}
                                                <button
                                                    className="btn btn-sm ms-5"
                                                        style={{
                                                            borderRadius: 12,
                                                            background: "#39639D",
                                                            color: "#fff",
                                                            fontWeight: 500,
                                                            boxShadow: "0 2px 8px #b5cbe6"
                                                        }}
                                                    onClick={() => handleAbrirNotasModal(membro)}
                                                >
                                                    Ver notas
                                                </button>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                            {/* Modal de notas do membro */}
                            {showNotasModal && membroSelecionado && (
                                <div
                                    className={`modal fade show ${notasModalFade}`}
                                    tabIndex={-1}
                                    aria-modal="true"
                                    role="dialog"
                                    style={{
                                        display: "block",
                                        background: "rgba(57, 99, 157, 0.5)"
                                    }}
                                        onClick={e => {
                                            if (e.target === e.currentTarget) handleCloseNotasModal();
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
                                                <h5 className="modal-title fw-bold">
                                                    Notas de {membroSelecionado.nomeUtilizador}
                                                </h5>
                                            </div>
                                            <div className="modal-body" style={{ color: "#294873" }}>
                                                {notasMembro.length === 0 ? (
                                                    <div className="text-muted">Sem notas registadas.</div>
                                                ) : (
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Tarefa</th>
                                                                <th>Nota</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {notasMembro.map((nota, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{nota.tarefa}</td>
                                                                    <td>{nota.nota ?? "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}

                                                {/* Secção para definir nota final */}
                                                <div className="mt-4">
                                                    <label className="fw-bold mb-2" style={{ color: "#39639D" }}>
                                                        Definir Nota Final:
                                                    </label>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            style={{ maxWidth: 120 }}
                                                            value={notaFinal}
                                                            onChange={e => setNotaFinal(e.target.value)}
                                                            placeholder="Nota final"
                                                            min={0}
                                                            max={20}
                                                        />
                                                        <button
                                                            className="btn btn-adicionar"
                                                            style={{ background: "#39639D", color: "#fff" }}
                                                            onClick={handleSubmeterNotaFinal}
                                                            disabled={loadingNotaFinal}
                                                        >
                                                            {loadingNotaFinal ? "A guardar..." : "Submeter"}
                                                        </button>
                                                    </div>
                                                    {sucessoNotaFinal && (
                                                        <div className={`mt-2 ${sucessoNotaFinal.includes("sucesso") ? "text-success" : "text-danger"}`}>
                                                            {sucessoNotaFinal}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-cancelar"
                                                    onClick={handleCloseNotasModal}
                                                >
                                                    Fechar
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
        </>
    );
}

export default GerirConteudoCurso;