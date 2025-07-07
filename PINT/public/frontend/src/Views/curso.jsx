import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Curso = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [aulas, setAulas] = useState([]);
    const [curso, setCurso] = useState({});
    const [inscrito, setInscrito] = useState(false);
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
    const [fadeOutSignUpModal, setFadeOutSignUpModal] = useState(false);

    const [isSignUpSucessModalOpen, setSignUpSucessModalOpen] = useState(false);
    const [fadeOutSignUpSucessModal, setFadeOutSignUpSucessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [hoverInscrever, setHoverInscrever] = useState(false);
    const [isDesinscricaoAction, setIsDesinscricaoAction] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/aula-assincrona/list")
            .then(res => {
                if (res.data.success) setAulas(res.data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar aulas:", err);
            });
    }, []);

    useEffect(() => {
        axios.get(`https://pint-web-htw2.onrender.com/curso/get/${id}`)
            .then(res => {
                if (res.data.success) {
                    setCurso(res.data.data);
                    // Redireciona se for presencial (sincrono)
                    if (res.data.data.tipoCurso === "Presencial") {
                        navigate(`/cursoSincrono/${id}`);
                    }
                }
            });
    }, [id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!user) return;
        axios.get("https://pint-web-htw2.onrender.com/inscricao/list")
            .then(res => {
                if (res.data.success) {
                    const jaInscrito = res.data.data.some(
                        insc =>
                            insc.utilizadorId === user.id &&
                            insc.cursoId === Number(id)
                    );
                    setInscrito(jaInscrito);
                }
            });
    }, [user, id]);

    const aulasCurso = aulas.filter(aula => aula.cursoId === Number(id));

    function formatarData(dataISO) {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-PT");
    }

    function handleInscrever() {
        if (!user) {
            setErrorMsg("É necessário estar autenticado para se inscrever.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
                navigate("/login");
            }, 1800);
            return;
        }

        setIsDesinscricaoAction(false);

        axios.post("https://pint-web-htw2.onrender.com/inscricao/create", {
            utilizadorId: user.id,
            cursoId: Number(id)
        },
            {
                headers: {
                    Authorization: "Bearer " + user.token
                }
            })
            .then(res => {
                if (res.data.success) {
                    setSignUpModalOpen(false);
                    setSignUpSucessModalOpen(true);
                    setInscrito(true);
                } else {
                    setErrorMsg(res.data.message || "Erro ao inscrever.");
                    setShowErrorModal(true);
                }
            })
            .catch(() => {
                setErrorMsg("Erro ao inscrever.");
                setShowErrorModal(true);
            });
    }

    function handleSugestTopic() {
        setSignUpModalOpen(false);
        setSignUpSucessModalOpen(true);
    }

    function closeSignUpModal() {
        setFadeOutSignUpModal(true);
        setTimeout(() => {
            setSignUpModalOpen(false);
            setFadeOutSignUpModal(false);
        }, 250);
    }

    function closeSignUpSucessModal() {
        setFadeOutSignUpSucessModal(true);
        setTimeout(() => {
            setSignUpSucessModalOpen(false);
            setFadeOutSignUpSucessModal(false);
        }, 250);
    }

    function handleDesinscrever() {
        if (!user || !inscrito) return;

        setIsDesinscricaoAction(true);

        // Buscar o ID da inscrição
        axios.get("https://pint-web-htw2.onrender.com/inscricao/list")
            .then(res => {
                if (res.data.success) {
                    const inscricao = res.data.data.find(
                        insc =>
                            insc.utilizadorId === user.id &&
                            insc.cursoId === Number(id)
                    );

                    if (inscricao) {
                        // Apagar a inscrição
                        axios.delete(`https://pint-web-htw2.onrender.com/inscricao/delete/${inscricao.id}`, {
                            headers: {
                                Authorization: "Bearer " + user.token
                            }
                        })
                            .then(res => {
                                if (res.data.success) {
                                    setInscrito(false);
                                    setSignUpModalOpen(false);
                                    setSignUpSucessModalOpen(true);
                                } else {
                                    setErrorMsg("Erro ao cancelar inscrição. Tente novamente.");
                                    setShowErrorModal(true);
                                }
                            })
                            .catch(() => {
                                setErrorMsg("Erro ao cancelar inscrição. Tente novamente.");
                                setShowErrorModal(true);
                            });
                    }
                }
            })
            .catch(() => {
                setErrorMsg("Erro ao cancelar inscrição. Tente novamente.");
                setShowErrorModal(true);
            });
    }

    useEffect(() => {
        if (curso && curso.nome) {
            document.title = `${curso.nome} / SoftSkills`;
        } else {
            document.title = "Curso / SoftSkills";
        }
    }, [curso]);


    if (!curso || !curso.nome) return <div>Carregando...</div>;

    return (
        <>

            <div className="container-fluid min-vh-100 m-0 p-0">
                <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                    style={{ height: "350px", backgroundImage: `url('${curso.imagemBanner || "/img/curso-java.png"}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                    <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }}></div>
                    <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                        <div className="fw-bold fs-2" style={{ color: "white" }}>{curso.nome}</div>
                        <div style={{ color: "white" }}>{curso.descricaoCurso}</div>
                    </div>
                </div >
                <div className="row container2 mt-5">
                    <div className="row mb-2">
                        <div className="col-md-6 row">
                            <h2 className=" mb-0 blue-text fw-bold ">Bem-vindo! 👋</h2>
                            <p className="col-6 mb-5 blue-text ">Realize a sua inscrição para conseguir aceder a todo o conteúdo de forma gratuita!</p>
                        </div>
                        <div className="col-md-6 d-flex align-items-start justify-content-end">
                            <div className="col-md-4" />
                            <div className="col-4 row">
                                <div className="col-12 d-flex justify-content-center">
                                    <p className=" blue-text">
                                        Interessado?
                                        Inscreva-se!
                                    </p>
                                </div>
                                <div className="col-md-12 d-flex justify-content-center align-items-center">
                                    <button
                                        type="button"
                                        className={`btn rounded-pill w-100 ${inscrito ? "btn-danger" : "btn-primary botao"}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setSignUpModalOpen(true);
                                        }}
                                    >
                                        {inscrito ? "Desinscrever" : "Inscrever"}
                                    </button>
                                </div>
                                {/* MODAL DE INSCRIÇÃO */}
                                {isSignUpModalOpen && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-modal="true"
                                        role="dialog"
                                        style={{
                                            display: "block",
                                            background: "rgba(57, 99, 157, 0.5)"
                                        }}
                                        onClick={closeSignUpModal}
                                    >
                                        <div
                                            className={`modal-dialog modal-dialog-centered ${fadeOutSignUpModal ? "custom-fade-out" : "custom-fade-in"}`}
                                            style={{ maxWidth: 550 }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="modal-content">
                                                <div className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                    style={{ background: "linear-gradient(90deg, #39639D, #1C4072)" }}>
                                                    <h5 className="fw-bold">
                                                        {inscrito ? "Cancelar inscriçao" : "Confirmar Inscrição"}
                                                    </h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                    <form>
                                                        <h5 className="fw-bold fs-3 ms-4 text-center" style={{
                                                            color: "#39639D"
                                                        }}>
                                                            Curso - {curso.nome}
                                                        </h5>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label className="form-label fw-semibold fs-6 text-center " style={{
                                                                color: "#39639D"
                                                            }}>
                                                                {inscrito
                                                                    ? `Tem a certeza que deseja cancelar a sua inscrição no curso ${curso.nome}?`
                                                                    : `Para confirmar a tua inscrição no curso ${curso.nome} clica no botão abaixo`
                                                                }
                                                            </label>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light px-4 me-3"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setFadeOutSignUpModal(true);
                                                            setTimeout(() => {
                                                                setSignUpModalOpen(false);
                                                                setFadeOutSignUpModal(false);
                                                            }, 250);
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn px-4"
                                                        style={{
                                                            color: hoverInscrever ? (inscrito ? "#dc3545" : "#39639D") : "#fff",
                                                            backgroundColor: hoverInscrever ? "#fff" : (inscrito ? "#dc3545" : "#39639D"),
                                                            border: `1px solid ${inscrito ? "#dc3545" : "#39639D"}`,
                                                            borderRadius: 12,
                                                            transition: "background 0.2s, color 0.2s"
                                                        }}
                                                        onMouseEnter={() => setHoverInscrever(true)}
                                                        onMouseLeave={() => setHoverInscrever(false)}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            if (inscrito) {
                                                                handleDesinscrever();
                                                            } else {
                                                                handleInscrever();
                                                            }
                                                        }}
                                                    >
                                                        {inscrito ? "Desinscrever" : "Inscrever"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* MODAL DE SUCESSO */}
                                {isSignUpSucessModalOpen && (
                                    <div
                                        className="modal fade show"
                                        tabIndex={-1}
                                        aria-modal="true"
                                        role="dialog"
                                        style={{
                                            display: "block",
                                            background: "rgba(57, 99, 157, 0.5)"
                                        }}
                                        onClick={closeSignUpSucessModal}
                                    >
                                        <div
                                            className={`modal-dialog modal-dialog-centered ${fadeOutSignUpSucessModal ? "custom-fade-out" : "custom-fade-in"}`}
                                            style={{ maxWidth: 550 }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img src="/img/success_vector.svg" alt="Ícone de sucesso" style={{ width: 64, height: 64 }} />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                                            Sucesso
                                                        </h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        {isDesinscricaoAction ? "Desinscriçao realizada com sucesso!" : "Inscrição realizada com sucesso!"}
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao rounded"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setFadeOutSignUpSucessModal(true);
                                                            setTimeout(() => {
                                                                setSignUpSucessModalOpen(false);
                                                                setFadeOutSignUpSucessModal(false);
                                                            }, 250);
                                                        }}
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
                <div className="container2">
                    <div className="container-fluid row mt-3 bg-translucent scrollbar-translucent p-0 m-0 rounded-start-4 overflow-x-hidden overflow-y-auto mb-5" style={{ maxHeight: 600 }}>
                        {!inscrito ? (
                            <div className="w-100 text-center py-5">
                                <p className="fs-5 text-muted mb-0">
                                    Só os utilizadores inscritos podem aceder às aulas e conteúdos deste curso.
                                </p>
                            </div>
                        ) : aulasCurso.length === 0 ? (
                            <div className="w-100 text-center py-5">
                                <p className="fs-5 text-muted mb-0">Ainda não existem aulas disponíveis para este curso.</p>
                            </div>
                        ) : (
                            aulasCurso.slice(0, 4).map((aula, idx) => (
                                <div
                                    className="container-fluid row mt-4 mb-4 p-0 ms-2 align-items-stretch"
                                    key={aula.id || idx}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/verAula/${aula.id}`)}
                                >
                                    <div className="col-12 col-md-3 d-flex align-items-center mb-3 mb-md-0">
                                        <img
                                            className="rounded-4 w-100"
                                            src={aula.imagem || "/img/video-curso.png"}
                                            alt={aula.tituloAssincrona}
                                            style={{ objectFit: "cover", height: 140, minWidth: 0 }}
                                        />
                                    </div>
                                    <div className="col-12 col-md-9 d-flex flex-column justify-content-between" style={{ minWidth: 0 }}>
                                        <h4 className="fw-bold" style={{
                                            color: '#39639d',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {aula.tituloAssincrona}
                                        </h4>
                                        <p style={{
                                            color: '#39639d',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {aula.descricaoAssincrona}
                                        </p>
                                        <div className="d-flex align-items-center mt-auto">
                                            <img className="me-2" src="/img/icon-laptop.png" alt="" />
                                            <p className="grey-text mb-0">
                                                {formatarData(aula.dataLancAssincrona) || "Duração não informada"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* MODAL DE ERRO */}
                {showErrorModal && (
                    <div
                        className="modal fade show"
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                        style={{
                            display: "block",
                            background: "rgba(57, 99, 157, 0.5)"
                        }}
                        onClick={() => setShowErrorModal(false)}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered custom-fade-in"
                            style={{ maxWidth: 550 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-body py-4">
                                    <div className="d-flex flex-column align-items-center mb-3">
                                        <img src="/img/warning_vector.svg" alt="Ícone de Erro" style={{ width: 64, height: 64 }} />
                                        <h1 className="text-center fs-2 fw-bold mt-3">
                                            Erro
                                        </h1>
                                    </div>
                                    <p className="text-center fs-5">
                                        {errorMsg}
                                    </p>
                                </div>
                                <div className="modal-footer justify-content-center py-3">
                                    <button
                                        type="button"
                                        className="btn btn-voltar px-4"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowErrorModal(false);
                                        }}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </>
    );
};

export default Curso;