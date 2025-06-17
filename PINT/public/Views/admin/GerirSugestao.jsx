import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from 'react-helmet';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/admin/css/style.css"

import AdminSidebar from './Sidebar';
import PerfilAdmin from './PerfilAdmin';

function GerirSugestao() {

    return (
        <>
            <Helmet>
                <title>Gerir Sugestão / SoftSkills</title>
            </Helmet>

            <AdminSidebar />

            <div className="content flex-grow-1 p-4">
                <PerfilAdmin />

                {/* Tabela */}
                <div className="container mt-4">
                    <div className="row d-flex justify-content-between">
                        <button className="btn btn-sm me-4 btn-filtro">
                            <i className="fa-solid fa-filter me-2" />
                            Filtros
                        </button>
                        <form
                            className="input-group d-flex mx-auto border border-opacity-50 rounded w-50 barra-pesquisa"
                            role="search"
                        >
                            <span className="input-group-text bg-transparent border-0">
                                <i className="fa-solid fa-magnifying-glass icon-lupa" />
                            </span>
                            <input
                                className="form-control no-outline bg-transparent border-0 shadow-none"
                                type="search"
                                placeholder="Procurar sugestão"
                                aria-label="Search"
                            />
                        </form>
                        <div className="col-12 mt-3">
                            <div
                                className="table-responsive mt-3"
                                style={{
                                    maxHeight: 755,
                                    overflowY: "auto",
                                    border: "1px solid #ccc"
                                }}
                            >
                                <table className="table table-hover tabela-users mb-0">
                                    <thead className="shadow-sm tabela-header">
                                        <tr>
                                            <th className="fw-semibold text-center fs-5">Sugestor</th>
                                            <th className="fw-semibold text-center fs-5">Data</th>
                                            <th className="fw-semibold text-center fs-5">Categoria</th>
                                            <th className="fw-semibold text-center fs-5">Área</th>
                                            <th className="fw-semibold text-center fs-5">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className=" justify-content-center align-items-center p-3 text-center align-middle">
                                                Marta Almeida
                                            </td>
                                            <td className="text-center align-middle">01/01/2025</td>
                                            <td className="text-center align-middle">Desenvolvimento</td>
                                            <td className="text-center align-middle">WEB</td>
                                            <td className="text-center align-middle">
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm me-4"
                                                    style={{
                                                        backgroundColor: "#39639D",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: 75
                                                    }}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );

}

export default GerirSugestao;