import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectIfAuth({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/paginaInicial", { replace: true });
    }
  }, [navigate]);
  return children;
}

export default RedirectIfAuth;