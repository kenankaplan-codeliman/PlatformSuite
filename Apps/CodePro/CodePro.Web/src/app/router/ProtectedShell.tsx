import { AppShell, AuthGuard } from '@platform/ui';
import { useCodeProMenu } from '../menu/useCodeProMenu';
import codeProLogo from '../../assets/codepro-logo.svg';

export function ProtectedShell() {
  const menu = useCodeProMenu();
  return (
    <AuthGuard>
      <AppShell
        menu={menu}
        logo={<img src={codeProLogo} alt="CodePro" height={32} />}
      />
    </AuthGuard>
  );
}
