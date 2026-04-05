import { jwtDecode } from 'jwt-decode';

export const isNullOrEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const stringArraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
};

export const isTokenValidationCheck = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const setSession = (data: any): void => {
  if (typeof window === 'undefined') return;
  if (!data) {
    localStorage.removeItem('auth_session');
    return;
  }
  localStorage.setItem('auth_session', JSON.stringify(data));
};

export const getSession = (): any => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem('auth_session');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const setActiveProductSession = (product: any): void => {
  if (typeof window === 'undefined') return;
  if (!product) {
    localStorage.removeItem('active_product');
    return;
  }
  localStorage.setItem('active_product', JSON.stringify(product));
};

export const getActiveProductSession = (): any => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('active_product');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setActivePermissionsSession = (perms: any): void => {
  if (typeof window === 'undefined') return;
  if (!perms) {
    localStorage.removeItem('permissions');
    return;
  }
  localStorage.setItem('permissions', JSON.stringify(perms));
};

export const getActivePermissionsSession = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('permissions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setActiveAccountSession = (account: any): void => {
  if (typeof window === 'undefined') return;
  if (!account) {
    localStorage.removeItem('active_account');
    return;
  }
  localStorage.setItem('active_account', JSON.stringify(account));
};
