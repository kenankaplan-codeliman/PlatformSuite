import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Text } from '../../../shared/ui/Typography';
import type { DashboardWidgetMeta } from '../model/contracts';
import type { DashboardLayout } from '../model/layout';
import { Toggle } from './Toggle';

interface DashboardCustomizePanelProps {
  catalog: readonly DashboardWidgetMeta[];
  getWidgetTitle: (meta: DashboardWidgetMeta) => string;
  layout: DashboardLayout;
  onToggleVisibility: (key: string) => void;
  onReset: () => void;
}

/** Widget göster/gizle switch'leri + "varsayılana sıfırla". Sıralama grid'de sürüklemeyle yapılır. */
export function DashboardCustomizePanel({
  catalog,
  getWidgetTitle,
  layout,
  onToggleVisibility,
  onReset,
}: DashboardCustomizePanelProps) {
  const { t } = useTranslation('widget.dashboard');
  const visibleByKey = Object.fromEntries(layout.widgets.map((w) => [w.key, w.visible]));

  return (
    <Card
      size="small"
      title={t('customizeTitle')}
      extra={
        <Button size="small" onClick={onReset}>
          {t('reset')}
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      <Text type="secondary">{t('customizeHint')}</Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 8,
          marginTop: 12,
        }}
      >
        {catalog.map((w) => (
          <div
            key={w.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #f0f0f0',
              borderRadius: 6,
              padding: '8px 12px',
              background: '#fff',
            }}
          >
            <Text>{getWidgetTitle(w)}</Text>
            <Toggle
              checked={visibleByKey[w.key] ?? true}
              onChange={() => onToggleVisibility(w.key)}
              aria-label={getWidgetTitle(w)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
