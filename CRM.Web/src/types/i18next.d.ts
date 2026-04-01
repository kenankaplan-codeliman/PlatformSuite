import type commonTr from '@/locales/tr/common.json';
import type enumsTr from '@/locales/tr/enums.json';
import type leadTr from '@/locales/tr/lead.json';
import type accountTr from '@/locales/tr/account.json';
import type contactTr from '@/locales/tr/contact.json';
import type opportunityTr from '@/locales/tr/opportunity.json';
import type activityTr from '@/locales/tr/activity.json';
import type dashboardTr from '@/locales/tr/dashboard.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof commonTr;
      enums: typeof enumsTr;
      lead: typeof leadTr;
      account: typeof accountTr;
      contact: typeof contactTr;
      opportunity: typeof opportunityTr;
      activity: typeof activityTr;
      dashboard: typeof dashboardTr;
    };
  }
}
