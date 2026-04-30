import { useEffect, useState } from 'react';

/**
 * Girilen değerin `delay` ms sonrası sürümünü döner. Hızlı değişimlerde yalnızca son değer kalıcıdır.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
