import {
  ApartmentOutlined,
  CalendarOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { RoutePaths } from '../../../app/router/paths';
import type { EntityTypeMeta } from './types';

/**
 * Platform-wide entity türleri. Her app `EntityTypeRegistryProvider.entries`
 * için bunu kendi listesiyle birleştirir.
 *
 * Not: Activity polimorfik bir `:type` parametresi alır (`/activities/:type/:id`),
 * bu nedenle düz `getDetailHref(id)` ile temsil edilmez. Activity referansı için
 * çağıran taraf navigasyonu kendi yapar; registry yalnız ikon + ton sağlar
 * (örn. liste sayfası title'ı, badge, breadcrumb).
 */
export const platformEntityTypes: EntityTypeMeta[] = [
  {
    key: 'User',
    label: 'common:entities.user',
    labelPlural: 'common:entities.users',
    icon: UserOutlined,
    tone: 'geekblue',
    getDetailHref: (id) => RoutePaths.AppUserView(id),
  },
  {
    key: 'AppRole',
    label: 'common:entities.appRole',
    labelPlural: 'common:entities.appRoles',
    icon: SafetyOutlined,
    tone: 'purple',
    getDetailHref: (id) => RoutePaths.AppRoleView(id),
  },
  {
    key: 'Organization',
    label: 'common:entities.organization',
    labelPlural: 'common:entities.organizations',
    icon: ApartmentOutlined,
    tone: 'blue',
    getDetailHref: (id) => RoutePaths.OrganizationView(id),
  },
  {
    key: 'Activity',
    label: 'common:entities.activity',
    labelPlural: 'common:entities.activities',
    icon: CalendarOutlined,
    tone: 'cyan',
  },
];
