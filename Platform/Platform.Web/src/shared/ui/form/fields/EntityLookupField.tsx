import { useCallback } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { httpClient } from '../../../api/httpClient';
import type { PagedResult } from '../../../types/Pagination';
import type { EntityReference } from '../../../types/EntityReference';
import {
  LookupField,
  type LookupFieldProps,
  type LookupSearchFn,
} from './LookupField';

export type EntityLookupFieldProps<TValues extends FieldValues> = {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  /** Backend search endpoint — `ServicePath.Account.Search` gibi. */
  servicePath: string;
} & Omit<LookupFieldProps<TValues>, 'name' | 'control' | 'searchFn'>;

/**
 * EntityReference dönen tüm search endpoint'leri için **generic lookup**.
 *
 * Backend sözleşmesi:
 *   POST {servicePath}  body: { searchText, pagination: { pageNumber, pageSize } }
 *   → PagedResult<EntityReference>
 *
 * Kullanım:
 *   <EntityLookupField
 *     name="parentAccountId"
 *     control={form.control}
 *     servicePath={ServicePath.Account.Search}
 *     initialLabel={data.parentAccountName}
 *   />
 */
export function EntityLookupField<TValues extends FieldValues>({
  servicePath,
  ...rest
}: EntityLookupFieldProps<TValues>) {
  const searchFn: LookupSearchFn = useCallback(
    async (searchText, pageNumber, pageSize) => {
      const response = await httpClient.post<PagedResult<EntityReference>>(servicePath, {
        searchText,
        pagination: { pageNumber, pageSize },
      });
      return {
        items: response.data.data.map((ref) => ({
          id: ref.id,
          label: ref.name,
          description: ref.email ?? ref.phone ?? null,
        })),
        hasMoreRecord: response.data.pagination.hasMoreRecord,
      };
    },
    [servicePath],
  );

  return <LookupField<TValues> {...rest} searchFn={searchFn} />;
}
