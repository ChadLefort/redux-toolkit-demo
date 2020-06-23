import axios, { AxiosError } from 'axios';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
  SerializedError
  } from '@reduxjs/toolkit';
import { IPet } from './interfaces';

export type State = {
  hasFetched: boolean;
  isFetching: boolean;
  error: SerializedError | null;
};

export const fetchPets = createAsyncThunk<IPet[]>('pets/fetchPets', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<IPet[]>('/pets');
    return data;
  } catch (err) {
    const error: AxiosError = err;

    if (error.response?.status === 404) {
      return rejectWithValue('pets not found');
    } else {
      throw error;
    }
  }
});

export const addPet = createAsyncThunk<IPet, IPet>('pets/addPet', async (pet) => {
  const { data } = await axios.post<IPet>('/pets', pet);
  return data;
});

export const updatePet = createAsyncThunk<IPet, IPet>('pets/updatePet', async (pet) => {
  const { data } = await axios.put<IPet>(`/pets/${pet.id}`, pet);
  return data;
});

export const removePet = createAsyncThunk<number, number>('pets/removePets', async (id) => {
  await axios.delete(`/pets/${id}`);
  return id;
});

export const petsAdapter = createEntityAdapter<IPet>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const initialState = petsAdapter.getInitialState<State>({
  hasFetched: false,
  isFetching: false,
  error: null
});

const isFetching = (state: State) => {
  state.isFetching = true;
  state.error = null;
};

const error = (
  state: State,
  action: PayloadAction<
    unknown,
    string,
    { arg: void | number | IPet; requestId: string; aborted: boolean; condition: boolean },
    SerializedError
  >
) => {
  state.isFetching = false;
  state.error = action.error;
};

const pets = createSlice({
  name: 'pets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPets.pending, isFetching);
    builder.addCase(addPet.pending, isFetching);
    builder.addCase(updatePet.pending, isFetching);
    builder.addCase(removePet.pending, isFetching);
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      state.hasFetched = true;
      state.isFetching = false;

      petsAdapter.setAll(state, action.payload);
    });
    builder.addCase(addPet.fulfilled, (state, action) => {
      state.isFetching = false;

      petsAdapter.addOne(state, action.payload);
    });
    builder.addCase(updatePet.fulfilled, (state, action) => {
      state.isFetching = false;

      petsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(removePet.fulfilled, (state, action) => {
      state.isFetching = false;

      petsAdapter.removeOne(state, action.payload);
    });
    builder.addCase(fetchPets.rejected, error);
    builder.addCase(addPet.rejected, error);
    builder.addCase(updatePet.rejected, error);
    builder.addCase(removePet.rejected, error);
  }
});

export const { reducer: petsReducer } = pets;
