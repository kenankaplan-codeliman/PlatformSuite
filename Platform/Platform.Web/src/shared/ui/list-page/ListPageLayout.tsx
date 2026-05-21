import { useEffect, useRef, type ReactNode } from 'react';
import { Space, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { DataTable, type DataTableColumn } from '../DataTable';
import { Alert } from '../feedback/Alert';
import { useEntityTypeRegistry } from '../../lib/entity-type/EntityTypeRegistryContext';

const { Title } = Typography;

export interface ListPageLayoutProps<T> {
  /** Verilmezse layout başlık satırını render etmez (embed kullanımı için). */
  title?: string;
  /**
   * Title'ın soluna bu entity'nin ikonu yerleştirilir (registry'den). Renk + boyut
   * Title ile aynı (currentColor + 1em). Verilmezse ikon render edilmez.
   */
  entityType?: string;
  columns: DataTableColumn<T>[];
  /** Akümüle edilmiş tüm sayfaların flat listesi. Caller `useInfiniteQuery`
   *  sonucunu `pages.flatMap(p => p.data)` ile düzleştirip verir. */
  data: T[];
  rowKey: keyof T | ((record: T) => string);

  /** İlk yükleme — tablo loading state'iyle. */
  isLoading?: boolean;
  /** Sonraki sayfa çekiliyor — sentinel altında küçük spinner. */
  isFetchingMore?: boolean;
  /** Daha fazla sayfa var mı — `false` ise sentinel devre dışı. */
  hasMore?: boolean;
  /** Sentinel viewport'a girdiğinde tetiklenir. */
  onLoadMore?: () => void;

  error?: unknown;

  filterBar?: ReactNode;
  headerActions?: ReactNode;

  onCreateClick?: () => void;
  createLabel?: string;

  onRowClick?: (record: T) => void;
}

/**
 * Liste sayfaları için container. Pagination yerine **infinite scroll**:
 * tablonun altındaki sentinel element viewport'a girdiğinde `onLoadMore`
 * çağrılır. EntityLookupField modal'ındaki "scroll dibinde sonraki sayfa"
 * pattern'iyle aynı.
 */
export function ListPageLayout<T extends object>({
  title,
  entityType,
  columns,
  data,
  rowKey,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  error,
  filterBar,
  headerActions,
  onCreateClick,
  createLabel,
  onRowClick,
}: ListPageLayoutProps<T>) {
  const { t } = useTranslation('common');
  const entityTypeRegistry = useEntityTypeRegistry();
  const TitleIcon = entityType ? entityTypeRegistry.get(entityType)?.icon : undefined;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !onLoadMore) return;
    if (!hasMore || isFetchingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isFetchingMore, isLoading]);

  const showHeader = !!(title || headerActions || onCreateClick);

  return (
    <div>
      {showHeader && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          {title ? (
            <Title level={3} style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {TitleIcon ? <TitleIcon /> : null}
              <span>{title}</span>
            </Title>
          ) : (
            <span />
          )}
          <Space>
            {headerActions}
            {onCreateClick && (
              <Button type="primary" onClick={onCreateClick}>
                {createLabel ?? t('actions.create')}
              </Button>
            )}
          </Space>
        </div>
      )}

      {filterBar && <div style={{ marginBottom: 16 }}>{filterBar}</div>}

      {error ? (
        <Alert type="error" message={t('messages.unexpectedError')} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data}
            rowKey={rowKey}
            loading={isLoading}
            onRowClick={onRowClick}
          />

          {/* Sentinel — viewport'a girince onLoadMore tetiklenir. Liste sonunda
              işaret gösterilmez; yalnızca sonraki sayfa çekilirken spinner. */}
          <div
            ref={sentinelRef}
            style={{
              minHeight: 1,
              padding: 16,
              display: 'flex',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.45)',
            }}
          >
            {isFetchingMore ? <Spin size="small" /> : null}
          </div>
        </>
      )}
    </div>
  );
}
