import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { toast } from '@/components/ui/use-toast';
import { fetchProfile } from './profile.slice';
import { Status } from '@/types/enums';
import { api } from '@/lib/api';
import {
  ApiResponse,
  AuthenticationSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/requests';

export interface AuthState {
  token?: string;
  status: Status;
}

const initialState: AuthState = {
  status: Status.IDLE,
};

export const logIn = createAsyncThunk<AuthenticationSuccessResponse, LoginRequest>(
  'auth/logIn',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.login.initiate(body)).unwrap();
    toast({ variant: 'success', title: result.message });
    localStorage.setItem('accessToken', result.data.token);
    dispatch(fetchProfile());
    return result.data;
  },
);

export const register = createAsyncThunk<AuthenticationSuccessResponse, RegisterRequest>(
  'auth/register',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.register.initiate(body)).unwrap();
    toast({ variant: 'success', title: result.message });
    return result.data;
  },
);

export const forgotPassword = createAsyncThunk<ApiResponse, ForgotPasswordRequest>(
  'auth/forgotPassword',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.forgotPassword.initiate(body)).unwrap();
    toast({ variant: 'success', title: result.message });
    return result;
  },
);

export const resetPassword = createAsyncThunk<ApiResponse, ResetPasswordRequest>(
  'auth/resetPassword',
  async (body, { dispatch }) => {
    const result = await dispatch(api.endpoints.resetPassword.initiate(body)).unwrap();
    toast({ variant: 'success', title: 'Password changed', description: result.message });
    return result;
  },
);

export const refreshToken = createAsyncThunk<void, void>(
  'auth/refreshToken',
  async (_, { dispatch }) => {
    const result = await dispatch(api.endpoints.refreshToken.initiate()).unwrap();
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    dispatch(fetchProfile());
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearToken: (state) => ({ ...state, token: undefined }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(register.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(forgotPassword.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(resetPassword.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(logIn.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = Status.FAILED;
      })
      .addCase(forgotPassword.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = Status.FAILED;
      })
      .addCase(resetPassword.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = Status.FAILED;
      })
      .addCase(register.rejected, (_state) => {
        const state = _state;
        state.token = undefined;
        state.status = Status.FAILED;
      })
      .addCase(logIn.fulfilled, (_state, action) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
        state.token = action.payload.token;
      })
      .addCase(register.fulfilled, (_state) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
      })
      .addCase(forgotPassword.fulfilled, (_state) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
      })
      .addCase(resetPassword.fulfilled, (_state) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
      });
  },
});

export const logOut = createAsyncThunk('auth/logOut', async (_, { dispatch }) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  dispatch(authSlice.actions.clearToken());
});

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectToken = (state: RootState) => state.auth.token;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectIsLoading = (state: RootState) => state.auth.status === Status.LOADING;

export default authSlice.reducer;
