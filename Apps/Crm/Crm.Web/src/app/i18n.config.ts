import i18n from 'i18next';

// CRM-spesifik locale kaynakları
import accountEntityTr from '../entities/account/locales/tr.json';
import contactEntityTr from '../entities/contact/locales/tr.json';
import leadEntityTr from '../entities/lead/locales/tr.json';
import opportunityEntityTr from '../entities/opportunity/locales/tr.json';
import productEntityTr from '../entities/product/locales/tr.json';
import accountsListTr from '../pages/accounts/list/locales/tr.json';
import accountsDetailTr from '../pages/accounts/detail/locales/tr.json';
import contactsListTr from '../pages/contacts/list/locales/tr.json';
import contactsDetailTr from '../pages/contacts/detail/locales/tr.json';
import leadsListTr from '../pages/leads/list/locales/tr.json';
import leadsDetailTr from '../pages/leads/detail/locales/tr.json';
import opportunitiesListTr from '../pages/opportunities/list/locales/tr.json';
import opportunitiesDetailTr from '../pages/opportunities/detail/locales/tr.json';
import productsListTr from '../pages/products/list/locales/tr.json';
import productsDetailTr from '../pages/products/detail/locales/tr.json';
import dashboardTr from '../pages/dashboard/locales/tr.json';
import crmEnumsTr from '../shared/locales/enums/tr.json';
import crmMenuTr from './menu/locales/tr.json';
import crmAppTr from './locales/tr.json';

/**
 * Platform i18n init'i (`@platform/ui/i18n` import'u) tamamlandıktan sonra çağrılır.
 * CRM-spesifik namespace'leri ekler ve `enums` namespace'ini deep-merge ile genişletir.
 */
export function registerCrmTranslations(): void {
  i18n.addResourceBundle('tr', 'entity.account', accountEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.contact', contactEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.lead', leadEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.opportunity', opportunityEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.product', productEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.accounts-list', accountsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.accounts-detail', accountsDetailTr, true, true);
  i18n.addResourceBundle('tr', 'page.contacts-list', contactsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.contacts-detail', contactsDetailTr, true, true);
  i18n.addResourceBundle('tr', 'page.leads-list', leadsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.leads-detail', leadsDetailTr, true, true);
  i18n.addResourceBundle('tr', 'page.opportunities-list', opportunitiesListTr, true, true);
  i18n.addResourceBundle('tr', 'page.opportunities-detail', opportunitiesDetailTr, true, true);
  i18n.addResourceBundle('tr', 'page.products-list', productsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.products-detail', productsDetailTr, true, true);
  i18n.addResourceBundle('tr', 'page.dashboard', dashboardTr, true, true);

  // enums namespace Platform tarafından init edildi; üzerine CRM enum'larını deep-merge et.
  i18n.addResourceBundle('tr', 'enums', crmEnumsTr, true, false);

  i18n.addResourceBundle('tr', 'app.crm-menu', crmMenuTr, true, true);
  i18n.addResourceBundle('tr', 'app.crm', crmAppTr, true, true);
}
