import { useTranslation } from 'react-i18next';
import { Toggle } from './Toggle';

interface OwnerScopeSwitchProps {
  ownerOnly: boolean;
  onChange: (ownerOnly: boolean) => void;
}

/** Activity/owner widget'larının başlığındaki switch — açık → owner=ben. Etiket yok, tooltip var. */
export function OwnerScopeSwitch({ ownerOnly, onChange }: OwnerScopeSwitchProps) {
  const { t } = useTranslation('widget.dashboard');
  return <Toggle checked={ownerOnly} onChange={onChange} aria-label={t('ownerOnly')} title={t('ownerOnly')} />;
}
