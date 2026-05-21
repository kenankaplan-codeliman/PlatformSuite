import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../../../api/httpClient";
import { entityMetadataKeys } from "../../../api/queryKeys";

export interface SetOwnerVariables {
  /** Seçilen kullanıcının (owner) id'si. */
  ownerId: string;
}

export interface UseSetOwnerArgs {
  /** Sahibi değiştirilecek kaydın id'si. */
  entityId: string;
  /** Backend CLR tip adı (entity-metadata invalidate için). */
  entityType: string;
  /** Owner atama action endpoint'i (örn. ServicePath.Account.Assign). */
  servicePath: string;
}

/**
 * Owner'ı ayrı bir action endpoint'i üzerinden set eder — save mutation'a dahil
 * DEĞİLDİR. Backend sözleşmesi tüm entity'lerde ortak: her entity controller'ında
 * `[HttpPost("assign")]` + `[PrivilegeAuthorize(...Assign)]`, body
 * `{ ids: Guid[], ownerId: Guid }`. Böylece her entity kendi yetki kontrolüyle çalışır.
 *
 * Başarıda entity-metadata sorgusu invalidate edilir → Detail sayfasındaki
 * `EntityMetadataFooter`'ın "Sahibi" alanı otomatik tazelenir.
 */
export function useSetOwner({ entityId, entityType, servicePath }: UseSetOwnerArgs) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, SetOwnerVariables>({
    mutationFn: async ({ ownerId }) => {
      await httpClient.post(servicePath, { ids: [entityId], ownerId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: entityMetadataKeys.detail(entityType, entityId),
      });
    },
  });
}
