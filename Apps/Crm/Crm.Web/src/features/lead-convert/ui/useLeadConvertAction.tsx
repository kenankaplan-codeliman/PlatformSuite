import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RetweetOutlined } from '@ant-design/icons';
import type { DetailPageAction } from '@platform/ui';
import { ConvertLeadDialog } from './ConvertLeadDialog';

export interface UseLeadConvertActionArgs {
  /** Dönüştürülecek aday id'si. Yoksa (new mode) action üretilmez. */
  leadId?: string;
  /** Aday zaten Converted ise action gösterilmez. */
  alreadyConverted: boolean;
  /** Yetki yoksa action'ı gizlemek için. Varsayılan: true. */
  enabled?: boolean;
}

export interface LeadConvertAction {
  action: DetailPageAction | null;
  modal: ReactNode;
}

/**
 * Lead Detail sayfasının actions menüsüne "Dönüştür" öğesi + Convert dialog'u ekler.
 * `useOwnerAssignAction` ile aynı {action, modal} kalıbı.
 */
export function useLeadConvertAction({
  leadId,
  alreadyConverted,
  enabled = true,
}: UseLeadConvertActionArgs): LeadConvertAction {
  const { t } = useTranslation('entity.lead');
  const [open, setOpen] = useState(false);

  if (!enabled || !leadId || alreadyConverted) {
    return { action: null, modal: null };
  }

  return {
    action: {
      key: 'convert-lead',
      label: t('convert.action'),
      icon: <RetweetOutlined />,
      onClick: () => setOpen(true),
    },
    modal: (
      <ConvertLeadDialog open={open} onClose={() => setOpen(false)} leadId={leadId} />
    ),
  };
}
