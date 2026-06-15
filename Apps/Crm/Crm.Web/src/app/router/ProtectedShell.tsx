import { AppShell, AssistantWidget, AuthGuard, type AssistantResolveLink } from '@platform/ui';
import { useCrmMenu } from '../menu/useCrmMenu';
import { RoutePaths } from './paths';

/**
 * Asistanın döndürdüğü EntityReference (entityType + id) → CRM route eşlemesi.
 * Route bilgisi app katmanında kalır; Platform.Web cross-app route bilmez.
 */
const resolveCrmLink: AssistantResolveLink = (entityType, id) => {
  switch (entityType) {
    case 'Account':
      return RoutePaths.AccountView(id);
    case 'Contact':
      return RoutePaths.ContactView(id);
    case 'Lead':
      return RoutePaths.LeadView(id);
    case 'Opportunity':
      return RoutePaths.OpportunityView(id);
    case 'Product':
      return RoutePaths.ProductView(id);
    default:
      return undefined;
  }
};

export function ProtectedShell() {
  const menu = useCrmMenu();
  return (
    <AuthGuard>
      <AppShell menu={menu} />
      <AssistantWidget resolveLink={resolveCrmLink} />
    </AuthGuard>
  );
}
