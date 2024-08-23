import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { toast } from '@/components/ui/use-toast';
import { ERequestStatus } from '@/types/enums';
import { api } from '@/lib/api';
import { AuthenticationSuccessResponse, LoginRequest, RegisterRequest } from '@/types/requests';

export interface AuthState {
  token?: string;
  status: ERequestStatus;
}

const initialState: AuthState = {
  status: ERequestStatus.IDLE,
};

export const logIn = createAsyncThunk<AuthenticationSuccessResponse, LoginRequest>(
  'auth/logIn',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.login.initiate(body)).unwrap();
    return result.data;
  },
);

export const register = createAsyncThunk<AuthenticationSuccessResponse, RegisterRequest>(
  'auth/register',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.register.initiate(body)).unwrap();
    return result.data;
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (_state) => {
        const state = _state;
        state.status = ERequestStatus.LOADING;
      })
      .addCase(register.pending, (_state) => {
        const state = _state;
        state.status = ERequestStatus.LOADING;
      })
      .addCase(logIn.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = ERequestStatus.FAILED;
        toast({ variant: 'destructive', title: 'Bad credentials' });
      })
      .addCase(register.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = ERequestStatus.FAILED;
        toast({ variant: 'destructive', title: 'Error while registering' });
      })
      .addCase(logIn.fulfilled, (_state, action) => {
        const state = _state;
        state.status = ERequestStatus.SUCCEEDED;
        state.token = action.payload.token;
      })
      .addCase(register.fulfilled, (_state, action) => {
        const state = _state;
        state.status = ERequestStatus.SUCCEEDED;
        state.token = action.payload.token;
      });
  },
});

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectToken = (state: RootState) => state.auth.token;
export const selectStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
