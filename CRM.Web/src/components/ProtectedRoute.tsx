import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "@/stores/auth.store";
import { useEffect } from "react";

const ProtectedRoute =() => {

  const { isAuthenticated } = useAuthState();
  const { checkAuth } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/login');
    }
  }, []);


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
  
}

export  default ProtectedRoute;