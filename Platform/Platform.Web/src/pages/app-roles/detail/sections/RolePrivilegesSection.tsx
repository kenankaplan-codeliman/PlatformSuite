import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSection } from "../../../../shared/ui/form/FormSection";
import {
  SelectField,
  type SelectOption,
} from "../../../../shared/ui/form/fields/SelectField";
import { useEnumTranslation } from "../../../../shared/lib/i18n/enum";
import type {
  AppRoleFormValues,
  PrivilegeCatalogGroup,
} from "../../../../entities/app-role/model/types";
import { ACCESS_LEVELS } from "../../../../entities/app-role/lib/privilegeMatrix";

interface RolePrivilegesSectionProps {
  catalog: PrivilegeCatalogGroup[];
}

/**
 * Kolon sıralaması için YALNIZCA görsel ipucu — hangi privilege'ların var olduğunu
 * BELİRLEMEZ (o tamamen dinamik, auth_privilege tablosundan gelir). Kolonlar önce
 * "kaç entity'de geçtiği"ne (yaygınlık) göre sıralanır; eşitlikte bilinen CRUD
 * eylemleri bu sırayla öne alınır, geri kalanı görülme sırasına düşer. Listede
 * olmayan yeni eylemler de otomatik kolon olur (yaygınlığına göre yerleşir).
 */
const COMMON_ACTION_ORDER = [
  "Read",
  "Create",
  "Update",
  "Delete",
  "UpdateStatus",
  "Assign",
  "State",
  "Use",
];

/**
 * Rolün privilege'larını matris/tablo olarak düzenletir: satır başlarında entity
 * adı, kolonlarda eylemler (Read/Create/Update...). Her hücre o entity-eylem
 * çiftinin erişim seviyesi seçimidir (None/User/Organization/All). Görünür/
 * düzenlenebilir kararı `SelectField` mode-aware olduğundan view modunda otomatik
 * salt-okunur.
 *
 * Form'un `privileges` dizisi katalog sırasıyla doldurulduğu için (bkz.
 * buildPrivilegeFormList), dizi index'i = katalog pozisyonu; binding buna dayanır.
 */
export function RolePrivilegesSection({ catalog }: RolePrivilegesSectionProps) {
  const form = useFormContext<AppRoleFormValues>();
  const { t: tEntity } = useTranslation("entity.app-role");
  const tAccess = useEnumTranslation("accessLevel");

  const accessOptions = useMemo<SelectOption[]>(
    () =>
      ACCESS_LEVELS.map((level) => ({ value: level, label: tAccess(level) })),
    [tAccess],
  );

  // Katalog gruplarını form dizisindeki düz index'leriyle eşleştir ve her grubu
  // action -> index sözlüğüne çevir (matris hücrelerinde hızlı erişim için).
  const rows = useMemo(() => {
    let index = 0;
    return catalog.map((group) => {
      const byAction: Record<string, number> = {};
      group.privileges.forEach((entry) => {
        byAction[entry.action] = index++;
      });
      return { entity: group.entity, byAction };
    });
  }, [catalog]);

  // Kolonları katalogtan dinamik türet: önce yaygınlık (kaç entity'de geçtiği),
  // eşitlikte bilinen CRUD sırası (COMMON_ACTION_ORDER), sonra ilk görülme sırası.
  const actions = useMemo(() => {
    const freq = new Map<string, number>();
    const firstSeen = new Map<string, number>();
    let seq = 0;
    catalog.forEach((group) =>
      group.privileges.forEach((entry) => {
        freq.set(entry.action, (freq.get(entry.action) ?? 0) + 1);
        if (!firstSeen.has(entry.action)) firstSeen.set(entry.action, seq++);
      }),
    );
    const rank = (a: string) => {
      const i = COMMON_ACTION_ORDER.indexOf(a);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...freq.keys()].sort(
      (a, b) =>
        freq.get(b)! - freq.get(a)! ||
        rank(a) - rank(b) ||
        firstSeen.get(a)! - firstSeen.get(b)!,
    );
  }, [catalog]);

  // 1. kolon entity adı, ardından her eylem için eşit genişlikte kolon.
  const gridTemplateColumns = `minmax(160px, 1.4fr) repeat(${actions.length}, minmax(120px, 1fr))`;
  const minWidth = 160 + actions.length * 130;

  return (
    <FormSection title={tEntity("sections.privileges")} flush>
      <div className="privilege-matrix-scroll">
        <div className="privilege-matrix" style={{ minWidth }}>
          <div
            className="privilege-matrix-row privilege-matrix-header"
            style={{ gridTemplateColumns }}
          >
            <div aria-hidden />

            {actions.map((action) => (
              <div key={action} className="privilege-matrix-cell">
                {tEntity(`actions.${action}`, { defaultValue: action })}
              </div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.entity}
              className="privilege-matrix-row"
              style={{ gridTemplateColumns }}
            >
              <div className="privilege-matrix-entity">
                {tEntity(`entities.${row.entity}`, {
                  defaultValue: row.entity,
                })}
              </div>
              {actions.map((action) => {
                const index = row.byAction[action];
                return (
                  <div key={action} className="privilege-matrix-cell">
                    {index === undefined ? (
                      <span className="privilege-matrix-empty">—</span>
                    ) : (
                      <SelectField<AppRoleFormValues>
                        name={`privileges.${index}.accessLevel`}
                        control={form.control}
                        options={accessOptions}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  );
}
