import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../api/httpClient';
import { ServicePath } from '../api/servicePaths';
import { parameterKeys } from '../api/queryKeys';
import type { SelectOption } from '../ui/form/fields/SelectField';

/** `api/general-parameter/list` yanıt satırı. */
export interface GeneralParameterItem {
  code: string;
  parentCode: string | null;
  label: string;
  orderIndex: number;
}

export interface UseGeneralParametersResult {
  /** SelectField'a doğrudan verilebilir option listesi. */
  options: SelectOption<string>[];
  /** code → label çözümleyici (tablo/badge render'ı için). Bulunamazsa code döner. */
  getLabel: (code: string | null | undefined) => string;
  isLoading: boolean;
}

/**
 * Bir parametre grubunu (`parentCode`) `api/general-parameter` endpoint'inden
 * çeker; statik enum tanımlarının yerini alır. Referans verisi olduğundan
 * 5 dakika cache'lenir.
 *
 * `lang` etiket dilidir; verilmezse aktif i18n dili kullanılır. Backend o dilde
 * kayıt yoksa varsayılan dile (tr) fallback yapar. `parentCode` boşsa (ör. bağımlı
 * dropdown'da üst henüz seçilmemişse) sorgu çalışmaz ve boş liste döner.
 *
 * @example
 *   const { options, getLabel } = useGeneralParameters('LeadStatus');
 *   <SelectField options={options} ... />
 */
export function useGeneralParameters(
  parentCode: string | null | undefined,
  lang?: string,
): UseGeneralParametersResult {
  const { i18n } = useTranslation();
  const effectiveLang = (lang ?? i18n.language ?? 'tr').split('-')[0] ?? 'tr';
  const enabled = !!parentCode;

  const query = useQuery({
    queryKey: parameterKeys.list(parentCode ?? '', effectiveLang),
    queryFn: async () => {
      const response = await httpClient.post<GeneralParameterItem[]>(
        ServicePath.GeneralParameter.List,
        { parentCode, lang: effectiveLang },
      );
      return response.data;
    },
    enabled,
    staleTime: 5 * 60_000,
  });

  const items = query.data;

  const options = useMemo<SelectOption<string>[]>(
    () => (items ?? []).map((p) => ({ value: p.code, label: p.label })),
    [items],
  );

  const labelMap = useMemo(
    () => new Map((items ?? []).map((p) => [p.code, p.label])),
    [items],
  );

  const getLabel = useCallback(
    (code: string | null | undefined) => (code ? labelMap.get(code) ?? code : ''),
    [labelMap],
  );

  return { options, getLabel, isLoading: query.isLoading };
}
