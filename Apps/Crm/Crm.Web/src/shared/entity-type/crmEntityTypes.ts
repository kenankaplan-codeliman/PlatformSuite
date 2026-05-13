import {
  AimOutlined,
  ContactsOutlined,
  HomeOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { EntityTypeMeta } from '@platform/ui';
import { RoutePaths } from '../../app/router/paths';

/**
 * CRM'in polimorfik referans alanlarında çıkabilecek entity türleri için
 * görsel + navigasyon metadata'sı. App.tsx `EntityTypeRegistryProvider`'a
 * `platformEntityTypes` ile birleştirerek geçer.
 *
 * Yeni bir CRM entity'si eklemek için: bu listeye bir entry, i18n çevirisi
 * ekle — menu/badge/lookup/popup otomatik tanır.
 */
export const crmEntityTypes: EntityTypeMeta[] = [
  {
    key: 'Account',
    label: 'app.crm:entities.account',
    labelPlural: 'app.crm:entities.accounts',
    icon: HomeOutlined,
    tone: 'blue',
    getDetailHref: (id) => RoutePaths.AccountView(id),
  },
  {
    key: 'Contact',
    label: 'app.crm:entities.contact',
    labelPlural: 'app.crm:entities.contacts',
    icon: ContactsOutlined,
    tone: 'green',
    getDetailHref: (id) => RoutePaths.ContactView(id),
  },
  {
    key: 'Lead',
    label: 'app.crm:entities.lead',
    labelPlural: 'app.crm:entities.leads',
    icon: AimOutlined,
    tone: 'gold',
    getDetailHref: (id) => RoutePaths.LeadView(id),
  },
  {
    key: 'Opportunity',
    label: 'app.crm:entities.opportunity',
    labelPlural: 'app.crm:entities.opportunities',
    icon: RiseOutlined,
    tone: 'purple',
    getDetailHref: (id) => RoutePaths.OpportunityView(id),
  },
];
