import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Views/login';
import SignUp from './Views/signUp';
import MainView from './Views/index';
import PaginaInicial from './Views/paginaInicial';
import Perfil from './Views/perfil';
import Categorias from './Views/categorias';
import Foruns from './Views/foruns';
import Navbar from "./Views/navbar";
import Footer from "./Views/footer";
import Curso from "./Views/curso";
import VerAula from "./Views/verAula";
import CursoSincrono from "./Views/cursoSincrono";
import AuthService from "./Views/auth.service";
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';




  function App() {

    const NavbarLayout = ({ children }) => {
      return (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      );
    };



    return (
      <>
        <Routes>
          <Route path="/" element={<NavbarLayout><MainView /></NavbarLayout>} />
          <Route path="/paginaInicial" element={<NavbarLayout><PaginaInicial /></NavbarLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/perfil" element={<NavbarLayout><Perfil /></NavbarLayout>} />
          <Route path="/categorias" element={<NavbarLayout><Categorias /></NavbarLayout>} />
          <Route path="/foruns" element={<NavbarLayout><Foruns /></NavbarLayout>} />
          <Route path="/curso/:id" element={<NavbarLayout><Curso /></NavbarLayout>} />
          <Route path="/verAula/:aulaId" element={<NavbarLayout><VerAula /></NavbarLayout>} />
          <Route path="/cursoSincrono/:id" element={<NavbarLayout><CursoSincrono /></NavbarLayout>} />
        </Routes>
      </>
    );
  }

  export default App;