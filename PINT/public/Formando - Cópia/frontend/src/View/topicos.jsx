import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Topicos = () => {
    const navigate = useNavigate();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [cursos, setCursos] = useState([]);

    function handleSugestTopic() {
        console.log("A sugerir tópico...");
        // Aqui você faria a chamada para sua função real de sugerir

        // Fechar o modal de edição e abrir o modal de sucesso
        setEditModalOpen(false);
        setSuccessModalOpen(true);
    }

    function closeSuccessModal() {
        setSuccessModalOpen(false);
    }



    useEffect(() => {
        fetch("http://localhost:3000/curso/list")
            .then(res => res.json())
            .then(data => {
                if (data.success) setCursos(data.data);
            })
            .catch(err => {
                console.error("Erro ao buscar cursos:", err);
            });
    }, []);


    return (
        <div>
            <div className="row container-fluid min-vh-100 m-0 p-0 ">
                <div className="row default-container d-flex  align-items-center  mb-4 ">
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <h2 className="container-fluid mb-0 blue-text fw-bold ">Descobre ideias que fazem a diferença </h2>
                            <h3 className="container-fluid mb-5 grey-text ">Área de tópicos</h3>
                        </div>
                        <div className="col-md-6 d-flex align-items-start">
                            <div className="col-md-4" />
                            <div className="col-md-4 d-flex justify-content-start">
                                <p className=" blue-text">Procuras algo específico e não encontras? Sugere!</p>
                            </div>
                            <div className="col-md-4 d-flex justify-content-sm-center justify-content-md-start">
                                <button
                                    className="btn btn-primary botao rounded-pill"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setEditModalOpen(true)}
                                >
                                    Sugerir tópico
                                </button>
                                {/* MODAL DE EDIÇÃO */}
                                {isEditModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div
                                                    className="modal-header text-white py-5 position-relative d-flex justify-content-center"
                                                    style={{
                                                        background: "linear-gradient(90deg, #39639D, #1C4072)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold">Sugerir Tópico</h5>
                                                </div>
                                                <div className="modal-body" style={{ color: "#f5f9ff" }}>
                                                    <form>
                                                        <h5
                                                            className="fw-bold fs-3 ms-4 text-start"
                                                            style={{ color: "#39639D" }}
                                                        >
                                                            Novo Tópico
                                                        </h5>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Título
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control text-muted"
                                                                placeholder="JavaScript"
                                                            />
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Categoria
                                                            </label>
                                                            <select className="form-select w-50 text-muted">
                                                                <option selected>Web Development</option>
                                                                <option>Mobile</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-3 ms-4 text-start">
                                                            <label
                                                                className="form-label fw-semibold fs-6 text-start"
                                                                style={{ color: "#39639D" }}
                                                            >
                                                                Área
                                                            </label>
                                                            <select className="form-select w-50 text-muted">
                                                                <option selected>FrontEnd</option>
                                                                <option>BackEnd</option>
                                                            </select>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer d-flex justify-content-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light me-4"
                                                        onClick={() => setEditModalOpen(false)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao"
                                                        onClick={handleSugestTopic}
                                                    >
                                                        Sugerir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* MODAL DE SUCESSO */}
                                {isSuccessModalOpen && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: "block", background: "rgba(57, 99, 157, 0.5)" }}
                                    >
                                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 550 }}>
                                            <div className="modal-content">
                                                <div className="modal-body py-4">
                                                    <div className="d-flex flex-column align-items-center mb-3">
                                                        <img
                                                            src="/img/success_vector.svg"
                                                            alt="Ícone de sucesso"
                                                        />
                                                        <h1 className="text-center fs-2 fw-bold mt-3">Sucesso</h1>
                                                    </div>
                                                    <p className="text-center fs-5">
                                                        O seu Tópico foi sugerido com sucesso!
                                                    </p>
                                                </div>
                                                <div className="modal-footer justify-content-center py-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary botao rounded"
                                                        onClick={closeSuccessModal}
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
                    <div className="row d-flex justify-content-evenly gap-5" style={{ width: '95%' }}>
                        {cursos.map((curso) => (
                            <div key={curso.id} className="row card col-md-4 bg-transparent border-0 shadow-lg p-0" style={{ width: '18rem' }}>
                                <Link className="p-0" to={`/curso`} style={{ textDecoration: 'none' }}>
                                    <div className="p-0">
                                        <img src="/img/CursoPython.png" style={{ width: '100%' }} alt={curso.nome} />
                                    </div>
                                </Link>
                                <div className="card-body blue-text">
                                    <h3 className="card-title fw-bold">{curso.nome}</h3>
                                    <p className="card-text">{curso.descricaoCurso}</p>
                                    <p className="card-text d-flex justify-content-end mt-5">
                                        ({curso.participantes || 0} participantes)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className=" text-light text-center py-3 " style={{ backgroundColor: '#40659d' }}>
                © 2025 Meu Site. Todos os direitos reservados.
            </footer>
        </div>
    );
};


export default Topicos;