import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { EntityLookupOption } from '../../ui/form/fields/EntityLookupField';

/**
 * Activity'nin polimorfik referans alanları (regarding, parties) ile uygulamanın
 * arayabileceği entity türlerini tanımlar. Her uygulama (Crm.Web, CodePro.Web)
 * kendi entity'lerini provider'a verir; Activity Detail sayfası buradan okur.
 *
 * - `regardingEntityTypes`: Activity'nin "Hakkında" alanında seçilebilecek türler.
 *   Crm: Account, Contact, Lead, Opportunity. CodePro: Supplier, PurchaseOrder, ...
 *
 * - `partyEntityTypes`: From/To/Cc/Bcc/Caller/Recipient/Organizer/Attendee gibi
 *   katılımcı alanlarında seçilebilecek türler. Crm: User, Contact, Account.
 *   CodePro: User, Supplier.
 */
export interface ActivityEntityTypesValue {
  regardingEntityTypes: EntityLookupOption[];
  partyEntityTypes: EntityLookupOption[];
}

const defaultValue: ActivityEntityTypesValue = {
  regardingEntityTypes: [{ entityType: 'User', label: 'User' }],
  partyEntityTypes: [{ entityType: 'User', label: 'User' }],
};

const ActivityEntityTypesContext = createContext<ActivityEntityTypesValue>(defaultValue);

export interface ActivityEntityTypesProviderProps extends ActivityEntityTypesValue {
  children: ReactNode;
}

export function ActivityEntityTypesProvider({
  children,
  regardingEntityTypes,
  partyEntityTypes,
}: ActivityEntityTypesProviderProps) {
  const value = useMemo(
    () => ({ regardingEntityTypes, partyEntityTypes }),
    [regardingEntityTypes, partyEntityTypes],
  );
  return (
    <ActivityEntityTypesContext.Provider value={value}>
      {children}
    </ActivityEntityTypesContext.Provider>
  );
}

export function useActivityEntityTypes(): ActivityEntityTypesValue {
  return useContext(ActivityEntityTypesContext);
}
