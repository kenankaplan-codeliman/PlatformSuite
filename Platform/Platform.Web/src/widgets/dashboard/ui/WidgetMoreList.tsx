import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui/Button';

interface WidgetMoreListProps<T> {
  items: T[];
  rowKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
  /** Widget içi scroll yüksekliği (px). */
  maxHeight?: number;
}

/**
 * Liste widget'larının gövdesi: ilk sayfa, widget içi scroll, fazlası varsa
 * "Daha fazla göster" butonu in-place ekler (yeni sayfaya gitmez).
 */
export function WidgetMoreList<T>({
  items,
  rowKey,
  renderItem,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  maxHeight = 168,
}: WidgetMoreListProps<T>) {
  const { t } = useTranslation('widget.dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Scroll yalnız liste alanında; ilk sayfayı (≈3 kayıt) aşınca çubuk çıkar, kart uzamaz. */}
      <div style={{ maxHeight, overflowY: 'auto' }}>
        {items.map((item) => (
          <div key={rowKey(item)}>{renderItem(item)}</div>
        ))}
      </div>
      {/* "Daha fazla göster" scroll alanının dışında — her zaman görünür, scroll ile kaybolmaz. */}
      {hasNextPage && (
        <div style={{ marginTop: 4, paddingTop: 4, textAlign: 'center', borderTop: '1px solid rgba(5,5,5,0.06)' }}>
          <Button size="small" type="link" loading={isFetchingNextPage} onClick={onLoadMore}>
            {t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}
