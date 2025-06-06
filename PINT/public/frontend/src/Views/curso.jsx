import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Curso = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // SEMPRE declare todos os hooks no topo!
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
    const [isSignUpSucessModalOpen, setSignUpSucessModalOpen] = useState(false);
    const [aulas, setAulas] = useState([]);
    const [curso, setCurso] = useState({});
    const [inscrito, setInscrito] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get("http://localhost:3000/aula-assincrona/list")
            .then(res => {
                if (res.data.success) setAulas(res.data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar aulas:", err);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3000/curso/get/${id}`)
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
        axios.get("http://localhost:3000/inscricao/list")
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
            alert("É necessário estar autenticado para se inscrever.");
            navigate("/login");
            return;
        }

        axios.post("http://localhost:3000/inscricao/create", {
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
                    alert(res.data.message || "Erro ao inscrever.");
                }
            })
            .catch(() => {
                alert("Erro ao inscrever.");
            });
    }

    function handleSugestTopic() {
        setSignUpModalOpen(false);
        setSignUpSucessModalOpen(true);
    }

    function closeSignUpSucessModal() {
        setSignUpSucessModalOpen(false);
    }

    if (!curso || !curso.nome) return <div>Carregando...</div>;





    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                style={{ height: "350px", backgroundImage: "url('/img/curso-java.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }}></div>
                <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="fw-bold fs-2" style={{ color: "white" }}>{curso.nome}</div>
                    <div style={{ color: "white" }}>{curso.descricaoCurso}</div>
                </div>
            </div>
            <div className="row container2 mt-5">
                <div className="row mb-2">
                    <div className="col-md-6 row">
                        <h2 className=" mb-0 blue-text fw-bold ">Bem-vindo! 👋</h2>
                        <p className="col-6 mb-5 blue-text ">Realize a sua inscrição para conseguir aceder a todo o conteúdo de forma gratuita!</p>
                        <p className=" mb-5 blue-text ">Mais de <strong>20 vídeos</strong> com documentos de ajuda e totalmente em Português.</p>
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
                                    className={`btn rounded-pill w-100 ${inscrito ? "btn-secondary" : "btn-primary botao"}`}
                                    style={{ cursor: inscrito ? "not-allowed" : "pointer" }}
                                    onClick={() => {
                                        if (!inscrito) setSignUpModalOpen(true);
                                    }}
                                    disabled={inscrito}
                                >
                                    {inscrito ? "Inscrito" : "Inscrever"}
                                </button>
                            </div>
                            {/* MODAL DE EDIÇÃO */} {isSignUpModalOpen && (
                                <div className="modal fade show" style={{
                                    display: "block", background:
                                        "rgba(57, 99, 157, 0.5)"
                                }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                style={{ background: "linear-gradient(90deg, #39639D, #1C4072)", }}>
                                                <h5 className="fw-bold">
                                                    Confirmar Inscrição
                                                </h5>
                                            </div>
                                            <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                <form>
                                                    <h5 className="fw-bold fs-3 ms-4 text-center" style={{
                                                        color: "#39639D"
                                                    }}>
                                                        Curso - JavaScript
                                                    </h5>
                                                    <div className="mb-3 ms-4 text-start">
                                                        <label className="form-label fw-semibold fs-6 text-center " style={{
                                                            color:
                                                                "#39639D"
                                                        }}>
                                                            Para confirmar a tua inscrição no curso <strong>{curso.nome}</strong> clica no botão abaixo
                                                        </label>
                                                    </div>

                                                </form>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button type="button" className="btn btn-primary botao" onClick={handleInscrever}>
                                                    Inscrever
                                                </button>
                                                <button type="button" className="btn btn-light me-4" onClick={() =>
                                                    setSignUpModalOpen(false)} > Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )} {/* MODAL DE SUCESSO */} {isSignUpSucessModalOpen && (
                                <div className="modal fade show" style={{
                                    display: "block", background:
                                        "rgba(57, 99, 157, 0.5)"
                                }}>
                                    <div className="modal-dialog modal-dialog-centered" style={{
                                        maxWidth:
                                            550
                                    }}>
                                        <div className="modal-content">
                                            <div className="modal-body py-4">
                                                <div className="d-flex flex-column align-items-center mb-3">
                                                    <img src="/img/success_vector.svg" alt="Ícone de sucesso" />
                                                    <h1 className="text-center fs-2 fw-bold mt-3">
                                                        Sucesso
                                                    </h1>
                                                </div>
                                                <p className="text-center fs-5">
                                                    Inscrição realizada com sucesso!
                                                </p>
                                            </div>
                                            <div className="modal-footer justify-content-center py-3">
                                                <button type="button" className="btn btn-primary botao rounded" onClick={closeSignUpSucessModal}>
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
                                className="container-fluid row mt-4 mb-4 p-0 ms-2"
                                key={aula.id || idx}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/verAula/${aula.id}`)}
                            >
                                <div className="col-md-3 d-flex align-items-center">
                                    <img
                                        className="rounded-4"
                                        src={aula.imagem || "/img/video-curso.png"}
                                        alt={aula.tituloAssincrona}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                                <div className="row col-md-9">
                                    <div className="col-md-6 position-relative">
                                        <h4 className="fw-bold" style={{ color: '#39639d' }}>
                                            {aula.tituloAssincrona}
                                        </h4>
                                        <p style={{ color: '#39639d' }}>
                                            {aula.descricaoAssincrona}
                                        </p>
                                        <div className="d-flex align-items-center position-absolute" style={{ bottom: 0 }}>
                                            <img className="me-2" src="/img/icon-laptop.png" alt="" />
                                            <p className="grey-text mb-0">
                                                {formatarData(aula.dataLancAssincrona) || "Duração não informada"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>



    );
};

export default Curso;