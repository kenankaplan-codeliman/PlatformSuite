import { useCallback } from 'react';
import {
  useLocation,
  useNavigate,
  type NavigateOptions,
  type To,
} from 'react-router-dom';

/**
 * `useNavigate` sarmalayıcısı — her navigasyona mevcut konumu `state.returnUrl`
 * olarak ekler. Detail sayfası (DetailPageLayout) bu değeri okuyup "çıkış"
 * navigasyonunda (view/new'den geri, kaydet) hedefe döner.
 *
 * Liste satır tıklamaları ve "Yeni Ekle" gibi detail'e giren çağrılarda düz
 * `useNavigate` yerine bunu kullan; geri butonu filtreli listeye / linkleyen
 * sayfaya döner. Açık bir state verilirse mevcut alanlar korunur (returnUrl
 * yine de eklenir, çağıranın state'i üzerine yazar).
 */
export function useReturnNavigate() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  return useCallback(
    (to: To, options?: NavigateOptions) =>
      navigate(to, {
        ...options,
        state: {
          returnUrl: pathname + search,
          ...(options?.state as object | undefined),
        },
      }),
    [navigate, pathname, search],
  );
}
