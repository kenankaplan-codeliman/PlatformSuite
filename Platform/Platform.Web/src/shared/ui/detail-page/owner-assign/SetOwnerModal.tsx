import { useTranslation } from "react-i18next";
import { confirm } from "../../feedback/confirm";
import { messageBox } from "../../feedback/messageBox";
import { SearchModal } from "../../form/fields/SearchModal";
import { ServicePath } from "../../../api/servicePaths";
import type { EntityReference } from "../../../types/EntityReference";
import { useSetOwner } from "./useSetOwner";

export interface SetOwnerModalProps {
  open: boolean;
  onClose: () => void;
  /** Sahibi değiştirilecek kaydın id'si. */
  entityId: string;
  /** Backend CLR tip adı (entity-metadata invalidate için). */
  entityType: string;
  /** Owner atama action endpoint'i (örn. ServicePath.Account.Assign). */
  servicePath: string;
}

/** Owner aramasının kaynağı — footer'ın "Sahibi" alanıyla aynı (kullanıcı). */
const USER_ENTITY_TYPE = "AuthUser";

/**
 * Kullanıcı (owner) seçimi için arama popup'ı. EntityLookupField'ın kullandığı
 * `SearchModal`'ı tekrar kullanır; tek-seçim modunda kullanıcı seçilince
 * `useSetOwner` ile ayrı action endpoint'ine `EntityReference.id` gönderilir.
 */
export function SetOwnerModal({
  open,
  onClose,
  entityId,
  entityType,
  servicePath,
}: SetOwnerModalProps) {
  const { t } = useTranslation("common");
  const setOwner = useSetOwner({ entityId, entityType, servicePath });

  // Kayıt seçimi doğrudan servise gitmez; önce atanacak kullanıcının adıyla
  // onay sorulur. Onaylanırsa ayrı owner-assign endpoint'i çağrılır.
  const handleSelect = (ref: EntityReference) => {
    confirm({
      title: t("actions.assignOwner", { defaultValue: "Sahip Ata" }),
      content: t("messages.assignOwnerConfirm", {
        name: ref.name,
        defaultValue: `"${ref.name}" bu kaydın sahibi olarak atansın mı?`,
      }),
      okText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
      onOk: async () => {
        try {
          await setOwner.mutateAsync({ ownerId: ref.id });
          messageBox.success(
            t("messages.assignOwnerSuccess", { defaultValue: "Sahip güncellendi." }),
          );
          onClose();
        } catch {
          messageBox.error(t("messages.unexpectedError"));
        }
      },
    });
  };

  return (
    <SearchModal
      open={open}
      onClose={onClose}
      onSelect={handleSelect}
      title={t("actions.assignOwner", { defaultValue: "Sahip Ata" })}
      entityOptions={[
        {
          entityType: USER_ENTITY_TYPE,
          servicePath: ServicePath.User.Search,
          label: t("entities.user"),
        },
      ]}
    />
  );
}
