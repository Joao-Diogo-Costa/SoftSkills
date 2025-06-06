import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CursoSincrono = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [curso, setCurso] = useState({});
    const [avisos, setAvisos] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [inscrito, setInscrito] = useState(false);
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
    const [isSignUpSucessModalOpen, setSignUpSucessModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get(`http://localhost:3000/curso/get/${id}`)
            .then(res => {
                if (res.data.success) setCurso(res.data.data);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:3000/aviso/curso/${id}`)
            .then(res => {
                if (res.data.success) setAvisos(res.data.data);
            });
        axios.get(`http://localhost:3000/tarefa/curso/${id}`)
            .then(res => {
                if (res.data.success) setTarefas(res.data.data);
            });
    }, [id]);

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

    function handleInscrever() {
        if (!user) {
            alert("É necessário estar autenticado para se inscrever.");
            navigate("/login");
            return;
        }
        axios.post("http://localhost:3000/inscricao/create", {
            utilizadorId: user.id,
            cursoId: Number(id)
        }, {
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

    function closeSignUpSucessModal() {
        setSignUpSucessModalOpen(false);
    }

    if (!curso || !curso.nome) return <div>Carregando...</div>;

    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                style={{
                    height: "350px",
                    backgroundImage: "url('/img/Banner-MariaDB.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }} />
                <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="fw-bold fs-2" style={{ color: "white" }}>{curso.nome}</div>
                    <div style={{ color: "white" }}>{curso.descricaoCurso}</div>
                </div>
            </div>

            <div className="row container2 mt-5">
                <div className="col-md-6">
                    <h2 className="mb-0 blue-text fw-bold">Bem-vindo! 👋</h2>
                    <p className="mb-5 blue-text">Realize a sua inscrição para conseguir aceder a todo o conteúdo de forma gratuita!</p>
                </div>
                <div className="col-md-6 d-flex align-items-start justify-content-end">
                    <div className="col-md-4" />
                    <div className="col-4 row">
                        <div className="col-12 d-flex justify-content-center">
                            <p className="blue-text">
                                Interessado? Inscreva-se!
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
                        {/* MODAL DE INSCRIÇÃO */}
                        {isSignUpModalOpen && (
                            <div className="modal fade show" style={{
                                display: "block", background:
                                    "rgba(57, 99, 157, 0.5)"
                            }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                            style={{ background: "linear-gradient(90deg, #39639D, #1C4072)" }}>
                                            <h5 className="fw-bold">
                                                Confirmar Inscrição
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
                        )}
                        {/* MODAL DE SUCESSO */}
                        {isSignUpSucessModalOpen && (
                            <div className="modal fade show" style={{
                                display: "block", background:
                                    "rgba(57, 99, 157, 0.5)"
                            }}>
                                <div className="modal-dialog modal-dialog-centered" style={{
                                    maxWidth: 550
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

            {/* AVISOS */}
            <div className="default-container row mb-3 justify-content-center">
                <div className="col-6 p-0 m-0 ms-5 shadow-lg ">
                    <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className="text-white fw-bold m-0 ms-2">Avisos Gerais</h5>
                    </div>
                    <div className="container-fluid" style={{ maxHeight: 335, overflowY: 'auto' }}>
                        {avisos.length === 0 ? (
                            <div className="text-center text-muted py-4">Sem avisos para este curso.</div>
                        ) : (
                            avisos.map((aviso, idx) => (
                                <div className="row ms-2 me-2 mb-2" key={aviso.id || idx}>
                                    <p className="col-6 fw-bold blue-text mt-3">{aviso.titulo}</p>
                                    <p className="col-12">{aviso.descricao}</p>
                                    <p className="col-12 mb-3 grey-text">{new Date(aviso.dataPublicacao).toLocaleString("pt-PT")}</p>
                                    <div className="border border-secondary d-flex justify-content-center"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="col-1"></div>
                <div className="col-2 card m-0 p-0 ms-3 shadow-lg">
                    <img src="/img/professor.png" alt="" />
                    <div className="card-body">
                        <p className="card-tittle blue-text">Lecionado por: </p>
                        <p className="card-tittle blue-text  d-flex justify-content-center fw-bold mb-0">Prof.</p>
                        <h5 className="card-text blue-text fw-bold d-flex justify-content-center">
                            {curso.formador?.nomeUtilizador || "Desconhecido"}
                        </h5>                    </div>
                </div>
            </div>

            {/* TAREFAS */}
            <div className="default-container row mb-3 justify-content-center">
                <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                    <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className="text-white fw-bold m-0 ms-2">Entrega de Trabalhos de Avaliação</h5>
                    </div>
                    <div className="container-fluid" style={{ maxHeight: 325, overflowY: 'auto' }}>
                        {!inscrito ? (
                            <div className="text-center text-muted py-4">
                                Só os utilizadores inscritos podem aceder às tarefas deste curso.
                            </div>
                        ) : tarefas.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                Ainda não existem tarefas disponíveis para este curso.
                            </div>
                        ) : (
                            tarefas.map((tarefa, idx) => (
                                <div className="row ms-2 me-2 mb-2" key={tarefa.id || idx}>
                                    <div className="row col-12 justify-content-between">
                                        <p className="col-6 fw-bold blue-text mt-3">{tarefa.titulo}</p>
                                        <div className="col-1 rounded-pill mt-2 mb-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#efeeee" }}>
                                            <p className="blue-text fw-bold m-0">{tarefa.nota || "??"}/20</p>
                                        </div>
                                    </div>
                                    <p className="col-12">{tarefa.descricao}</p>
                                    <p className="mb-3 grey-text col-12">Data limite - {new Date(tarefa.dataLimite).toLocaleDateString("pt-PT")}</p>
                                    <button className="col-3 btn btn-primary rounded-pill mb-3">Entregar Documento</button>
                                    <div className="col-3 mt-2 ms-5">
                                        {/* Aqui podes mostrar estado de entrega se tiveres essa info */}
                                    </div>
                                    <div className="border border-secondary"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="col-3 ms-3"></div>
            </div>

            {/* Conteudos (exemplo estático, adapta conforme necessário) */}
            <div className="default-container row mb-3 justify-content-center">
                <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                    <div className="d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className="text-white fw-bold m-0 ms-2">Conteúdo</h5>
                    </div>
                    <div className="container-fluid" style={{ maxHeight: 400, overflowY: 'auto' }}>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0" style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        {/* Adiciona mais documentos conforme necessário */}
                    </div>
                </div>
                <div className="col-3 ms-3"></div>
            </div>
        </div>
    );
};

export default CursoSincrono;