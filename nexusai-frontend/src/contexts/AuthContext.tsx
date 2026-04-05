'use client';
import { createContext, ReactNode } from 'react';

const defaultValue = {
  isAuthenticated: false,
  isInitialized: true,
  isPermissions: false,
  user: null as any,
  product: {} as any,
  authMeLoadingState: false,
  productSwitcherLoadingState: false,
  method: 'jwt',
  login: async (_res: any) => {},
  logout: async () => {},
  setActiveProduct: async (_res: any) => {},
  setAuthLoading: (_val: boolean) => {},
  setProductSwitcherLoading: (_val: boolean) => {},
  setPermissions: () => {},
  currentPermissions: [] as string[],
};

const AuthContext = createContext(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={defaultValue}>
    {children}
  </AuthContext.Provider>
);

export { AuthContext, AuthProvider };
