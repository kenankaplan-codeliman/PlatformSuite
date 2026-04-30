import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// shared
import commonTr from "../shared/locales/common/tr.json";
import enumsTr from "../shared/locales/enums/tr.json";
// entities
import userTr from "../entities/user/locales/tr.json";
import accountTr from "../entities/account/locales/tr.json";
import organizationTr from "../entities/organization/locales/tr.json";
import appUserTr from "../entities/app-user/locales/tr.json";
import appRoleTr from "../entities/app-role/locales/tr.json";
import attachmentTr from "../entities/attachment/locales/tr.json";
// features
import authLoginTr from "../features/auth-login/locales/tr.json";
// widgets
import widgetAttachmentTr from "../widgets/attachment/locales/tr.json";
// pages
import loginPageTr from "../pages/auth/login/locales/tr.json";
import accountsListPageTr from "../pages/accounts/list/locales/tr.json";
import accountsDetailPageTr from "../pages/accounts/detail/locales/tr.json";
import organizationsListPageTr from "../pages/organizations/list/locales/tr.json";
import organizationsDetailPageTr from "../pages/organizations/detail/locales/tr.json";
import usersListPageTr from "../pages/users/list/locales/tr.json";
import usersDetailPageTr from "../pages/users/detail/locales/tr.json";
import appRolesListPageTr from "../pages/app-roles/list/locales/tr.json";
import appRolesDetailPageTr from "../pages/app-roles/detail/locales/tr.json";

const namespaces = [
  "common",
  "enums",
  "entity.user",
  "entity.account",
  "entity.organization",
  "entity.app-user",
  "entity.app-role",
  "entity.attachment",
  "feature.auth-login",
  "widget.attachment",
  "page.auth-login",
  "page.accounts-list",
  "page.accounts-detail",
  "page.organizations-list",
  "page.organizations-detail",
  "page.users-list",
  "page.users-detail",
  "page.app-roles-list",
  "page.app-roles-detail",
] as const;

void i18n.use(initReactI18next).init({
  lng: "tr",
  fallbackLng: "tr",
  defaultNS: "common",
  ns: [...namespaces],
  resources: {
    tr: {
      common: commonTr,
      enums: enumsTr,
      "entity.user": userTr,
      "entity.account": accountTr,
      "entity.organization": organizationTr,
      "entity.app-user": appUserTr,
      "entity.app-role": appRoleTr,
      "entity.attachment": attachmentTr,
      "feature.auth-login": authLoginTr,
      "widget.attachment": widgetAttachmentTr,
      "page.auth-login": loginPageTr,
      "page.accounts-list": accountsListPageTr,
      "page.accounts-detail": accountsDetailPageTr,
      "page.organizations-list": organizationsListPageTr,
      "page.organizations-detail": organizationsDetailPageTr,
      "page.users-list": usersListPageTr,
      "page.users-detail": usersDetailPageTr,
      "page.app-roles-list": appRolesListPageTr,
      "page.app-roles-detail": appRolesDetailPageTr,
    },
  },
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
