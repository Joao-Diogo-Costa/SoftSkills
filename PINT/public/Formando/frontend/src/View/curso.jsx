import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Curso = () => {
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


    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/aula-assincrona/list") // ajuste o endpoint conforme o seu backend
            .then(res => res.json())
            .then(data => {
                if (data.success) setAulas(data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar aulas:", err);
            });
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="container-fluid row m-0 p-0 d-flex justify-content-center align-items-center position-relative"
                style={{ height: "350px", backgroundImage: "url('/img/curso-java.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1 }}></div>
                <div className="col-md-6 row d-flex justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="fw-bold fs-2" style={{ color: "white" }}>JavaScript - Curso Avançado</div>
                    <div style={{ color: "white" }}>Torna-te um expert em JavaScript com apenas um curso.</div>
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
                                <button className="btn btn-primary botao rounded-pill w-100" style={{ cursor: "pointer" }} onClick={() => setSignUpModalOpen(true)} > Inscrever</button>
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
                                                            Para confirmar a tua inscrição no curso - nome - clica no botão abaixo
                                                        </label>
                                                    </div>

                                                </form>
                                            </div>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <button type="button" className="btn btn-primary botao" onClick={handleSugestTopic}>
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
                <div className="container-fluid row mt-5 bg-translucent p-0 m-0 rounded-start-4 overflow-x-hidden" style={{ maxHeight: 600, overflowY: 'auto' }}>
                    {aulas.slice(0, 4).map((aula, idx) => (
                        <div className="container-fluid row mt-5 p-0 ms-2" key={aula.id || idx}>
                            <div className="col-md-3 d-flex align-items-center">
                                <img
                                    className="rounded-4"
                                    src={aula.imagem || "/img/video-curso.png"}
                                    alt={aula.titulo}
                                    onClick={() => navigate(`/verAula`)} // /${aula.id} <--adicionar quando estiver mesmo  funcionar
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
                                            {aula.dataLancAssincrona || "Duração não informada"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="text-light text-center py-3 mt-4" style={{ backgroundColor: '#40659d' }}>
                © 2025 SOFTINSA Todos os direitos reservados.
            </footer>
        </div>



    );
};

export default Curso;