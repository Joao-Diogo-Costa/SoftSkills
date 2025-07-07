import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "./auth.header";


const Navbar = () => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [hoveredCategoria, setHoveredCategoria] = useState(null);
    const [hoveredArea, setHoveredArea] = useState(null);

    const [dropdownOpenForum, setDropdownOpenForum] = useState(false);
    const [catDropdownOpenForum, setCatDropdownOpenForum] = useState(false);
    const [categoriasForum, setCategoriasForum] = useState([]);
    const [areasForum, setAreasForum] = useState([]);
    const [topicosForum, setTopicosForum] = useState([]);
    const [hoveredCategoriaForum, setHoveredCategoriaForum] = useState(null);
    const [hoveredAreaForum, setHoveredAreaForum] = useState(null);

    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);
    const [badgeSeen, setBadgeSeen] = useState(false);
    const [unseenIds, setUnseenIds] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState({ cursos: [], foruns: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeout = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/categoria/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setCategorias(res.data.data);
                }
            });
        axios.get("https://pint-web-htw2.onrender.com/area/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setAreas(res.data.data);
                }
            });
        axios.get("https://pint-web-htw2.onrender.com/topico-curso/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setTopicos(res.data.data);
                }
            });
    }, []);

    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/categoria/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setCategoriasForum(res.data.data);
                }
            });
        axios.get("https://pint-web-htw2.onrender.com/area/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setAreasForum(res.data.data);
                }
            });
        axios.get("https://pint-web-htw2.onrender.com/topico-curso/list")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setTopicosForum(res.data.data);
                }
            });
    }, []);

    // Carregar notificações e unseenIds do localStorage
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnseenIds([]);
            return;
        }
        axios.get("https://pint-web-htw2.onrender.com/notificacao/minhas", { headers: authHeader() })
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                    setNotifications(res.data.data);

                    // Carrega do localStorage os IDs já vistos
                    const seen = JSON.parse(localStorage.getItem("notificacoesVistas") || "[]");
                    // IDs das notificações recebidas que ainda não foram vistas
                    const unseen = res.data.data
                        .filter(n => !seen.includes(n.id))
                        .map(n => n.id);
                    setUnseenIds(unseen);
                } else {
                    setNotifications([]);
                    setUnseenIds([]);
                }
            })
            .catch(() => {
                setNotifications([]);
                setUnseenIds([]);
            });
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setDropdownOpen(false);
        navigate("/");
    };

    // Quando abres o menu de notificações, marca o badge como visto
    const handleOpenNotifications = (e) => {
        e.stopPropagation();
        setNotificationsOpen(!notificationsOpen);
    };

    // Função para pesquisar cursos e foruns
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (value.length < 2) {
            setShowDropdown(false);
            setSearchResults({ cursos: [], foruns: [] });
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            // Busca todos os cursos e foruns e filtra no frontend
            const [cursosRes, forunsRes] = await Promise.all([
                axios.get("https://pint-web-htw2.onrender.com/curso/list"),
                axios.get("https://pint-web-htw2.onrender.com/forum/list")
            ]);
            const cursos = (cursosRes.data.data || []).filter(c =>
                c.nome.toLowerCase().includes(value.toLowerCase())
            );
            const foruns = (forunsRes.data.data || []).filter(f =>
                f.nome.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults({ cursos, foruns });
            setShowDropdown(true);
        }, 300); // debounce 300ms
    };

    const handleDropdownClick = (path) => {
        setShowDropdown(false);
        setSearchTerm("");
        setSearchResults({ cursos: [], foruns: [] });
        navigate(path);
    };


    useEffect(() => {
        if (notifications.length > 0) setBadgeSeen(false);
    }, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Só marca como vistas, não fecha o dropdown de notificações
            if (notificationsOpen && unseenIds.length > 0) {
                const seen = JSON.parse(localStorage.getItem("notificacoesVistas") || "[]");
                const newSeen = Array.from(new Set([...seen, ...unseenIds]));
                localStorage.setItem("notificacoesVistas", JSON.stringify(newSeen));
                setUnseenIds([]);
            }
            if (dropdownOpen) {
                setDropdownOpen(false);
            }
            // REMOVE qualquer linha que faça: setNotificationsOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [notificationsOpen, dropdownOpen, unseenIds]);

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    function truncate(str, n) {
        if (!str) return "";
        return str.length > n ? str.slice(0, n) + "..." : str;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const pad = n => n.toString().padStart(2, "0");
        return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

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
                        <li
                            className="nav-item mx-auto mt-2 fs-5 fw-bold position-relative"
                            onMouseEnter={() => setCatDropdownOpen(true)}
                            onMouseLeave={() => {
                                setCatDropdownOpen(false);
                                setHoveredCategoria(null);
                                setHoveredArea(null);
                            }}
                            style={{ zIndex: 1050 }}
                        >
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D", cursor: "pointer" }}
                                to="/categorias"
                                onClick={() => {
                                    // Garante que o filtro é limpo ao clicar em Categorias
                                    navigate("/categorias");
                                }}
                            >
                                Categorias
                            </Link>
                            {catDropdownOpen && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        minWidth: "200px",
                                        zIndex: 2000,
                                        marginTop: "0px",
                                        boxShadow: "0 2px 8px rgba(57,99,157,0.15)",
                                        display: "flex"
                                    }}
                                >
                                    <div style={{ minWidth: 200 }}>
                                        {categorias.length === 0 ? (
                                            <span className="dropdown-item text-muted">Nenhuma categoria</span>
                                        ) : (
                                            categorias.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    className="dropdown-item position-relative"
                                                    to={`/categorias?categoria=${cat.id}`}
                                                    onMouseEnter={() => setHoveredCategoria(cat.id)}
                                                    onMouseLeave={() => setHoveredCategoria(null)}
                                                    onClick={() => {
                                                        setCatDropdownOpen(false);
                                                        setHoveredCategoria(null);
                                                        setHoveredArea(null);
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        maxWidth: 240,
                                                        minWidth: 180,
                                                        paddingRight: 20
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            flex: 1,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {cat.nome}
                                                    </span>
                                                    <span style={{ marginLeft: 8 }}>&#9654;</span>
                                                    {/* Submenu de áreas */}
                                                    {hoveredCategoria === cat.id && (
                                                        <div
                                                            className="dropdown-menu show"
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: "100%",
                                                                minWidth: "220px",
                                                                maxWidth: "300px",
                                                                zIndex: 2100,
                                                                marginLeft: "0px",
                                                                boxShadow: "0 2px 8px rgba(57,99,157,0.15)"
                                                            }}
                                                        >
                                                            {areas.filter(area => area.categoriaId === cat.id).length === 0 ? (
                                                                <span className="dropdown-item text-muted">Sem áreas</span>
                                                            ) : (
                                                                areas
                                                                    .filter(area => area.categoriaId === cat.id)
                                                                    .map(area => (
                                                                        <Link
                                                                            key={area.id}
                                                                            className="dropdown-item position-relative"
                                                                            to={`/categorias?area=${area.id}`}
                                                                            onMouseEnter={() => setHoveredArea(area.id)}
                                                                            onMouseLeave={() => setHoveredArea(null)}
                                                                            onClick={() => {
                                                                                setCatDropdownOpen(false);
                                                                                setHoveredCategoria(null);
                                                                                setHoveredArea(null);
                                                                            }}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                whiteSpace: "nowrap",
                                                                                textOverflow: "ellipsis",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                maxWidth: 240,
                                                                                minWidth: 180,
                                                                                paddingRight: 20
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    flex: 1,
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                }}
                                                                            >
                                                                                {area.nome}
                                                                            </span>
                                                                            <span style={{ marginLeft: 8 }}>&#9654;</span>
                                                                            {/* Submenu de tópicos */}
                                                                            {hoveredArea === area.id && (
                                                                                <div
                                                                                    className="dropdown-menu show"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        top: 0,
                                                                                        left: "100%",
                                                                                        minWidth: "220px",
                                                                                        maxWidth: "300px",
                                                                                        zIndex: 2200,
                                                                                        marginLeft: "0px",
                                                                                        boxShadow: "0 2px 8px rgba(57,99,157,0.15)"
                                                                                    }}
                                                                                >
                                                                                    {topicos.filter(top => top.areaId === area.id).length === 0 ? (
                                                                                        <span className="dropdown-item text-muted">Sem tópicos</span>
                                                                                    ) : (
                                                                                        topicos
                                                                                            .filter(top => top.areaId === area.id)
                                                                                            .map(top => (
                                                                                                <Link
                                                                                                    key={top.id}
                                                                                                    className="dropdown-item"
                                                                                                    to={`/categorias?topico=${top.id}`}
                                                                                                    onClick={() => {
                                                                                                        setCatDropdownOpen(false);
                                                                                                        setHoveredCategoria(null);
                                                                                                        setHoveredArea(null);
                                                                                                    }}
                                                                                                    style={{
                                                                                                        whiteSpace: "nowrap",
                                                                                                        overflow: "hidden",
                                                                                                        textOverflow: "ellipsis",
                                                                                                        maxWidth: 220,
                                                                                                        display: "block"
                                                                                                    }}
                                                                                                >
                                                                                                    {top.nomeTopico}
                                                                                                </Link>
                                                                                            ))
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </Link>
                                                                    ))
                                                            )}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li
                            className="nav-item mx-auto mt-2 fs-5 fw-bold position-relative"
                            onMouseEnter={() => setCatDropdownOpenForum(true)}
                            onMouseLeave={() => {
                                setCatDropdownOpenForum(false);
                                setHoveredCategoriaForum(null);
                                setHoveredAreaForum(null);
                            }}
                            style={{ zIndex: 1050 }}
                        >
                            <Link
                                className="nav-link blue-text underline-animation"
                                style={{ color: "#39639D" }}
                                to={"/foruns"}
                            >
                                Fóruns
                            </Link>
                            {catDropdownOpenForum && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        minWidth: "200px",
                                        zIndex: 2000,
                                        marginTop: "0px",
                                        boxShadow: "0 2px 8px rgba(57,99,157,0.15)",
                                        display: "flex"
                                    }}
                                >
                                    <div style={{ minWidth: 200 }}>
                                        {categorias.length === 0 ? (
                                            <span className="dropdown-item text-muted">Nenhuma categoria</span>
                                        ) : (
                                            categorias.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    className="dropdown-item position-relative"
                                                    to={`/foruns?categoria=${cat.id}`}
                                                    onMouseEnter={() => setHoveredCategoriaForum(cat.id)}
                                                    onMouseLeave={() => setHoveredCategoriaForum(null)}
                                                    onClick={() => {
                                                        setCatDropdownOpenForum(false);
                                                        setHoveredCategoriaForum(null);
                                                        setHoveredAreaForum(null);
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        maxWidth: 240,
                                                        minWidth: 180,
                                                        paddingRight: 20
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            flex: 1,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {cat.nome}
                                                    </span>
                                                    <span style={{ marginLeft: 8 }}>&#9654;</span>
                                                    {/* Submenu de áreas */}
                                                    {hoveredCategoriaForum === cat.id && (
                                                        <div
                                                            className="dropdown-menu show"
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: "100%",
                                                                minWidth: "220px",
                                                                maxWidth: "300px",
                                                                zIndex: 2100,
                                                                marginLeft: "0px",
                                                                boxShadow: "0 2px 8px rgba(57,99,157,0.15)"
                                                            }}
                                                        >
                                                            {areas.filter(area => area.categoriaId === cat.id).length === 0 ? (
                                                                <span className="dropdown-item text-muted">Sem áreas</span>
                                                            ) : (
                                                                areas
                                                                    .filter(area => area.categoriaId === cat.id)
                                                                    .map(area => (
                                                                        <Link
                                                                            key={area.id}
                                                                            className="dropdown-item position-relative"
                                                                            to={`/foruns?area=${area.id}`}
                                                                            onMouseEnter={() => setHoveredAreaForum(area.id)}
                                                                            onMouseLeave={() => setHoveredAreaForum(null)}
                                                                            onClick={() => {
                                                                                setCatDropdownOpenForum(false);
                                                                                setHoveredCategoriaForum(null);
                                                                                setHoveredAreaForum(null);
                                                                            }}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                whiteSpace: "nowrap",
                                                                                textOverflow: "ellipsis",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                maxWidth: 240,
                                                                                minWidth: 180,
                                                                                paddingRight: 20
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    flex: 1,
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                }}
                                                                            >
                                                                                {area.nome}
                                                                            </span>
                                                                            <span style={{ marginLeft: 8 }}>&#9654;</span>
                                                                            {/* Submenu de tópicos */}
                                                                            {hoveredAreaForum === area.id && (
                                                                                <div
                                                                                    className="dropdown-menu show"
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        top: 0,
                                                                                        left: "100%",
                                                                                        minWidth: "220px",
                                                                                        maxWidth: "300px",
                                                                                        zIndex: 2200,
                                                                                        marginLeft: "0px",
                                                                                        boxShadow: "0 2px 8px rgba(57,99,157,0.15)"
                                                                                    }}
                                                                                >
                                                                                    {topicos.filter(top => top.areaId === area.id).length === 0 ? (
                                                                                        <span className="dropdown-item text-muted">Sem tópicos</span>
                                                                                    ) : (
                                                                                        topicos
                                                                                            .filter(top => top.areaId === area.id)
                                                                                            .map(top => (
                                                                                                <Link
                                                                                                    key={top.id}
                                                                                                    className="dropdown-item"
                                                                                                    to={`/foruns?topico=${top.id}`}
                                                                                                    onClick={() => {
                                                                                                        setCatDropdownOpenForum(false);
                                                                                                        setHoveredCategoriaForum(null);
                                                                                                        setHoveredAreaForum(null);
                                                                                                    }}
                                                                                                    style={{
                                                                                                        whiteSpace: "nowrap",
                                                                                                        overflow: "hidden",
                                                                                                        textOverflow: "ellipsis",
                                                                                                        maxWidth: 220,
                                                                                                        display: "block"
                                                                                                    }}
                                                                                                >
                                                                                                    {top.nomeTopico}
                                                                                                </Link>
                                                                                            ))
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </Link>
                                                                    ))
                                                            )}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
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
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => { if (searchResults.cursos.length || searchResults.foruns.length) setShowDropdown(true); }}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                style={{ zIndex: 3001 }}
                            />
                            {/* Dropdown de sugestões */}
                            {showDropdown && (searchResults.cursos.length > 0 || searchResults.foruns.length > 0) && (
                                <div
                                    className="dropdown-menu show w-100 mt-0"
                                    style={{
                                        maxHeight: 300,
                                        overflowY: "auto",
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        zIndex: 3000
                                    }}
                                >
                                    {searchResults.cursos.length > 0 && (
                                        <>
                                            <div className="dropdown-header">Cursos</div>
                                            {searchResults.cursos.map(curso => (
                                                <div
                                                    key={curso.id}
                                                    className="dropdown-item"
                                                    style={{ cursor: "pointer" }}
                                                    onMouseDown={() => handleDropdownClick(`/curso/${curso.id}`)}
                                                >
                                                    <img
                                                        src={curso.imagemBanner || curso.imagem || "/img/CursoPython.png"}
                                                        alt={curso.nome}
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            marginRight: 10,
                                                            background: "#f0f0f0"
                                                        }}
                                                    />
                                                    <span>{curso.nome}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {searchResults.foruns.length > 0 && (
                                        <>
                                            <div className="dropdown-header">Fóruns</div>
                                            {searchResults.foruns.map(forum => (
                                                <div
                                                    key={forum.id}
                                                    className="dropdown-item"
                                                    style={{ cursor: "pointer" }}
                                                    onMouseDown={() => handleDropdownClick(`/forum/${forum.id}`)}
                                                >
                                                    <img
                                                        src={forum.imagemForum || "/img/CursoPython.png"}
                                                        alt={forum.nome}
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                            marginRight: 10,
                                                            background: "#f0f0f0"
                                                        }}
                                                    />
                                                    <span>{forum.nome}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {(searchResults.cursos.length === 0 && searchResults.foruns.length === 0) && (
                                        <div className="dropdown-item text-muted">Sem resultados</div>
                                    )}
                                </div>
                            )}
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
                                    {unseenIds.length > 0 && (
                                        <span
                                            className="badge bg-danger rounded-pill"
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: -10,
                                                fontSize: 12,
                                                minWidth: 20,
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 1100
                                            }}
                                        >
                                            {unseenIds.length}
                                        </span>
                                    )}
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
                                                onClick={handleOpenNotifications}

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
                                                {unseenIds.length > 0 && (
                                                    <span className="badge bg-danger rounded-pill ms-2" >
                                                        {unseenIds.length}
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
                                                                <div
                                                                    className="dropdown-item py-2"
                                                                    style={{ cursor: "pointer", background: expandedNotificationId === notification.id ? "#f5f9ff" : "transparent" }}
                                                                    onClick={() =>
                                                                        setExpandedNotificationId(
                                                                            expandedNotificationId === notification.id ? null : notification.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="me-3">
                                                                        </div>
                                                                        <div style={{ flex: 1 }}>
                                                                            <p className="mb-0 fw-bold" style={{ whiteSpace: "nowrap", overflow: "hidden", maxWidth: 220 }}>
                                                                                {expandedNotificationId === notification.id
                                                                                    ? notification.titulo
                                                                                    : truncate(notification.titulo, 40)}
                                                                            </p>
                                                                            <small className="text-muted">{formatDate(notification.dataEnvio)}</small>
                                                                            {expandedNotificationId === notification.id ? (
                                                                                <div
                                                                                    style={{
                                                                                        marginTop: 8,
                                                                                        background: "#fff",
                                                                                        border: "1px solid #e0e7ef",
                                                                                        borderRadius: 6,
                                                                                        padding: 12,
                                                                                        minWidth: 260,
                                                                                        width: "100%",
                                                                                        wordBreak: "break-word",
                                                                                        boxShadow: "0 2px 8px rgba(57,99,157,0.10)",
                                                                                        zIndex: 1102,
                                                                                        position: "relative",
                                                                                        cursor: "pointer" // mostra que é clicável
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        if (notification.cursoId) {
                                                                                            navigate(`/curso/${notification.cursoId}`);
                                                                                        }
                                                                                    }}
                                                                                    title="Ir para o curso"
                                                                                >
                                                                                    <div style={{ whiteSpace: "pre-line" }}>{notification.mensagem}</div>
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        color: "#39639D",
                                                                                        fontSize: 13,
                                                                                        whiteSpace: "nowrap",
                                                                                        overflowX: "hidden",
                                                                                        maxWidth: 220
                                                                                    }}
                                                                                >
                                                                                    {truncate(notification.mensagem, 50)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {index < unseenIds.length - 1 && (
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

export default Navbar;