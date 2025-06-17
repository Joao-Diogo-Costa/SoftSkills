import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"

import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';


function HomePageAdmin() {

  const [estatisticas, setEstatisticas] = useState({
    totalAlunos: 0,
    totalCursos: 0,
    totalFormadores: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/estatistica/list')
      .then(response => {
        setEstatisticas(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar estatísticas:', error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin / SoftSkills</title>
      </Helmet>

      <AdminSidebar />

      <div className="content flex-grow-1 p-4">

        <PerfilAdmin />


        <div className="stats-panel d-flex justify-content-center mt-3">
          {/* Centro */}
          <div
            className="stats-card p-4 rounded shadow-sm text-center w-100"
            style={{ border: "0.5px solid #ccc" }}
          >
            <div className="stat">
              <h3>Total de alunos</h3>
              <p className="fs-1 fw-bold">{estatisticas.totalAlunos}</p>
            </div>
            <div className="stat">
              <h3>Total de cursos</h3>
              <p className="fs-1 fw-bold">{estatisticas.totalCursos}</p>
            </div>
            <div className="stat">
              <h3>Total de formadores</h3>
              <p className="fs-1 fw-bold">{estatisticas.totalFormadores}</p>
            </div>
          </div>
        </div>
      </div>

    </>

  );


}

export default HomePageAdmin;

  
  

  