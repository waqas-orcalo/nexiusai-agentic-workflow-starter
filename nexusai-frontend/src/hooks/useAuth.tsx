// useAuth stub — admin auth removed
const useAuth = () => ({
  isAuthenticated: false,
  isInitialized: true,
  isPermissions: false,
  user: null,
  product: {},
  method: 'jwt',
  login: async (_res: any) => {},
  logout: async () => {},
  setActiveProduct: async (_res: any) => {},
  setAuthLoading: (_val: boolean) => {},
  setProductSwitcherLoading: (_val: boolean) => {},
  setPermissions: () => {},
  currentPermissions: [] as string[],
});

export default useAuth;
