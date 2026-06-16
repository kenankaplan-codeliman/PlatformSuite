import { useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';
import { DashboardContainer, type DashboardWidgetMeta } from '@platform/ui';
import { dashboardCatalog } from '../../../widgets/dashboard/model/catalog';
import { dashboardComponents } from '../../../widgets/dashboard/ui/widgetRegistry';

/**
 * CRM dashboard'u: paylaşılan @platform/ui DashboardContainer'a CRM katalog + widget'larını verir.
 * Persistela/personalizasyon/dnd/shell framework'te; burada yalnız içerik bağlanır.
 */
export function DashboardPage() {
  const { t } = useTranslation('page.dashboard');
  return (
    <DashboardContainer
      title={t('title')}
      icon={<HomeOutlined />}
      catalog={dashboardCatalog}
      components={dashboardComponents}
      getWidgetTitle={(meta: DashboardWidgetMeta) => t(meta.titleKey)}
      preferenceKey="dashboard.layout"
    />
  );
}
