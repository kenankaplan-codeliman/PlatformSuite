import { useTranslation } from "react-i18next";
import {
  HomeOutlined,
  RiseOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  entityMenuItem,
  useEntityTypeRegistry,
  type MenuSchema,
} from "@platform/ui";
import { RoutePaths } from "../router/paths";

export function useCrmMenu(): MenuSchema {
  const { t } = useTranslation("app.crm-menu");
  const { get } = useEntityTypeRegistry();

  return [
    {
      key: "home",
      label: t("home"),
      icon: <HomeOutlined />,
      to: RoutePaths.Home,
    },
    entityMenuItem(get("Activity")!, t, {
      label: t("activities"),
      to: RoutePaths.ActivitiesList,
    }),
    {
      key: "sales",
      label: t("groups.sales"),
      icon: <RiseOutlined />,
      children: [
        entityMenuItem(get("Lead")!, t, {
          label: t("leads"),
          to: RoutePaths.LeadsList,
        }),
        entityMenuItem(get("Opportunity")!, t, {
          label: t("opportunities"),
          to: RoutePaths.OpportunitiesList,
        }),
        entityMenuItem(get("Product")!, t, {
          label: t("products"),
          to: RoutePaths.ProductsList,
        }),
      ],
    },
    {
      key: "customers",
      label: t("groups.customers"),
      icon: <AppstoreOutlined />,
      children: [
        entityMenuItem(get("Account")!, t, {
          label: t("accounts"),
          to: RoutePaths.AccountsList,
        }),
        entityMenuItem(get("Contact")!, t, {
          label: t("contacts"),
          to: RoutePaths.ContactsList,
        }),
      ],
    },
    {
      key: "settings",
      label: t("groups.settings"),
      icon: <SettingOutlined />,
      children: [
        entityMenuItem(get("Organization")!, t, {
          key: "orgs",
          label: t("organizations"),
          to: RoutePaths.OrganizationsList,
        }),
        entityMenuItem(get("User")!, t, {
          label: t("users"),
          to: RoutePaths.AppUsersList,
        }),
        entityMenuItem(get("AppRole")!, t, {
          key: "roles",
          label: t("roles"),
          to: RoutePaths.AppRolesList,
        }),
      ],
    },
  ];
}
