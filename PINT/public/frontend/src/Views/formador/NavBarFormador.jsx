import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarFormador = () => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setDropdownOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsOpen) {
                setNotificationsOpen(false);
            }
            if (dropdownOpen) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [notificationsOpen, dropdownOpen]);

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom border-secondary shadow-lg">
            <div className="container-fluid">
                <span
                    className="navbar-brand me-0 ms-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        if (user) {
                            navigate("/paginaInicial");
                        } else {
                            navigate("/");
                        }
                    }}
                >
                    <img src="/img/Logo.png" alt="Logo" />
                </span>
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
                        <li className="nav-item mx-auto mt-2 fs-5 fw-bold position-relative">
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D", cursor: "pointer" }}
                                to="/curso-formador"
                                onClick={() => navigate("/curso-formador")}
                            >
                                Meus Cursos
                            </Link>
                        </li>
                        <li className="nav-item mx-auto mt-2 mb-2 fs-5 fw-bold">
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D" }}
                                to={"/foruns"}
                            >
                                Fóruns
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
                        {/* Troca entre botão Entrar e perfil do utilizador */}
                        {!user ? (
                            <Link
                                className="btn btn-primary mx-auto botao mt-2"
                                style={{ width: "15%" }}
                                to={"/login"}
                            >
                                Entrar
                            </Link>
                        ) : (
                            <div className="d-flex align-items-center mx-auto position-relative">
                                <img
                                    src={user.imagemPerfil || "/img/profile-picture.png"}
                                    alt="Avatar"
                                    className="rounded-circle me-2"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                <Link to={"/perfil"} className="text-decoration-none">
                                    <p className="fw-bold p-0 m-0">{user.nomeUtilizador}</p>
                                    <p className="small text-muted p-0 m-0">{user.email}</p>
                                </Link>
                                <button
                                    className="btn btn-link p-0 ms-4 border-0 bg-transparent"
                                    style={{ boxShadow: "none" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropdownOpen((open) => !open);
                                    }}
                                    tabIndex={0}
                                    aria-label="Abrir menu"
                                >
                                    <span
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: dropdownOpen ? "#bdcde3" : "#fff",
                                            boxShadow: "0 2px 8px rgba(57,99,157,0.15)",
                                            transition: "background 0.2s"
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#bdcde3")}
                                        onMouseLeave={e => (e.currentTarget.style.background = dropdownOpen ? "#bdcde3" : "#fff")}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            style={{
                                                display: "block",
                                                transition: "transform 0.2s",
                                                transform: dropdownOpen ? "rotate(0deg)" : "rotate(-90deg)"
                                            }}
                                        >
                                            <polyline points="4,6 8,10 12,6" fill="none" stroke="#39639D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                                {dropdownOpen && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            minWidth: "160px",
                                            zIndex: 1000,
                                            marginTop: "-4px"
                                        }}
                                    >

                                        <div className="position-relative">
                                            <button
                                                className="dropdown-item d-flex align-items-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNotificationsOpen(!notificationsOpen);
                                                }}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    className="me-2"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8 16c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2zm6-5v-5c0-3.07-1.63-5.64-4.5-6.32V0h-3v.68C3.64 1.36 2 3.92 2 7v5l-2 2v1h16v-1l-2-2zm-2 1H4v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                                                        fill="#39639D"
                                                    />
                                                </svg>
                                                Notificações
                                                {notifications.length > 0 && (
                                                    <span className="badge bg-danger rounded-pill ms-2">
                                                        {notifications.length}
                                                    </span>
                                                )}
                                            </button>

                                            {notificationsOpen && (
                                                <div
                                                    className="dropdown-menu show"
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        right: 0,
                                                        minWidth: "300px",
                                                        maxHeight: "400px",
                                                        overflowY: "auto",
                                                        zIndex: 1001,
                                                        marginTop: "0px",
                                                        boxShadow: "0 2px 8px rgba(57,99,157,0.15)"
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {notifications.length === 0 ? (
                                                        <div className="p-3 text-center text-muted">
                                                            Não há notificações
                                                        </div>
                                                    ) : (
                                                        notifications.map((notification, index) => (
                                                            <React.Fragment key={notification.id}>
                                                                <div className="dropdown-item py-2">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="me-3">
                                                                            <svg width="24" height="24" viewBox="0 0 16 16">
                                                                                <path
                                                                                    d="M8 16c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2z"
                                                                                    fill="#39639D"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <p className="mb-0">{notification.message}</p>
                                                                            <small className="text-muted">
                                                                                {notification.time}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {index < notifications.length - 1 && (
                                                                    <div className="dropdown-divider"></div>
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item"
                                            onClick={handleLogout}
                                        >
                                            Terminar Sessão
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarFormador;