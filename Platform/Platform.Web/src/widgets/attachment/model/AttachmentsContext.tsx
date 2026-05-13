import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AttachmentAssociation } from '../../../entities/attachment/model/types';

/**
 * Collector pattern: AttachmentsField'lar mount'ta kendi getter fonksiyonlarını
 * Provider'a register eder. DetailPageLayout form submit'ten önce
 * getPendingAttachments() çağırır, dönen liste command payload'una eklenir.
 *
 * Form schema'sını kirletmeden form dirty guard'a katılmak için, field'lar
 * setProviderDirty(true/false) ile kendi pending durumlarını da bildirir;
 * Provider birleşik isDirty değerini expose eder.
 */

type AttachmentGetter = () => AttachmentAssociation[];

export interface AttachmentsContextValue {
  /** Tüm kayıtlı field'lardan pending association'ları topla. */
  getPendingAttachments: () => AttachmentAssociation[];
  /** Provider altındaki herhangi bir AttachmentsField pending dosya tutuyor mu? */
  isDirty: boolean;
  /** Tüm field'lardaki pending dosyaları temizler (parent save sonrası). */
  reset: () => void;

  /** Internal — AttachmentsField mount'ta çağırır. */
  registerProvider: (id: string, getter: AttachmentGetter, resetter: () => void) => void;
  /** Internal — AttachmentsField unmount'ta çağırır. */
  unregisterProvider: (id: string) => void;
  /** Internal — AttachmentsField pending count değiştiğinde bildirir. */
  setProviderDirty: (id: string, dirty: boolean) => void;
}

const AttachmentsContext = createContext<AttachmentsContextValue | null>(null);

export interface AttachmentsProviderProps {
  children: ReactNode;
}

export function AttachmentsProvider({ children }: AttachmentsProviderProps) {
  const gettersRef = useRef<Map<string, AttachmentGetter>>(new Map());
  const resettersRef = useRef<Map<string, () => void>>(new Map());
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set());

  const registerProvider = useCallback(
    (id: string, getter: AttachmentGetter, resetter: () => void) => {
      gettersRef.current.set(id, getter);
      resettersRef.current.set(id, resetter);
    },
    [],
  );

  const unregisterProvider = useCallback((id: string) => {
    gettersRef.current.delete(id);
    resettersRef.current.delete(id);
    setDirtyIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setProviderDirty = useCallback((id: string, dirty: boolean) => {
    setDirtyIds((prev) => {
      const has = prev.has(id);
      if (dirty && !has) {
        const next = new Set(prev);
        next.add(id);
        return next;
      }
      if (!dirty && has) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      return prev;
    });
  }, []);

  const getPendingAttachments = useCallback((): AttachmentAssociation[] => {
    const all: AttachmentAssociation[] = [];
    gettersRef.current.forEach((getter) => {
      all.push(...getter());
    });
    return all;
  }, []);

  const reset = useCallback(() => {
    resettersRef.current.forEach((r) => r());
  }, []);

  const value = useMemo<AttachmentsContextValue>(
    () => ({
      getPendingAttachments,
      isDirty: dirtyIds.size > 0,
      reset,
      registerProvider,
      unregisterProvider,
      setProviderDirty,
    }),
    [getPendingAttachments, dirtyIds, reset, registerProvider, unregisterProvider, setProviderDirty],
  );

  return <AttachmentsContext.Provider value={value}>{children}</AttachmentsContext.Provider>;
}

/** Provider yoksa null döner — AttachmentsField provider olmadan da liste-only modda çalışabilir. */
export function useAttachmentsCollector(): AttachmentsContextValue | null {
  return useContext(AttachmentsContext);
}
