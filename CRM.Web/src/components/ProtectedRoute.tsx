import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "@/stores/auth.store";
import RoutePaths from "@/constants/route.paths";

const ProtectedRoute =() => {

  const { checkAuth } = useAuthState();

  if (!checkAuth()) {
    return <Navigate to={RoutePaths.Login} replace />;
  }

  return <Outlet />;
  
}

export  default ProtectedRoute;