import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "@/stores/auth.store";
import RoutePaths from "@/config/route.paths";
import { Spin } from "antd";

type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated';

const ProtectedRoute = () => {
  const { checkAuth } = useAuthState();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('pending');

  useEffect(() => {
    checkAuth().then((valid) => {
      setAuthStatus(valid ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  // checkAuth tamamlanana kadar bekle — servis çağrıları yapılmasın
  if (authStatus === 'pending') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to={RoutePaths.Login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;