import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonTr from '@/locales/tr/common.json';
import enumsTr from '@/locales/tr/enums.json';
import leadTr from '@/locales/tr/lead.json';
import accountTr from '@/locales/tr/account.json';
import contactTr from '@/locales/tr/contact.json';
import opportunityTr from '@/locales/tr/opportunity.json';
import activityTr from '@/locales/tr/activity.json';
import dashboardTr from '@/locales/tr/dashboard.json';

i18n.use(initReactI18next).init({
  lng: 'tr',
  fallbackLng: 'tr',

  ns: ['common', 'enums', 'lead', 'account', 'contact', 'opportunity', 'activity', 'dashboard'],
  defaultNS: 'common',

  resources: {
    tr: {
      common: commonTr,
      enums: enumsTr,
      lead: leadTr,
      account: accountTr,
      contact: contactTr,
      opportunity: opportunityTr,
      activity: activityTr,
      dashboard: dashboardTr,
    },
  },

  interpolation: {
    escapeValue: false, // React zaten XSS'e karşı koruyor
  },
});

export default i18n;
