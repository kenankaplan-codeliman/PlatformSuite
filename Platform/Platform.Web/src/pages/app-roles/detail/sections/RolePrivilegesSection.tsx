import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSection } from '../../../../shared/ui/form/FormSection';
import {
  SelectField,
  type SelectOption,
} from '../../../../shared/ui/form/fields/SelectField';
import { useEnumTranslation } from '../../../../shared/lib/i18n/enum';
import type {
  AppRoleFormValues,
  PrivilegeCatalogGroup,
} from '../../../../entities/app-role/model/types';
import { ACCESS_LEVELS } from '../../../../entities/app-role/lib/privilegeMatrix';

interface RolePrivilegesSectionProps {
  catalog: PrivilegeCatalogGroup[];
}

/**
 * Rolün privilege'larını entity bazında gruplayıp listeler ve düzenletir.
 * Satır başında entity adı, yanında o entity'e ait her eylem için erişim
 * seviyesi seçimi (None/User/Organization/All) yer alır. Görünür/düzenlenebilir
 * kararı `SelectField` mode-aware olduğundan view modunda otomatik salt-okunur.
 *
 * Form'un `privileges` dizisi katalog sırasıyla doldurulduğu için (bkz.
 * buildPrivilegeFormList), dizi index'i = katalog pozisyonu; binding buna dayanır.
 */
export function RolePrivilegesSection({ catalog }: RolePrivilegesSectionProps) {
  const form = useFormContext<AppRoleFormValues>();
  const { t: tEntity } = useTranslation('entity.app-role');
  const tAccess = useEnumTranslation('accessLevel');

  const accessOptions = useMemo<SelectOption[]>(
    () => ACCESS_LEVELS.map((level) => ({ value: level, label: tAccess(level) })),
    [tAccess],
  );

  // Katalog gruplarını, form dizisindeki düz index'leriyle eşleştir.
  const groups = useMemo(() => {
    let index = 0;
    return catalog.map((group) => ({
      entity: group.entity,
      privileges: group.privileges.map((entry) => ({
        ...entry,
        index: index++,
      })),
    }));
  }, [catalog]);

  return (
    <FormSection title={tEntity('sections.privileges')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {groups.map((group) => (
          <div
            key={group.entity}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                flex: '0 0 180px',
                fontWeight: 600,
                color: 'rgba(0, 0, 0, 0.88)',
                paddingTop: 6,
              }}
            >
              {tEntity(`entities.${group.entity}`, { defaultValue: group.entity })}
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {group.privileges.map((entry) => (
                <div key={entry.code} style={{ minWidth: 150 }}>
                  <SelectField<AppRoleFormValues>
                    name={`privileges.${entry.index}.accessLevel`}
                    control={form.control}
                    label={tEntity(`actions.${entry.action}`, {
                      defaultValue: entry.action,
                    })}
                    options={accessOptions}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}
