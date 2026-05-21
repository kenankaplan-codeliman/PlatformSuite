import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { UserSwitchOutlined } from "@ant-design/icons";
import type { DetailPageAction } from "../DetailPageLayout";
import { SetOwnerModal } from "./SetOwnerModal";

export interface UseOwnerAssignActionArgs {
  /** Sahibi değiştirilecek kaydın id'si. Yoksa (new mode) action üretilmez. */
  entityId?: string;
  /** Backend CLR tip adı (örn. "Account"). */
  entityType: string;
  /** Owner atama action endpoint'i (örn. ServicePath.Account.Assign). */
  servicePath: string;
  /** Yetki yoksa action'ı gizlemek için. Varsayılan: true. */
  enabled?: boolean;
}

export interface OwnerAssignAction {
  /** DetailPageLayout `extraActions`'a eklenecek öğe; gösterilmeyecekse null. */
  action: DetailPageAction | null;
  /** Detail sayfasında render edilmesi gereken popup; gösterilmeyecekse null. */
  modal: ReactNode;
}

/**
 * Detail sayfasının view-mode actions dropdown'ına "Sahip Ata" öğesi + arama
 * popup'ı ekler. Owner set etme ayrı action endpoint'i üzerinden yapılır
 * (`useSetOwner`); save mutation'a girmez ve başarıda footer'daki Sahibi alanı
 * tazelenir.
 *
 * Her gerekli entity'nin Detail sayfasına MANUEL eklenir:
 * ```tsx
 * const owner = useOwnerAssignAction({ entityId: id, entityType: "Account", servicePath: ServicePath.Account.Assign });
 * return (
 *   <DetailPageLayout extraActions={owner.action ? [owner.action] : undefined} ...>
 *     {owner.modal}
 *     ...
 *   </DetailPageLayout>
 * );
 * ```
 */
export function useOwnerAssignAction({
  entityId,
  entityType,
  servicePath,
  enabled = true,
}: UseOwnerAssignActionArgs): OwnerAssignAction {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);

  if (!enabled || !entityId) {
    return { action: null, modal: null };
  }

  return {
    action: {
      key: "set-owner",
      label: t("actions.assignOwner", { defaultValue: "Sahip Ata" }),
      icon: <UserSwitchOutlined />,
      onClick: () => setOpen(true),
    },
    modal: (
      <SetOwnerModal
        open={open}
        onClose={() => setOpen(false)}
        entityId={entityId}
        entityType={entityType}
        servicePath={servicePath}
      />
    ),
  };
}
