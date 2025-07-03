import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../auth.service";

const FormadorRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();

  if (!user || user.role !== "formador" && user.role !== "gestor") {
    return <Navigate to="/paginaInicial" replace />;
  }
  return children;
};

export default FormadorRoute;