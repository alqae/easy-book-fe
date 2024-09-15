import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

import { Status } from '@/types/enums';
import { api } from '@/lib/api';

export interface ExampleState {
  token?: string;
  status: Status;
}

const initialState: ExampleState = {
  status: Status.IDLE,
};

export const example = createAsyncThunk<void, any>(
  'example/example',
  async (body, { dispatch }) => {
    await dispatch(api.endpoints.login.initiate(body)).unwrap();
  },
);

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(example.pending, (_state) => {
        const state = _state;
        state.status = Status.LOADING;
      })
      .addCase(example.rejected, (_state) => {
        const state = _state;
        state.status = Status.FAILED;
      })
      .addCase(example.fulfilled, (_state) => {
        const state = _state;
        state.status = Status.SUCCEEDED;
      });
  },
});

export const selectStatus = (state: RootState) => state.example.status;
export const selectIsLoading = (state: RootState) => state.example.status === Status.LOADING;

export default exampleSlice.reducer;
