import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "@/stores/auth.store";
import RoutePaths from "@/constants/route.paths";

const ProtectedRoute =() => {

  const { isAuthenticated } = useAuthState();
  const { checkAuth } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate(RoutePaths.Login);
    }
  }, []);


  if (!isAuthenticated) {
    return <Navigate to={RoutePaths.Login} replace />;
  }

  return <Outlet />;
  
}

export  default ProtectedRoute;