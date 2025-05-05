import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './View/login';
import MainView from './View/index';
import PaginaInicial from './View/paginaInicial';
import Perfil from './View/perfil';
import Topicos from './View/topicos';
import Navbar from "./View/navbar";
import Curso from "./View/curso";
import VerAula from "./View/verAula";
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

  const NoNavbarLayout = ({ children }) => {
    return <>{children}</>;
  };



  return (
    <>
      <Routes>
        <Route path="/" element={<NavbarLayout><MainView /></NavbarLayout>} />
        <Route path="/paginaInicial" element={<NoNavbarLayout><PaginaInicial /></NoNavbarLayout>} />
        <Route path="/login" element={<NoNavbarLayout><Login /></NoNavbarLayout>} />
        <Route path="/perfil" element={<NoNavbarLayout><Perfil /></NoNavbarLayout>} />
        <Route path="/topicos" element={<NavbarLayout><Topicos /></NavbarLayout>} />
        <Route path="/curso" element={<NavbarLayout><Curso /></NavbarLayout>} />
        <Route path="/verAula" element={<NavbarLayout><VerAula /></NavbarLayout>} />
      </Routes>
    </>
  );
}

export default App;