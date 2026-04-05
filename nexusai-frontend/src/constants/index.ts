export const ROUTES = {
  PUBLIC: {
    HOME: '/home',
    MARKETPLACE: '/marketplace',
    CHAT_HUB: '/chat-hub',
    AGENTS: '/agents',
    DISCOVER_NEW: '/discover-new',
    SIGN_IN: '/sign-in',
  },
};

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
