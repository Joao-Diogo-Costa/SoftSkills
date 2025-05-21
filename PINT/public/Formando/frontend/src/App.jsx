import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './View/login';
import MainView from './View/index';
import PaginaInicial from './View/paginaInicial';
import Perfil from './View/perfil';
import Categorias from './View/categorias';
import Navbar from "./View/navbar";
import Curso from "./View/curso";
import VerAula from "./View/verAula";
import CursoSincrono from "./View/cursoSincrono";
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {

  const NavbarLayout = ({ children }) => {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  };



  return (
    <>
      <Routes>
        <Route path="/" element={<NavbarLayout><MainView /></NavbarLayout>} />
        <Route path="/paginaInicial" element={<NavbarLayout><PaginaInicial /></NavbarLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<NavbarLayout><Perfil /></NavbarLayout>} />
        <Route path="/categorias" element={<NavbarLayout><Categorias /></NavbarLayout>} />
        <Route path="/curso" element={<NavbarLayout><Curso /></NavbarLayout>} />
        <Route path="/verAula" element={<NavbarLayout><VerAula /></NavbarLayout>} />
        <Route path="/cursoSincrono" element={<NavbarLayout><CursoSincrono/></NavbarLayout>} />
      </Routes>
    </>
  );
}

export default App;