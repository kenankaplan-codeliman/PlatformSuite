import { createContext, useContext, type ReactNode } from 'react';

export interface AppMeta {
  logo?: ReactNode;
  appName?: string;
  appDescription?: string;
}

const AppMetaContext = createContext<AppMeta>({});

export interface AppMetaProviderProps extends AppMeta {
  children: ReactNode;
}

export function AppMetaProvider({ children, ...meta }: AppMetaProviderProps) {
  return <AppMetaContext.Provider value={meta}>{children}</AppMetaContext.Provider>;
}

export function useAppMeta(): AppMeta {
  return useContext(AppMetaContext);
}
