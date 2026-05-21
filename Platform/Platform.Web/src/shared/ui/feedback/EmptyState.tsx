import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

export interface EmptyStateProps {
  /** Açıklama metnini override eder; verilmezse `common.messages.noData`. */
  description?: string;
  /** `default` antd'nin büyük illüstrasyonu, `small` sadeleştirilmiş ikon. */
  size?: 'default' | 'small';
}

/**
 * shared/ui — antd `Empty` wrapper'ı. "Kayıt yok" durumlarında ikon + standart
 * "Kayıt bulunamadı." mesajı gösterir. Liste/section'lar bu primitif'i tüketir.
 *
 * Global olarak `AppProviders.renderEmpty` üzerinden antd Table/Select gibi
 * bileşenlerin default empty state'i de bu component ile değiştirilir.
 */
export function EmptyState({ description, size = 'small' }: EmptyStateProps) {
  const { t } = useTranslation('common');
  return (
    <Empty
      image={size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
      description={description ?? t('messages.noData')}
    />
  );
}
