import configureStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  addPet,
  fetchPets,
  initialState,
  petsReducer,
  removePet
  } from './slice';
import { IPet } from './interfaces';
import { petsFixture } from './fixtures';
import { RootState } from 'app/store';

const mockStore = configureStore<RootState, ThunkDispatch<RootState, unknown, Action<string>>>([thunk]);
const store = mockStore({ pets: initialState });
let prevState: typeof initialState;

beforeEach(() => {
  store.clearActions();
  prevState = initialState;
});

describe('pets actions', () => {
  it('dipatches a success action when fetching pets', async () => {
    await store.dispatch(fetchPets());

    const actions = store.getActions();

    expect(actions[0].type).toEqual(fetchPets.pending.type);
    expect(actions[1].payload).toEqual(petsFixture);
  });

  // are these valable if using createAsyncThunk?
  // feels like we would just be testing that function and instead should focus on the results in the component
});

describe('pets reducer', () => {
  it('pets/fetchPets/pending', () => {
    const nextState = petsReducer(prevState, fetchPets.pending);

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('pets/fetchPets/fulfilled', () => {
    const nextState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, '')); // second param requestID?

    expect(nextState.isFetching).toBeFalsy();
    expect(Object.values(nextState.entities)).toEqual(petsFixture);
    expect(nextState.error).toBeNull();
  });

  it('pets/fetchPets/rejected', () => {
    const error = new Error('test error');
    const nextState = petsReducer(prevState, fetchPets.rejected(error, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error?.message).toEqual(error.message);
  });

  it('pets/addPet', () => {
    prevState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, ''));

    const newPet: IPet = {
      id: 4,
      name: 'PT',
      age: 12,
      type: 'Dog'
    };

    const nextState = petsReducer(prevState, addPet(newPet));

    expect(Object.values(nextState.entities)).toEqual(petsFixture.concat(newPet));
  });

  it('pets/removePet', () => {
    prevState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, ''));

    const nextState = petsReducer(prevState, removePet(1));

    expect(Object.values(nextState.entities)[0]).not.toEqual(petsFixture[0]);
  });

  // so on and so forth
});
