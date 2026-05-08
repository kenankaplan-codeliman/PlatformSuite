import { useTranslation } from "react-i18next";
import { Spinner } from "../../../shared/ui/feedback/Spinner";
import { Alert } from "../../../shared/ui/feedback/Alert";
import { useCurrentUserQuery } from "../../../entities/user/api/useCurrentUserQuery";

export function HomePage() {
  const { t: tEntity } = useTranslation("entity.user");
  const { t: tCommon } = useTranslation("common");
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
    </div>
  );
}
