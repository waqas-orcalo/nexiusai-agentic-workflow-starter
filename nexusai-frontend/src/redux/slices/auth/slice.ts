import { createSlice } from '@reduxjs/toolkit';

// Auth slice stub — admin removed
const authSlice = createSlice({
  name: 'auth',
  initialState: { accessToken: null as string | null },
  reducers: {
    setAuthTokens: (_state, _action) => {},
    logout: (state) => { state.accessToken = null; },
  },
});

export const { setAuthTokens, logout } = authSlice.actions;
export default authSlice.reducer;
