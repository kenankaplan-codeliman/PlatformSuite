import { useContext } from 'react';
import { FormModeContext, type FormModeValue } from './FormModeContext';

/**
 * Field primitifleri mod'u bu hook'tan okur — prop drilling yasak.
 */
export function useFormMode(): FormModeValue {
  const ctx = useContext(FormModeContext);
  if (!ctx) {
    return { mode: 'new', isDirty: false };
  }
  return ctx;
}
