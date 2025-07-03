import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"
import profilePic from '../../assets/admin/img/profile_pic.png'; 

function PerfilAdmin () {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const handleLogout = () => {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    };

    return (
      

    <div className="header rounded p-3 mx-5">
      <div className="user-info d-flex align-items-center">

        <img
          src={user.imagemPerfil || profilePic} 
          className="me-3"
          alt="Foto de perfil"
        />

        <span className="fw-bold fs-5">Olá, {user.nomeUtilizador} 👋</span>
      </div>

      <button className="btn btn-leave btn-sm" onClick={handleLogout}>Sair</button>
    </div>
  );

}

export default PerfilAdmin;