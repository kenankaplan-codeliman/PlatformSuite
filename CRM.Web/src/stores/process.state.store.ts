import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
        setState: (state: StateType, title: string | null, message: string | null) =>{ 
          set({ state, title, message })
          
          const{ clearState } = get();

          if (state === StateType.Success) {
            setTimeout(() => {
                    clearState();
                  }, 1000);
          }
          else if (state === StateType.Error) {
            setTimeout(() => {
                    clearState();
                  }, 3000);
          }
        
        },
        clearState: () => set({ state: StateType.None, title: null, message: null }), 
    })
  )
);

export default useProcessState;