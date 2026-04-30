import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Card } from "../../../../shared/ui/Card";
import { LoginForm } from "../../../../features/auth-login/ui/LoginForm";
import { useSessionStore } from "../../../../shared/lib/auth/sessionStore";
import { RoutePaths } from "../../../../app/router/paths";
import { LoginPageLayout } from "./LoginPageLayout";

export function LoginPage() {
  const { t: tFeature } = useTranslation("feature.auth-login");
  const { t: tPage } = useTranslation("page.auth-login");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={RoutePaths.Home} replace />;
  }

  return (
    <LoginPageLayout brand={tPage("brand")}>
      <Card title={tFeature("title")}>
        <p style={{ color: "rgba(0,0,0,0.55)", marginTop: 0 }}>
          {tFeature("subtitle")}
        </p>
        <LoginForm />
      </Card>
    </LoginPageLayout>
  );
}
