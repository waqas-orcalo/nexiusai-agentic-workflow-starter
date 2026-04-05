// Auth service removed — no admin authentication
export const useLoginMutation = () => [async () => {}, { isLoading: false }] as const;
export const useRegisterMutation = () => [async () => {}, { isLoading: false }] as const;
export const useGetAuthMeQuery = () => ({ data: null, isLoading: false });
