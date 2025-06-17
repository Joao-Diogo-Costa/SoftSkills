import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"


import AdminSidebar from './Sidebar';

function CriarForum() {

    return (

        <>
            <Helmet>
                <title>Criar Fórum / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">
                <div className="container mt-4">
                    <h2 className="mb-4">Criar Fórum</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="forumName" className="form-label">Nome do Fórum</label>
                            <input type="text" className="form-control" id="forumName" placeholder="Digite o nome do fórum" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="forumDescription" className="form-label">Descrição</label>
                            <textarea className="form-control" id="forumDescription" rows="3" placeholder="Digite a descrição do fórum"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Criar Fórum</button>
                    </form>
                </div>
            </div>
        </>

    );
}

export default CriarForum;