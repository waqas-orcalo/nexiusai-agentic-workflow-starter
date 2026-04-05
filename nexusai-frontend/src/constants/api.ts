export const API_ENDPOINTS = {
  AI_MODELS: {
    LIST: '/ai-models',
    DETAIL: (id: string) => `/ai-models/${id}`,
  },
  AGENTS: {
    LIST: '/agents',
    DETAIL: (id: string) => `/agents/${id}`,
  },
};
