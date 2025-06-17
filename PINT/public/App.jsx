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

// Admin
import AdminRoute from "./Views/admin/AdminRoute";
import HomePageAdmin from './Views/admin/HomePageAdmin';
import GerirCurso from './Views/admin/GerirCurso';
import GerirCursoDetalhe from './Views/admin/GerirCursoDetalhe';
import CriarCurso from './Views/admin/CriarCurso';
import GerirUtilizador from './Views/admin/GerirUtilizador';
import GerirForum from './Views/admin/GerirForum';
import GerirDenuncia from './Views/admin/GerirDenuncia';
import GerirSugestao from './Views/admin/GerirSugestao';


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

          {/* {Admin} */}
          <Route path="/admin" element={<AdminRoute><HomePageAdmin /></AdminRoute>} />
          <Route path="/admin/gerir-curso" element={<AdminRoute><GerirCurso /></AdminRoute>} />
          <Route path="/admin/gerir-curso/detalhe/:id" element={<AdminRoute><GerirCursoDetalhe /></AdminRoute>} />
          <Route path="/admin/gerir-curso/criar-curso" element={<AdminRoute><CriarCurso /></AdminRoute>} />
          <Route path="/admin/gerir-utilizador" element={<AdminRoute><GerirUtilizador /></AdminRoute>} />
          <Route path="/admin/gerir-forum" element={<AdminRoute><GerirForum /></AdminRoute>} />
          <Route path="/admin/gerir-denuncia" element={<AdminRoute><GerirDenuncia /></AdminRoute>} />
          <Route path="/admin/gerir-sugestao" element={<AdminRoute><GerirSugestao /></AdminRoute>} />

        </Routes>
      </>
    );
  }

  export default App;