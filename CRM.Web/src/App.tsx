import React from 'react';
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { App as AntApp, Spin } from "antd";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/util/msalInstance";
import GlobalLayout from "@/components/GlobalLayout";
import ContentLayout from "@/components/ContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingModalProvider } from "@/components/LoadingModal";
import DashboardPage from './pages/DashBoard';

// Routes - tüm modül route'larını içerir
import { appRoutes } from "@/routes/index";

// ===== LAZY LOADED PAGES =====
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound")); 


// Generic route renderer - RouteObject[] kabul eder
const renderRoutes = (routes: RouteObject[]): React.ReactNode => {
    return routes.map((route, index) => (
        <Route 
            key={route.path || index} 
            path={route.path} 
            element={route.element}
        >
            {route.children && renderRoutes(route.children)}
        </Route>
    ));
};

const App: React.FC = () => {
    return (
        <MsalProvider instance={msalInstance}>
            <AntApp>
                <LoadingModalProvider>
                    <BrowserRouter>
                        <Suspense
                            fallback={
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Spin size="large" />
                                </div>
                            }>
                            <Routes>
                                <Route element={<GlobalLayout />}>
                                    {/* Public */}
                                    <Route path="/login" element={<Login />} />

                                    {/* Protected */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route element={<ContentLayout />}>
                                            {/* Dashboard */}
                                            <Route path="/" element={<DashboardPage />} />
                                            
                                            {/* All Module Routes (Lead, Account, Contact, etc.) */}
                                            {renderRoutes(appRoutes)}
                                        </Route>
                                    </Route>

                                    {/* 404 - Eşleşmeyen tum routelar */}
                                    <Route path="*" element={<NotFound />} /> 

                                </Route>
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </LoadingModalProvider>
            </AntApp>
        </MsalProvider>
    );
}

export default App;
