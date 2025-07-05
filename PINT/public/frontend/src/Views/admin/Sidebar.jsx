import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";
import logoSoftSkills from '../../assets/admin/img/logo_softskills.png';

const menuLinks = [
  { to: "/admin", icon: "fas fa-home", label: "Dashboard", exact: true },
  { to: "/admin/gerir-curso", icon: "fas fa-book", label: "Cursos" },
  { to: "/admin/gerir-utilizador", icon: "fas fa-users", label: "Utilizadores" },
  { to: "/admin/gerir-forum", icon: "fas fa-comments", label: "Gerir fóruns" },
  { to: "/admin/gerir-denuncia", icon: "fas fa-exclamation-circle", label: "Denúncias" },
  { to: "/admin/gerir-sugestao", icon: "fas fa-lightbulb", label: "Sugestões fóruns" },
];

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <div className="sidebar-header d-flex align-items-center justify-content-center">
        <img src={logoSoftSkills} alt="Logo SoftSkills" />
      </div>
      <div className="menu-container py-2 font-size-20">
        <ul className="list-unstyled m-0">
          {menuLinks.map(link => (
            <li
              key={link.to}
              className={`d-flex align-items-center fw-semibold fs-6 ${isActive(link.to, link.exact) ? 'active' : ''}`}
            >
              <Link
                to={link.to}
                className="text-decoration-none text-white w-100 d-flex align-items-center"
                aria-current={isActive(link.to, link.exact) ? "page" : undefined}
              >
                <i className={`${link.icon} me-2`} /> {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;