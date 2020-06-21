import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
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
const axiosMock = new MockAdapter(axios);
const error = new Error('test error');

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
  prevState = initialState;
});

describe('pets actions', () => {
  it('dipatches a success action when fetching pets', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    await store.dispatch(fetchPets());

    const actions = store.getActions();

    expect(actions[0].type).toEqual(fetchPets.pending.type);
    expect(actions[1].payload).toEqual(petsFixture);
  });

  // are these valable if using createAsyncThunk?
  // feels like we would just be testing that function and instead should focus on the results in the component
});

describe('pets reducer', () => {
  test('pets/fetchPets/pending', () => {
    const nextState = petsReducer(prevState, fetchPets.pending);

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  test('pets/fetchPets/fulfilled', () => {
    const nextState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, '')); // second param requestID?

    expect(nextState.isFetching).toBeFalsy();
    expect(Object.values(nextState.entities)).toEqual(petsFixture);
    expect(nextState.error).toBeNull();
  });

  test('pets/fetchPets/rejected', () => {
    const nextState = petsReducer(prevState, fetchPets.rejected(error, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error?.message).toEqual(error.message);
  });

  test('pets/addPet/pending', () => {
    const nextState = petsReducer(prevState, addPet.pending);

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  test('pets/addPet/fulfilled', () => {
    prevState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, ''));

    const newPet: IPet = {
      id: 4,
      name: 'PT',
      age: '12',
      type: 'Dog'
    };

    const nextState = petsReducer(prevState, addPet.fulfilled(newPet, '', newPet));

    expect(nextState.isFetching).toBeFalsy();
    expect(Object.values(nextState.entities)).toEqual(petsFixture.concat(newPet));
    expect(nextState.error).toBeNull();
  });

  test('pets/removePet/rejected', () => {
    const nextState = petsReducer(prevState, fetchPets.rejected(error, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error?.message).toEqual(error.message);
  });

  test('pets/addPet/pending', () => {
    const nextState = petsReducer(prevState, addPet.pending);

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  test('pets/removePet/fulfilled', () => {
    prevState = petsReducer(prevState, fetchPets.fulfilled(petsFixture, ''));

    const nextState = petsReducer(prevState, removePet.fulfilled(1, '', 1));

    expect(nextState.isFetching).toBeFalsy();
    expect(Object.values(nextState.entities)[0]).not.toEqual(petsFixture[0]);
    expect(nextState.error).toBeNull();
  });

  test('pets/removePet/rejected', () => {
    const nextState = petsReducer(prevState, fetchPets.rejected(error, ''));

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error?.message).toEqual(error.message);
  });

  // so on and so forth
});
