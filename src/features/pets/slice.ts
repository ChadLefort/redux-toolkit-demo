import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { error, isFetching, State } from 'common/slice';
import { IPet } from './interfaces';
import { RootState } from 'app/store';

export const fetchPets = createAsyncThunk<
  IPet[],
  void,
  {
    rejectValue: string;
  }
>('pets/fetchPets', async (_, { rejectWithValue }) => {
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

export const addPet = createAsyncThunk('pets/addPet', async (pet: IPet) => {
  const { data } = await axios.post<IPet>('/pets', pet);
  return data;
});

export const updatePet = createAsyncThunk('pets/updatePet', async (pet: IPet) => {
  const { data } = await axios.put<IPet>(`/pets/${pet.id}`, pet);
  return data;
});

export const removePet = createAsyncThunk('pets/removePets', async (id: number) => {
  await axios.delete(`/pets/${id}`);
  return id;
});

export const petsAdapter = createEntityAdapter<IPet>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const petsSelectors = petsAdapter.getSelectors<RootState>((state) => state.pets);

export const initialState = petsAdapter.getInitialState<State>({
  hasFetched: false,
  isFetching: false,
  error: null
});

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
