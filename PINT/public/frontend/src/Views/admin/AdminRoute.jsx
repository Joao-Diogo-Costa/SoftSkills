import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../auth.service";

const AdminRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();

  if (!user || (user.role !== "gestor")) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;