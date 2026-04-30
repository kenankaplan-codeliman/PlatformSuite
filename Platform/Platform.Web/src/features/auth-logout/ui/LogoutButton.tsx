import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { RoutePaths } from "../../../app/router/paths";
import { useLogoutMutation } from "../api/useLogoutMutation";

export function LogoutButton() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const logout = useLogoutMutation();

  const handleClick = async () => {
    await logout.mutateAsync();
    navigate(RoutePaths.Login, { replace: true });
  };

  return (
    <Button type="text" onClick={handleClick} loading={logout.isPending}>
      {t("actions.logout")}
    </Button>
  );
}
