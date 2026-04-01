import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Modül düzeyinde tutulur — store dışında yönetilmesi gerekiyor çünkü
// Zustand state'i serialize edilebilir olmak zorunda (setTimeout ID değil)
let _autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

export const StateType = {
  None: 0,
  Loading: 1,
  Success: 2,
  Error: 3,
} as const;

export type StateType = typeof StateType[keyof typeof StateType];

export interface ProcessState {
  state: StateType;

  title: string | null;
  message: string | null;

  setState: (state: StateType, title: string | null, message: string | null) => void;
  clearState: () => void;
}

export const useProcessState = create<ProcessState>()(
  devtools(
    (set,get) => ({
        state: StateType.None,
        title: null,
        message: null,

        //Actions
        setState: (state: StateType, title: string | null, message: string | null) => {
          // Önceki timer'ı iptal et — yeni state geldiğinde eski timer tetiklenmemeli
          if (_autoCloseTimer !== null) {
            clearTimeout(_autoCloseTimer);
            _autoCloseTimer = null;
          }

          set({ state, title, message });

          const { clearState } = get();

          if (state === StateType.Success) {
            _autoCloseTimer = setTimeout(() => { _autoCloseTimer = null; clearState(); }, 1000);
          } else if (state === StateType.Error) {
            _autoCloseTimer = setTimeout(() => { _autoCloseTimer = null; clearState(); }, 3000);
          }
        },
        clearState: () => {
          if (_autoCloseTimer !== null) {
            clearTimeout(_autoCloseTimer);
            _autoCloseTimer = null;
          }
          set({ state: StateType.None, title: null, message: null });
        },
    })
  )
);

export default useProcessState;