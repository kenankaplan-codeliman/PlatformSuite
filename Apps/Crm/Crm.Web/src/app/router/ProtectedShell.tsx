import { AppShell, AuthGuard } from '@platform/ui';
import { useCrmMenu } from '../menu/useCrmMenu';
import crmLogo from '../../assets/crm-logo.svg';

export function ProtectedShell() {
  const menu = useCrmMenu();
  return (
    <AuthGuard>
      <AppShell menu={menu} logo={<img src={crmLogo} alt="CRM" height={32} />} />
    </AuthGuard>
  );
}
