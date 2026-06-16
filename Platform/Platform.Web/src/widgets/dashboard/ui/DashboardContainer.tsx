import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from '../../../shared/ui/Button';
import { Title } from '../../../shared/ui/Typography';
import type { DashboardComponentMap, DashboardWidgetMeta } from '../model/contracts';
import { useDashboardLayout } from '../model/useDashboardLayout';
import { DashboardGrid } from './DashboardGrid';
import { DashboardCustomizePanel } from './DashboardCustomizePanel';

export interface DashboardContainerProps {
  /** Sayfa başlığı — app i18n'ından çözülmüş. */
  title: string;
  /** Başlık önünde gösterilen ikon (örn. menüdeki dashboard ikonu). */
  icon?: ReactNode;
  /** App'in widget kataloğu (sıra/span/owner-scope). */
  catalog: readonly DashboardWidgetMeta[];
  /** Katalog key'i → widget bileşeni. */
  components: DashboardComponentMap;
  /** Katalog girdisinin başlığını app i18n'ında çözer (özelleştirme paneli için). */
  getWidgetTitle: (meta: DashboardWidgetMeta) => string;
  /** Kişisel tercih anahtarı; varsayılan "dashboard.layout". */
  preferenceKey?: string;
}

/**
 * Paylaşılan dashboard framework'ünün giriş noktası: detay sayfası gibi top bar (ikon + başlık +
 * özelleştir) + persistela + personalizasyon (sürükle-sırala, göster/gizle) + asenkron widget grid'i.
 */
export function DashboardContainer({
  title,
  icon,
  catalog,
  components,
  getWidgetTitle,
  preferenceKey = 'dashboard.layout',
}: DashboardContainerProps) {
  const { t } = useTranslation('widget.dashboard');
  const { layout, visibleKeys, reorder, toggleVisibility, setOwnerScope, reset } = useDashboardLayout(
    catalog,
    preferenceKey,
  );
  const [customizing, setCustomizing] = useState(false);

  return (
    <div>
      {/* Detay sayfası top bar'ı ile aynı görünüm. */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {icon ? (
            <span style={{ display: 'inline-flex', fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}>
              {icon}
            </span>
          ) : null}
          <Title
            level={4}
            style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'rgba(0, 0, 0, 0.88)' }}
          >
            {title}
          </Title>
        </span>
        <Button
          type="primary"
          icon={customizing ? <SaveOutlined /> : <SettingOutlined />}
          onClick={() => setCustomizing((v) => !v)}
          aria-label={customizing ? t('save') : t('customize')}
        >
          {customizing ? t('save') : null}
        </Button>
      </div>

      {customizing ? (
        <DashboardCustomizePanel
          catalog={catalog}
          getWidgetTitle={getWidgetTitle}
          layout={layout}
          onToggleVisibility={toggleVisibility}
          onReset={reset}
        />
      ) : null}

      <DashboardGrid
        catalog={catalog}
        components={components}
        visibleKeys={visibleKeys}
        isCustomizing={customizing}
        ownerScopes={layout.ownerScopes}
        onReorder={reorder}
        onOwnerOnlyChange={setOwnerScope}
      />
    </div>
  );
}
