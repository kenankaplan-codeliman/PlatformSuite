import { AppShell, AuthGuard } from '@platform/ui';
import { useCrmMenu } from '../menu/useCrmMenu';

export function ProtectedShell() {
  const menu = useCrmMenu();
  return (
    <AuthGuard>
      <AppShell menu={menu} />
    </AuthGuard>
  );
}
