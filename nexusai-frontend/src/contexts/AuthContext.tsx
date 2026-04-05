'use client';
import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { setAuthTokens } from '@/redux/slices/auth/slice';
import { useAppDispatch } from '@/redux/store';
import { clearApiCache } from '@/services/base-api';
import {
  getSession,
  getActiveProductSession,
  getActivePermissionsSession,
  setSession,
  setActiveProductSession,
  setActivePermissionsSession,
  setActiveAccountSession,
  isNullOrEmpty,
  isTokenValidationCheck,
  stringArraysEqual,
} from '@/utils';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isPermissions: false,
  user: null as any,
  product: {} as any,
  authMeLoadingState: false,
  productSwitcherLoadingState: false,
};

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: async (_res: any) => {},
  logout: async () => {},
  setActiveProduct: async (_res: any) => {},
  setAuthLoading: (_val: boolean) => {},
  setProductSwitcherLoading: (_val: boolean) => {},
  setPermissions: () => {},
  currentPermissions: [] as string[],
});

const handlers: Record<string, (state: any, action: any) => any> = {
  INITIALIZE: (state, action) => ({
    ...state,
    isAuthenticated: action.payload.isAuthenticated,
    isInitialized: true,
    user: action.payload.user,
  }),
  LOGIN: (state, action) => ({
    ...state,
    isAuthenticated: true,
    user: action.payload.user,
  }),
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    product: null,
    isPermissions: false,
  }),
  ACTIVE_PRODUCT: (state, action) => ({
    ...state,
    isAuthenticated: true,
    product: action.payload.product,
  }),
  INITIALIZEPERMISSIONS: (state, action) => ({
    ...state,
    isAuthenticated: action.payload.isAuthenticated,
    isPermissions: action.payload.isPermissions,
  }),
  authMeLoadingState: (state, action) => ({
    ...state,
    authMeLoadingState: action.payload,
  }),
  productSwitcherLoadingState: (state, action) => ({
    ...state,
    productSwitcherLoadingState: action.payload,
  }),
};

const reducer = (state: any, action: any) =>
  handlers[action?.type] ? handlers[action.type](state, action) : state;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [permissionsArray, setPermissionsArray] = useState<string[]>([]);
  const appDispatch = useAppDispatch();
  const dispatchClearCache = useDispatch();

  useEffect(() => {
    const initialize = () => {
      try {
        const { accessToken, refreshToken, user } = getSession();
        const product = getActiveProductSession();

        if (accessToken && isTokenValidationCheck(accessToken)) {
          dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: true, user } });
          dispatch({ type: 'ACTIVE_PRODUCT', payload: { product } });
          appDispatch(setAuthTokens({ accessToken, refreshToken }));
        } else {
          dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, user: null } });
        }
      } catch {
        dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, user: null } });
      }
    };
    initialize();
  }, [appDispatch]);

  const login = async (response: any) => {
    const { accessToken, refreshToken, user } = response?.data || response;
    setSession({ accessToken, refreshToken, user });
    appDispatch(setAuthTokens({ accessToken, refreshToken }));
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = async () => {
    setActiveProductSession(null);
    setSession(null);
    setActivePermissionsSession(null);
    setActiveAccountSession(null);
    setPermissionsArray([]);
    dispatch({ type: 'LOGOUT' });
    appDispatch({ type: 'auth/logout' });
    dispatchClearCache(clearApiCache());
  };

  const setActiveProduct = async (product: any) => {
    setActiveProductSession(product);
    dispatch({ type: 'ACTIVE_PRODUCT', payload: { product } });
  };

  const setPermissions = () => {
    dispatch({
      type: 'INITIALIZEPERMISSIONS',
      payload: { isAuthenticated: true, isPermissions: true },
    });
  };

  const setAuthLoading = (val: boolean) => {
    dispatch({ type: 'authMeLoadingState', payload: val });
  };

  const setProductSwitcherLoading = (val: boolean) => {
    dispatch({ type: 'productSwitcherLoadingState', payload: val });
  };

  const currentPermissions = !isNullOrEmpty(permissionsArray)
    ? permissionsArray
    : getActivePermissionsSession();

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        setActiveProduct,
        setPermissions,
        currentPermissions,
        setAuthLoading,
        setProductSwitcherLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
