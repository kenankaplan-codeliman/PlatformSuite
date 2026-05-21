import { useTranslation } from "react-i18next";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import type { DetailPageAction } from "../DetailPageLayout";
import { confirm } from "../../feedback/confirm";
import { messageBox } from "../../feedback/messageBox";
import { useSetState } from "./useSetState";

export interface UseSetStateActionArgs {
  /** Durumu değiştirilecek kaydın id'si. Yoksa (new mode) action üretilmez. */
  entityId?: string;
  /** Backend CLR tip adı (örn. "Account"). */
  entityType: string;
  /** Durum değiştirme action endpoint'i (örn. ServicePath.Account.SetState). */
  servicePath: string;
  /** Kaydın mevcut durumu — menü etiketi ve onay mesajı buna göre değişir. */
  isActive: boolean;
  /** Yetki yoksa action'ı gizlemek için. Varsayılan: true. */
  enabled?: boolean;
  /**
   * Başarı sonrası, entity-metadata invalidate'e EK olarak çalışır. Sayfa kendi
   * detail query'sini tazelemek için kullanır (menü etiketi `isActive`'e bağlı).
   */
  onSuccess?: () => void;
}

export interface SetStateAction {
  /** DetailPageLayout `extraActions`'a eklenecek öğe; gösterilmeyecekse null. */
  action: DetailPageAction | null;
}

/**
 * Detail sayfasının view-mode actions dropdown'ına "Aktifleştir"/"Pasifleştir"
 * öğesi ekler. Mevcut duruma (`isActive`) göre etiket + onay mesajı değişir;
 * onaylanınca ayrı set-state endpoint'i (`useSetState`) çağrılır — save mutation'a
 * girmez, kendi privilege'ını gerektirir, başarıda footer'daki "Aktif" tazelenir.
 *
 * Owner kontrolüyle aynı mantık; popup yerine sadece onay (`confirm`) kullanır.
 */
export function useSetStateAction({
  entityId,
  entityType,
  servicePath,
  isActive,
  enabled = true,
  onSuccess,
}: UseSetStateActionArgs): SetStateAction {
  const { t } = useTranslation("common");
  const setState = useSetState({
    entityId: entityId ?? "",
    entityType,
    servicePath,
  });

  if (!enabled || !entityId) {
    return { action: null };
  }

  const label = isActive
    ? t("actions.deactivate", { defaultValue: "Pasifleştir" })
    : t("actions.activate", { defaultValue: "Aktifleştir" });

  const run = () => {
    confirm({
      title: label,
      content: isActive
        ? t("messages.deactivateConfirm", {
            defaultValue: "Bu kayıt pasifleştirilsin mi?",
          })
        : t("messages.activateConfirm", {
            defaultValue: "Bu kayıt aktifleştirilsin mi?",
          }),
      okText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
      danger: isActive,
      onOk: async () => {
        try {
          await setState.mutateAsync({ isActive: !isActive });
          messageBox.success(
            t("messages.setStateSuccess", { defaultValue: "Durum güncellendi." }),
          );
          onSuccess?.();
        } catch {
          messageBox.error(t("messages.unexpectedError"));
        }
      },
    });
  };

  return {
    action: {
      key: "set-state",
      label,
      icon: isActive ? <StopOutlined /> : <CheckCircleOutlined />,
      danger: isActive,
      onClick: run,
    },
  };
}
