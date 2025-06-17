import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css";
import logoSoftSkills from '../../assets/admin/img/logo_softskills.png';

function AdminSidebar() {
  const location = useLocation(); 

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header d-flex align-items-center justify-content-center">
        <img src={logoSoftSkills} alt="Logo SoftSkills" />
      </div>

      <div className="menu-container py-2 font-size-20">
        {/* Dashboard Link */}
        <div className="dashboard-container">
          <ul className="list-unstyled m-0">
            <li className={`d-flex align-items-center fw-semibold ${isActive('/admin') ? 'active' : ''}`}>
              <Link to="/admin" className="text-decoration-none text-white">
                <i className="fas fa-home" /> Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Other Admin Links */}
        <ul>
          <li className={`fs-6 fw-semibold ${isActive('/admin/gerir-curso') ? 'active' : ''}`}>
            <Link to="/admin/gerir-curso" className="text-decoration-none">
              <i className="fas fa-book" /> Gerir cursos
            </Link>
          </li>
          <li className={`fs-6 fw-semibold ${isActive('/admin/gerir-utilizador') ? 'active' : ''}`}>
            <Link to="/admin/gerir-utilizador" className="text-decoration-none">
              <i className="fas fa-users" /> Gerir utilizadores
            </Link>
          </li>
          <li className={`fs-6 fw-semibold ${isActive('/admin/gerir-forum') ? 'active' : ''}`}>
            <Link to="/admin/gerir-forum" className="text-decoration-none">
              <i className="fas fa-comments" /> Gerir fóruns
            </Link>
          </li>
          <li className={`fs-6 fw-semibold ${isActive('/admin/gerir-denuncia') ? 'active' : ''}`}>
            <Link to="/admin/gerir-denuncia" className="text-decoration-none">
              <i className="fas fa-exclamation-circle" /> Gerir denúncias
            </Link>
          </li>
          <li className={`fs-6 fw-semibold ${isActive('/admin/gerir-sugestao') ? 'active' : ''}`}>
            <Link to="/admin/gerir-sugestao" className="text-decoration-none">
              <i className="fas fa-lightbulb" /> Gerir sugestões fóruns
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;