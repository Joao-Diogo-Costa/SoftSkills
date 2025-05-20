import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-secondary shadow-lg">
            <div className="container-fluid">
                <Link className="navbar-brand me-0 ms-4" to={"/"}>
                    <img src="/img/Logo.png" alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
                        <li className="nav-item mx-auto mt-2 fs-5 fw-bold">
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D" }}
                                to={"/"}
                            >
                                Categorias
                            </Link>
                        </li>
                        <li className="nav-item mx-auto mt-2 mb-2 fs-5 fw-bold">
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D" }}
                                to={"/topicos"}
                            >
                                Tópicos
                            </Link>
                        </li>
                        <form
                            className="input-group d-flex mx-auto border border-secondary border-opacity-50 rounded-pill shadow w-50"
                            role="search"
                        >
                            <span className="input-group-text bg-transparent border-0">
                                <img src="/img/Icon-lupa.png" alt="Lupa" className="img-fluid" />
                            </span>
                            <input
                                className="form-control no-outline bg-transparent border-0"
                                type="search"
                                placeholder="Procurar"
                                aria-label="Search"
                            />
                        </form>
                        <Link
                            className="btn btn-primary mx-auto botao mt-2"
                            style={{ width: "15%" }}
                            to={"/login"}
                        >
                            Entrar
                        </Link>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;