import { AppShell, AuthGuard } from '@platform/ui';
import { useCodeProMenu } from '../menu/useCodeProMenu';

export function ProtectedShell() {
  const menu = useCodeProMenu();
  return (
    <AuthGuard>
      <AppShell menu={menu} />
    </AuthGuard>
  );
}
