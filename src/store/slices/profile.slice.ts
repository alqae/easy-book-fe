import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { ApiResponse } from '@/types/requests';
import { Status } from '@/types/enums';
import { User } from '@/types/models';
import { api } from '@/lib/api';

export interface ExampleState {
  userLogged?: User;
  status: Status;
}

const initialState: ExampleState = {
  userLogged: undefined,
  status: Status.IDLE,
};

export const fetchProfile = createAsyncThunk<ApiResponse<User>, void>(
  'profile/fetchProfile',
  async (body, { dispatch }) => dispatch(api.endpoints.getProfile.initiate(body)).unwrap(),
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(fetchProfile.rejected, (_state) => {
        const state = _state;
        state.status = Status.FAILED;
      })
      .addCase(fetchProfile.fulfilled, (_state, action) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
        state.userLogged = action.payload.data;
      });
  },
});

export const selectUserLogged = (state: RootState) => state.profile.userLogged;
export const selectStatus = (state: RootState) => state.profile.status;
export const selectIsLoading = (state: RootState) => state.profile.status === Status.LOADING;

export default profileSlice.reducer;
