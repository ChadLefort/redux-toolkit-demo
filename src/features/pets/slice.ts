import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  SerializedError
  } from '@reduxjs/toolkit';
import { IPet } from './interfaces';
import { petsFixture } from './fixtures';
import { sleep } from 'utils/sleep';

export type State = {
  hasFetched: boolean;
  isFetching: boolean;
  error: SerializedError | null;
};

export const fetchPets = createAsyncThunk('pets/fetchPets', async () => {
  await sleep(500);
  return petsFixture;
});

export const petsAdapter = createEntityAdapter<IPet>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const initialState = petsAdapter.getInitialState<State>({
  hasFetched: false,
  isFetching: false,
  error: null
});

const pets = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    addPet: petsAdapter.addOne,
    removePet: petsAdapter.removeOne,
    updatePet: petsAdapter.updateOne
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPets.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      state.hasFetched = true;
      state.isFetching = false;

      petsAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchPets.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error;
    });
  }
});

export const {
  actions: { addPet, removePet, updatePet },
  reducer: petsReducer
} = pets;
