import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../shared/ui/feedback/Spinner";
import { Alert } from "../../../shared/ui/feedback/Alert";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { useCurrentUserQuery } from "../../../entities/user/api/useCurrentUserQuery";
import { RoutePaths } from "../../../app/router/paths";

export function HomePage() {
  const { t: tEntity } = useTranslation("entity.user");
  const { t: tAccount } = useTranslation("entity.account");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const currentUser = useCurrentUserQuery();

  if (currentUser.isLoading) {
    return <Spinner tip={tCommon("messages.loading")} />;
  }

  if (currentUser.isError) {
    return <Alert type="error" message={tCommon("messages.unexpectedError")} />;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>
        {tEntity("greeting", { name: currentUser.data?.displayName ?? "" })}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        <Card title={tAccount("plural")}>
          <Button
            type="primary"
            onClick={() => navigate(RoutePaths.AccountsList)}
          >
            {tAccount("plural")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
