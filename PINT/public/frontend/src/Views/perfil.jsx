import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import authHeader from "./auth.header";
import axios from "axios";

function CursoCard({ id, imagem, nome, formador, dataRegisto, dataTermino, nota, concluido, percentagem, onTransferirCertificado, tipoCurso }) {
    const [avaliacaoUsuario, setAvaliacaoUsuario] = useState(null);
    const [notaAvaliacao, setNotaAvaliacao] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showAvaliacaoErroModal, setShowAvaliacaoErroModal] = useState(false);
    const [avaliacaoErroMsg, setAvaliacaoErroMsg] = useState("");
    const [fadeOutAvaliacaoErro, setFadeOutAvaliacaoErro] = useState(false);

    // Determinar se o certificado está disponível
    const certificadoDisponivel = tipoCurso === 'Presencial'
        ? (nota && nota !== "---" && nota !== "???") // Para presencial: verifica se tem nota
        : concluido; // Para online: usa campo concluído

    // Buscar avaliação existente do usuário para este curso
    useEffect(() => {
        const fetchAvaliacaoUsuario = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.id) {
                try {
                    const response = await axios.get(`https://pint-web-htw2.onrender.com/avaliacao/list`);
                    if (response.data.success) {
                        const avaliacaoExistente = response.data.data.find(
                            av => av.utilizadorId === user.id && av.cursoId === id
                        );
                        if (avaliacaoExistente) {
                            setAvaliacaoUsuario(avaliacaoExistente);
                            setNotaAvaliacao(avaliacaoExistente.nota);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao buscar avaliação:", error);
                }
            }
        };
        fetchAvaliacaoUsuario();
    }, [id]);

    const handleAvaliacaoSubmit = async (nota) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            console.error("Usuário não encontrado");
            return;
        }

        try {
            let response;
            if (avaliacaoUsuario) {
                console.log("Atualizando avaliação existente...");
                response = await axios.put(
                    `https://pint-web-htw2.onrender.com/avaliacao/update/${avaliacaoUsuario.id}`,
                    { nota },
                    { headers: authHeader() }
                );
            } else {
                console.log("Criando nova avaliação...");
                const requestData = {
                    nota,
                    utilizadorId: user.id,
                    cursoId: id
                };
                console.log("Dados do request:", requestData);

                response = await axios.post(
                    `https://pint-web-htw2.onrender.com/avaliacao/create`,
                    requestData,
                    { headers: authHeader() }
                );
            }

            console.log("Resposta da API:", response.data);

            if (response.data.success) {
                setNotaAvaliacao(nota);
                if (!avaliacaoUsuario) {
                    setAvaliacaoUsuario({ id: response.data.data.id, nota, utilizadorId: user.id, cursoId: id });
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setAvaliacaoErroMsg(error.response.data.message || "Erro ao avaliar curso");
            } else {
                setAvaliacaoErroMsg("Erro ao avaliar curso");
            }
            setShowAvaliacaoErroModal(true);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                style={{
                    fontSize: '20px',
                    color: star <= (hoveredStar || notaAvaliacao) ? '#ffc107' : '#e0e0e0',
                    cursor: 'pointer',
                    marginRight: '2px'
                }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleAvaliacaoSubmit(star)}
            >
                ★
            </span>
        ));
    };

    const handleCloseAvaliacaoErroModal = () => {
        setFadeOutAvaliacaoErro(true);
        setTimeout(() => {
            setShowAvaliacaoErroModal(false);
            setFadeOutAvaliacaoErro(false);
        }, 250); // igual à duração do fadeOutModal
    };

    return (
        <div className="row mt-4 mb-4 p-0 ms-1 ms-md-2 align-items-center hover-shadow" style={{ cursor: "pointer" }}>
            <div className="row col-12 col-md-3 d-flex flex-column justify-content-center align-items-center mb-2 mb-md-0 ms-0 me-0">
                <Link className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-2 mb-md-0 text-decoration-none" to={`/curso/${id}`}>
                    <img
                        src={imagem}
                        className="img-fluid rounded"
                        alt={nome}
                        style={{
                            objectFit: "fit",
                            maxHeight: 200,
                            minHeight: 100,
                            maxWidth: 250,
                            minWidth: 150
                        }}
                    />
                </Link>
                <div className="mt-2" style={{ maxWidth: 250 }}>
                    <div
                        className="text-center py-1 rounded text-white fw-bold"
                        style={{
                            backgroundColor: '#39639d',
                            fontSize: '14px'
                        }}
                    >
                        {tipoCurso === 'Presencial' ? 'Síncrono' : 'Assíncrono'}
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-4 mb-2 mb-md-0 text-decoration-none">
                <Link to={`/curso/${id}`} className="text-decoration-none">
                    <p className="fw-bold mb-1" style={{ color: '#39639d' }}>{nome}</p>
                    <p className="grey-text mb-1">Formador: {formador}</p>
                    <p className="mb-1" style={{ color: '#39639d' }}>
                        Data de registo <strong>{dataRegisto}</strong>
                    </p>
                    <p className="mb-1" style={{ color: '#39639d' }}>
                        Data de fim  <strong>{dataTermino}</strong>
                    </p>
                </Link>
                <div className="d-flex align-items-center mt-2">
                    <span className="me-2" style={{ color: '#39639d', fontSize: '14px', fontWeight: 'bold' }}>
                        Avaliação:
                    </span>
                    {renderStars()}
                    {notaAvaliacao > 0 && (
                        <span className="ms-2" style={{ color: '#39639d', fontSize: '12px' }}>
                            ({notaAvaliacao}/5)
                        </span>
                    )}
                </div>
            </div>
            <div className="col-12 col-md-5 row p-0 ms-1 ms-md-2 justify-content-center">
                <div className={`col-12 ${tipoCurso === 'Presencial' ? 'col-md-6' : 'col-md-12 w-50'} mb-2 mb-md-0 d-flex justify-content-center align-items-center`}>
                    <button
                        className="btn w-100"
                        style={{
                            fontSize: 15,
                            backgroundColor: certificadoDisponivel ? '#39639d' : '#bdcde3',
                            color: 'white',
                            cursor: certificadoDisponivel ? 'pointer' : 'not-allowed',
                            opacity: certificadoDisponivel ? 1 : 0.6
                        }}
                        disabled={!certificadoDisponivel}
                        onClick={certificadoDisponivel ? onTransferirCertificado : undefined}
                        title={certificadoDisponivel ? "Transferir Certificado" :
                            (tipoCurso === 'Online' ? `${percentagem}% concluído` : "Aguarde a atribuição da nota")}
                    >
                        {certificadoDisponivel ? "Transferir Certificado" :
                            (tipoCurso === 'Online' ? `${percentagem}% concluído` : "Aguarde Avaliação")}
                    </button>
                </div>
                {tipoCurso === 'Presencial' && (
                    <div className="col-12 col-md-4 mt-2 mt-md-0">
                        <div className="container border border-secondary border-opacity-50 rounded-4 p-2" style={{ width: '100%' }}>
                            <p className="mb-0 text-center fw-bold" style={{ fontSize: 16, color: '#39639d' }}>
                                Nota Final
                            </p>
                            <p className="text-center fs-lg fw-bold" style={{ color: '#39639d', fontSize: 32 }}>
                                {nota}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {showAvaliacaoErroModal && (
                <div
                    className="modal fade show"
                    tabIndex={-1}
                    aria-modal="true"
                    role="dialog"
                    style={{
                        display: "block",
                        background: "rgba(57, 99, 157, 0.5)"
                    }}
                    onClick={handleCloseAvaliacaoErroModal}
                >
                    <div
                        className={`modal-dialog modal-dialog-centered ${fadeOutAvaliacaoErro ? "custom-fade-out" : "custom-fade-in"}`}
                        style={{ maxWidth: 550 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-body py-4">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <img
                                        src="/img/warning_vector.svg"
                                        alt="Ícone de Aviso"
                                        style={{ width: 64, height: 64 }}
                                    />
                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                        Erro na Avaliação
                                    </h1>
                                </div>
                                <p className="text-center fs-5">
                                    {avaliacaoErroMsg}
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center py-3">
                                <button
                                    type="button"
                                    className="btn btn-voltar px-4"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleCloseAvaliacaoErroModal();
                                    }}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
}

function Perfil() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [novaPassword, setNovaPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [isEditProfileSuccessModalOpen, setEditProfileSuccessModalOpen] = useState(false);
    const [erro, setErro] = useState("");
    const [cursos, setCursos] = useState([]);
    const [imagemPerfil, setImagemPerfil] = useState(null);
    const [progressoCursos, setProgressoCursos] = useState({});

    const handleEditProfile = async (e) => {
        e.preventDefault();
        setErro("");

        let imageSuccess = true;
        let passwordSuccess = true;

        // Upload da imagem de perfil (se houver nova imagem)
        if (imagemPerfil) {
            const formData = new FormData();
            formData.append("imagem-perfil", imagemPerfil);

            try {
                const response = await axios.post(
                    "https://pint-web-htw2.onrender.com/utilizador/upload-imagem-perfil",
                    formData,
                    { headers: { ...authHeader() } }
                );
                const data = response.data;
                if (data.success) {
                    const updatedUser = { ...user, imagemPerfil: data.imageUrl };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setImagemPerfil(null);
                } else {
                    imageSuccess = false;
                    setErro(data.message || "Erro ao atualizar imagem de perfil.");
                }
            } catch (error) {
                imageSuccess = false;
                setErro("Erro ao conectar ao servidor (imagem).");
            }
        }

        // Alteração da password (apenas se algum campo de password foi preenchido)
        if (currentPassword || novaPassword || confirmPassword) {
            // Validação dos campos de password
            if (!currentPassword || !novaPassword || !confirmPassword) {
                setErro("Preencha todos os campos de password para alterar a palavra-passe.");
                passwordSuccess = false;
            } else if (novaPassword !== confirmPassword) {
                setErro("As passwords não coincidem.");
                passwordSuccess = false;
            } else {
                try {
                    const response = await axios.patch(
                        "https://pint-web-htw2.onrender.com/auth/updatePassword",
                        {
                            currentPassword: currentPassword,
                            newPassword: novaPassword
                        },
                        { headers: { "Content-Type": "application/json", ...authHeader() } }
                    );
                    const data = response.data;
                    if (!data.success) {
                        passwordSuccess = false;
                        setErro(data.message || "Erro ao atualizar password.");
                    } else {
                        setCurrentPassword("");
                        setNovaPassword("");
                        setConfirmPassword("");
                    }
                } catch (error) {
                    passwordSuccess = false;
                    setErro("Erro ao conectar ao servidor (password).");
                }
            }
        }

        // Se ambos correram bem, mostra modal de sucesso e fecha modal de edição
        if (imageSuccess && passwordSuccess) {
            setEditProfileModalOpen(false);
            setEditProfileSuccessModalOpen(true);
        }
    };

    function closeEditProfileSuccessModal() {
        setEditProfileSuccessModalOpen(false);
    }

    useEffect(() => {
        if (user && user.id) {
            axios.get(`https://pint-web-htw2.onrender.com/inscricao/utilizador/${user.id}`)
                .then(async response => {
                    const data = response.data;
                    if (data.success) {
                        const cursosArr = data.data
                            .filter(insc => insc.CURSO)
                            .map(insc => ({
                                ...insc.CURSO,
                                inscricaoId: insc.id,
                                dataRegisto: insc.dataInscricao,
                                dataTermino: insc.dataConclusao,
                                nota: insc.notaFinal || "---", // Corrigido: pega nota da inscrição
                                concluido: insc.concluido // Adiciona campo concluído da inscrição
                            }));

                        // Buscar nome do formador para cada curso
                        const cursosComFormador = await Promise.all(
                            cursosArr.map(async curso => {
                                let nomeFormador = "Desconhecido";
                                if (curso.formadorId) {
                                    try {
                                        const res = await axios.get(`https://pint-web-htw2.onrender.com/utilizador/get/${curso.formadorId}`, { headers: authHeader() });
                                        if (res.data.success && res.data.data && res.data.data.nomeUtilizador) {
                                            nomeFormador = res.data.data.nomeUtilizador;
                                        }
                                    } catch (e) { }
                                }
                                return { ...curso, formador: nomeFormador };
                            })
                        );

                        setCursos(cursosComFormador);

                        // Buscar progresso de todos os cursos em paralelo
                        Promise.all(
                            cursosComFormador.map(curso =>
                                axios.get(`https://pint-web-htw2.onrender.com/progresso-aula/progresso/${user.id}/${curso.id}`, { headers: authHeader() })
                                    .then(res => ({
                                        cursoId: curso.id,
                                        percentagem: res.data.success ? res.data.percentagem : 0
                                    }))
                                    .catch(() => ({
                                        cursoId: curso.id,
                                        percentagem: 0
                                    }))
                            )
                        ).then(results => {
                            const progressoObj = {};
                            results.forEach(r => { progressoObj[r.cursoId] = r.percentagem; });
                            setProgressoCursos(progressoObj);
                        });
                    }
                });
        }
    }, [user]);

    function formatarData(dataISO) {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-PT"); // Formato: dd/mm/aaaa
    }

    async function handleTransferirCertificado(inscricaoId) {
        try {
            const response = await axios.get(
                `https://pint-web-htw2.onrender.com/certificado/download/${inscricaoId}`,
                {
                    headers: { ...authHeader() },
                    responseType: "blob"
                }
            );
            // Cria um link temporário para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `certificado-${inscricaoId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Erro ao transferir certificado.");
        }
    }

    if (!user) return <div>Por favor, faça login.</div>;

    return (
        <div className="min-vh-100">
            <div className="scrollbar" style={{ height: 'min-content' }} />
            <div className="container2 mt-4">
                <div className="row bg-translucent rounded d-flex justify-content-center">
                    <div className="col-12 row" style={{ minHeight: 250 }}>
                        <div className="row col-12 col-md-6 align-items-center ms-0 ms-md-2" style={{ height: '100%' }}>
                            <img
                                src={user.imagemPerfil || "/img/profile-picture-BIG.png"}
                                className="col-4 col-md-4 ms-0 ms-md-2 img-fluid mt-3 mt-md-0 mb-2 mb-md-0 rounded-circle"
                                style={{
                                    width: 200,
                                    height: 180,
                                    objectFit: "cover",
                                    aspectRatio: "1/1",
                                    minWidth: 200,
                                    minHeight: 180,
                                    maxWidth: 200,
                                    maxHeight: 180
                                }}
                                alt="Foto de perfil"
                            />
                            <div className="col-8 col-md-6 mt-2 mt-md-0">
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#39639d' }}>
                                        {user.nomeUtilizador}
                                    </h3>
                                    <p className="blue-text mb-0 fw-bold">
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </p>
                                    <p className="grey-text">{user.email}</p>
                                </div>
                                <p className="mb-0 fw-bold" style={{ marginTop: '10%', color: '#39639d' }}>
                                    {formatarData(user.dataRegisto)}
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-end align-items-end align-items-md-center h-100 mt-3 mt-md-0">
                            <p className="text-end grey-text w-100 w-md-auto">Viseu, Portugal</p>
                            <div className="d-flex justify-content-end align-items-center mt-2 mt-md-0">
                                <button className="btn w-100 w-md-25" style={{ backgroundColor: '#39639d', color: 'white', cursor: 'pointer' }} onClick={() => setEditProfileModalOpen(true)}>
                                    Editar Perfil
                                </button>
                                {isEditProfileModalOpen && (
                                    <div className="modal fade show " style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                    style={{ background: "linear-gradient(90deg, #39639D, #1C4072)" }}
                                                >
                                                    <h5 className="fw-bold">Editar Perfil</h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                    <form onSubmit={handleEditProfile}>
                                                        <h5 className="fw-bold fs-3 ms-4 text-start" style={{ color: '#39639D' }}>Perfil</h5>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>
                                                                Nova imagem de perfil
                                                            </label>
                                                            <input
                                                                type="file"
                                                                className="form-control text-dark"
                                                                name="imagem-perfil"
                                                                accept="image/png, image/jpeg, image/jpg"
                                                                onChange={e => setImagemPerfil(e.target.files[0])}
                                                            />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Password atual</label>
                                                            <input
                                                                type="password"
                                                                className="form-control text-dark"
                                                                name="current_password"
                                                                value={currentPassword}
                                                                onChange={e => setCurrentPassword(e.target.value)}
                                                                minLength={6}
                                                            />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Nova palavra-passe</label>
                                                            <input
                                                                type="password"
                                                                className="form-control text-dark"
                                                                name="new_password"
                                                                value={novaPassword}
                                                                onChange={e => setNovaPassword(e.target.value)}
                                                                minLength={6}
                                                            />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-start" style={{ color: '#39639D' }}>Confirmação de palavra-passe</label>
                                                            <input
                                                                type="password"
                                                                className="form-control text-dark"
                                                                name="confirm_password"
                                                                value={confirmPassword}
                                                                onChange={e => setConfirmPassword(e.target.value)}
                                                                minLength={6}
                                                            />
                                                            <div className="modal-footer d-flex justify-content-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-light me-4"
                                                                    onClick={() => setEditProfileModalOpen(false)}
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary botao"
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {erro && (
                                                            <div className="alert alert-danger text-center" role="alert">
                                                                {erro}
                                                            </div>
                                                        )}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isEditProfileSuccessModalOpen && (
                                    <div className="modal fade show" style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "550px" }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src="/img/success_vector.svg" alt="Ícone de sucesso" />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Sucesso</h1>
                                                    </div>
                                                    <p className="text-center fs-5">O seu perfil foi editado com sucesso</p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao rounded"
                                                        onClick={closeEditProfileSuccessModal}
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
                    <div className="row mt-5 bg-translucent p-0">
                        <div className="col-md-12 barra p-0" />
                        <h5 className="fw-bold mt-4 blue-text">Percurso Formativo</h5>
                        <p className="grey-text">
                            Todas as informações disponíveis estão listadas abaixo
                        </p>
                        {cursos.length === 0 ? (
                            <div className="d-flex align-items-center justify-content-center text-center text-muted py-5 fw-bold" style={{ minHeight: 500 }}>
                                Ainda não está inscrito em nenhum curso.
                            </div>
                        ) : (
                            cursos.map((curso, idx) => (
                                <CursoCard
                                    key={curso.id || idx}
                                    id={curso.id}
                                    imagem={curso.imagemBanner || "/img/curso-kotlin.png"}
                                    nome={curso.nome}
                                    formador={curso.formador || "Desconhecido"}
                                    dataRegisto={formatarData(curso.dataRegisto)}
                                    dataTermino={formatarData(curso.dataTermino)}
                                    nota={curso.nota || "???"}
                                    concluido={curso.concluido || progressoCursos[curso.id] === 100} // Usa campo da inscrição ou progresso
                                    percentagem={progressoCursos[curso.id] || 0}
                                    onTransferirCertificado={() => handleTransferirCertificado(curso.inscricaoId)}
                                    inscricaoId={curso.inscricaoId}
                                    tipoCurso={curso.tipoCurso}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Perfil;