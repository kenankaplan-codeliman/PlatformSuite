import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../../../api/httpClient";
import { entityMetadataKeys } from "../../../api/queryKeys";

export interface SetStateVariables {
  /** Kaydın yeni durumu. */
  isActive: boolean;
}

export interface UseSetStateArgs {
  /** Durumu değiştirilecek kaydın id'si. */
  entityId: string;
  /** Backend CLR tip adı (entity-metadata invalidate için). */
  entityType: string;
  /** Durum değiştirme action endpoint'i (örn. ServicePath.Account.SetState). */
  servicePath: string;
}

/**
 * Kaydın aktif/pasif durumunu ayrı bir action endpoint'i üzerinden set eder —
 * save mutation'a dahil DEĞİLDİR ve set-state KENDİ privilege'ını gerektirir
 * (her entity controller'ında `[HttpPost("set-state")]` + `[PrivilegeAuthorize(...State)]`,
 * body `{ ids: Guid[], isActive: bool }`).
 *
 * Başarıda entity-metadata sorgusu invalidate edilir → `EntityMetadataFooter`'ın
 * "Aktif" alanı tazelenir.
 */
export function useSetState({ entityId, entityType, servicePath }: UseSetStateArgs) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, SetStateVariables>({
    mutationFn: async ({ isActive }) => {
      await httpClient.post(servicePath, { ids: [entityId], isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: entityMetadataKeys.detail(entityType, entityId),
      });
    },
  });
}
