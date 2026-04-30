import { createContext, type ReactNode } from 'react';
import type { FormMode } from '../../types/FormMode';

/**
 * Client_Architecture §8 — FormModeProvider.
 * Field primitifleri `useFormMode()` ile mod'u okur; prop drilling yasak.
 */
export interface FormModeValue {
  mode: FormMode;
  isDirty: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FormModeContext = createContext<FormModeValue | null>(null);

export interface FormModeProviderProps {
  mode: FormMode;
  isDirty?: boolean;
  children: ReactNode;
}

export function FormModeProvider({ mode, isDirty = false, children }: FormModeProviderProps) {
  return (
    <FormModeContext.Provider value={{ mode, isDirty }}>{children}</FormModeContext.Provider>
  );
}
