import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CursoSincrono = () => {
    const navigate = useNavigate();
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
    const [isSignUpSucessModalOpen, setSignUpSucessModalOpen] = useState(false);

    function handleSugestTopic() {
        console.log("A sugerir tópico...");
        // Aqui você faria a chamada para sua função real de sugerir

        // Fechar o modal de edição e abrir o modal de sucesso
        setSignUpModalOpen(false);
        setSignUpSucessModalOpen(true);
    }

    function closeSignUpSucessModal() {
        setSignUpSucessModalOpen(false);
    }


    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                style={{ height: "350px", backgroundImage: "url('/img/Banner-MariaDB.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }}>
                </div>
                <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="fw-bold fs-2" style={{ color: "white" }}>MariaDB Base de Dados - Curso Avançado</div>
                    <div style={{ color: "white" }}>Torna-te um expert em MariaDB com apenas um curso.</div>
                </div>
            </div>

            <div className="default-container row mb-3">
                <div className="col-6 p-0 m-0 ms-5 shadow-lg ">
                    <div className=" d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className=" text-white fw-bold m-0 ms-2">Avisos Gerais</h5>
                    </div>
                    <div className="container-fluid " style={{ maxHeight: 335, overflowY: 'auto' }}>
                        <div className="row ms-2 me-2 mb-2">
                            <p className=" col-6 fw-bold blue-text mt-3">Marcação de aula</p>
                            <p className="col-12">Venho por este meio informar que a 1ª aula do curso será lecionada no dia 01/03/2025 de forma online através do ZOOM. O link será afixado num futuro aviso.</p>
                            <p className=" col-12 mb-3 grey-text">18/03/2025 - 14:15</p>
                            <div className="border border-secondary d-flex justify-content-center"></div>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <p className=" col-6 fw-bold blue-text mt-3">Marcação de aula</p>
                            <p className="col-12">Venho por este meio informar que a 1ª aula do curso será lecionada no dia 01/03/2025 de forma online através do ZOOM. O link será afixado num futuro aviso.</p>
                            <p className=" col-12 mb-3 grey-text">18/03/2025 - 14:15</p>
                            <div className="border border-secondary d-flex justify-content-center"></div>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <p className=" col-6 fw-bold blue-text mt-3">Marcação de aula</p>
                            <p className="col-12">Venho por este meio informar que a 1ª aula do curso será lecionada no dia 01/03/2025 de forma online através do ZOOM. O link será afixado num futuro aviso.</p>
                            <p className=" col-12 mb-3 grey-text">18/03/2025 - 14:15</p>
                            <div className="border border-secondary d-flex justify-content-center"></div>
                        </div>
                    </div>
                </div>
                <div className="col-2"></div>
                <div className="col-2 card m-0 p-0 ms-3 shadow-lg">
                    <img src="/img/professor.png" alt="" />
                    <div  className="card-body">
                        <p className="card-tittle blue-text">Lecionado por: </p>
                        <p className="card-tittle blue-text  d-flex justify-content-center fw-bold mb-0">Prof.</p>
                        <h5 className="card-text blue-text fw-bold d-flex justify-content-center">Marco Roberto</h5>
                    </div>
                  
                </div>
            </div>



            <div className="default-container row mb-3">
                <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                    <div className=" d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className=" text-white fw-bold m-0 ms-2">Entrega de Trabalhos de Avaliação</h5>
                    </div>
                    <div className="container-fluid " style={{ maxHeight: 325, overflowY: 'auto' }}>
                        <div className="row ms-2 me-2 mb-2">
                            <div className="row col-12 justify-content-between">
                                <p className="col-6 fw-bold blue-text mt-3">Entrega do 1º trabalho de avaliação</p>
                                <div className="col-1 rounded-pill mt-2 mb-2  d-flex justify-content-center align-items-center" style={{ backgroundColor: "#efeeee" }}>
                                    <p className="blue-text fw-bold m-0">18/20</p>
                                </div>
                            </div>
                            <p className="col-12">Resolução do trabalho 1. O documento deve ser entregue em formato .pdf</p>
                            <p className="mb-3 grey-text col-12">Data limite - 21/03/2025</p>
                            <button className="col-3 btn btn-primary rounded-pill mb-3">Entregar Documento</button>
                            <div className="col-3 mt-2 ms-5">
                                <p className="text-success">Entregue</p>
                            </div>
                            <div className="border border-secondary"></div>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <div className="row col-12 justify-content-between">
                                <p className="col-6 fw-bold blue-text mt-3">Entrega do 1º trabalho de avaliação</p>
                                <div className="col-1 rounded-pill mt-2 mb-2  d-flex justify-content-center align-items-center" style={{ backgroundColor: "#efeeee" }}>
                                    <p className="blue-text fw-bold m-0">??/20</p>
                                </div>
                            </div>
                            <p className="col-12">Resolução do trabalho 1. O documento deve ser entregue em formato .pdf</p>
                            <p className="mb-3 grey-text col-12">Data limite - 21/03/2025</p>
                            <button className="col-3 btn btn-primary rounded-pill mb-3">Entregar Documento</button>
                            <div className="col-3 mt-2 ms-5">
                                <p className="text-danger">Não Entregue</p>
                            </div>
                            <div className="border border-secondary"></div>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <div className="row col-12 justify-content-between">
                                <p className="col-6 fw-bold blue-text mt-3">Entrega do 1º trabalho de avaliação</p>
                                <div className="col-1 rounded-pill mt-2 mb-2  d-flex justify-content-center align-items-center" style={{ backgroundColor: "#efeeee" }}>
                                    <p className="blue-text fw-bold m-0">??/20</p>
                                </div>
                            </div>
                            <p className="col-12">Resolução do trabalho 1. O documento deve ser entregue em formato .pdf</p>
                            <p className="mb-3 grey-text col-12">Data limite - 21/03/2025</p>
                            <button className="col-3 btn btn-primary rounded-pill mb-3">Entregar Documento</button>
                            <div className="col-3 mt-2 ms-5">
                                <p className="text-danger">Não Entregue</p>
                            </div>
                            <div className="border border-secondary"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="default-container row mb-3">
                <div className="default-container col-6 p-0 m-0 ms-5 shadow-lg">
                    <div className=" d-flex align-items-center rounded-top-3 m-0" style={{ backgroundColor: "#406cac", height: "40px" }}>
                        <h5 className=" text-white fw-bold m-0 ms-2">Documentos</h5>
                    </div>
                    <div className="container-fluid " style={{ maxHeight: 400, overflowY: 'auto' }}>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                        <div className="row ms-2 me-2 mb-2">
                            <Link className="col-12 row align-items-center mt-4 m-2">
                                <img className="col-1" style={{ height: "20px", width: "40px" }} src="/img/icon-documento.png" alt="" />
                                <p className="col-11 m-0 p-0 " style={{ height: "20px", width: "40px" }}>documento.pdf</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <footer className=" text-light text-center py-3" style={{ backgroundColor: '#40659d' }}>
                © 2025 Meu Site. Todos os direitos reservados.
            </footer>
        </div>

    );
};

export default CursoSincrono;