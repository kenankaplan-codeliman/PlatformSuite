import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { EntityLookupOption } from '../../ui/form/fields/EntityLookupField';
import { useEntityTypeRegistry } from '../entity-type/EntityTypeRegistryContext';
import type { EntityTypeKey } from '../entity-type/types';

/**
 * Activity'nin polimorfik referans alanları (regarding, parties) ile
 * uygulamanın **arayabileceği entity türlerini** bildirir.
 *
 * Provider artık sadece **anahtar listesi** alır — icon/label/servicePath
 * ortak `EntityTypeRegistry`'den (bkz. `EntityTypeRegistryContext`) otomatik
 * çözülür. Böylece her entity için iki yerde tanım tutulmaz.
 *
 *  - `regardingKeys`: Activity'nin "Hakkında" alanında seçilebilecek türler.
 *    Crm: ['Account','Contact','Lead','Opportunity']. CodePro: ['Supplier','PurchaseOrder',...].
 *
 *  - `partyKeys`: From/To/Cc/Bcc/Caller/Recipient/Organizer/Attendee gibi katılımcı
 *    alanlarında seçilebilecek türler. Crm: ['User','Contact','Account','Lead'].
 *    CodePro: ['User','Supplier'].
 *
 * Tüketici (Activity Detail sayfası) hâlâ `EntityLookupOption[]` döner —
 * registry'den çevrilmiş label ile. Bu sayede `EntityLookupField`'ın
 * `entityTypes` prop'una doğrudan geçilebilir.
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

export interface ActivityEntityTypesProviderProps {
  regardingKeys: ReadonlyArray<EntityTypeKey>;
  partyKeys: ReadonlyArray<EntityTypeKey>;
  children: ReactNode;
}

export function ActivityEntityTypesProvider({
  children,
  regardingKeys,
  partyKeys,
}: ActivityEntityTypesProviderProps) {
  const registry = useEntityTypeRegistry();
  const { t } = useTranslation('common');

  const value = useMemo<ActivityEntityTypesValue>(() => {
    const toOptions = (keys: ReadonlyArray<EntityTypeKey>): EntityLookupOption[] =>
      keys.map((key) => {
        const meta = registry.get(key);
        return {
          entityType: key,
          label: meta ? t(meta.label) : key,
          servicePath: meta?.servicePath,
        };
      });

    return {
      regardingEntityTypes: toOptions(regardingKeys),
      partyEntityTypes: toOptions(partyKeys),
    };
  }, [registry, t, regardingKeys, partyKeys]);

  return (
    <ActivityEntityTypesContext.Provider value={value}>
      {children}
    </ActivityEntityTypesContext.Provider>
  );
}

export function useActivityEntityTypes(): ActivityEntityTypesValue {
  return useContext(ActivityEntityTypesContext);
}
