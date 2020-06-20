import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
  } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router';
import { petsFixture } from './fixtures';
import { Provider } from 'react-redux';
import { removePet } from './slice';
import { renderWithProviders, screen } from '../../utils/test-utils';
import { RootState, store } from 'app/store';
import { sleep } from 'utils/sleep';
import { ViewPets } from './ViewPets';

const state: RootState = {
  pets: {
    ids: [1],
    entities: {
      '1': { id: 1, name: 'Pat', age: 7, type: 'Cat' }
    },
    hasFetched: true,
    isFetching: false,
    error: null
  }
};

// describe('view pets with mock store', () => {
//   afterEach(cleanup);

//   it('can show a loading bar', async () => {
//     renderWithProviders(<ViewPets />, { pets: { ...state.pets, isFetching: true } });
//     expect(screen.getByRole('progressbar')).toBeDefined();
//   });

//   it('can show you to add pets if there are none', async () => {
//     renderWithProviders(<ViewPets />, { pets: { ...state.pets, ids: [], entities: {} } });
//     expect(screen.getByText('No pets found. Please add one.')).toBeDefined();
//   });

//   it('can view pets', async () => {
//     renderWithProviders(<ViewPets />, { pets: { ...state.pets, hasFetched: false } });
//     expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);
//   });

//   it('allows you to delete a pet', async () => {
//     const { store } = renderWithProviders(<ViewPets />, state);
//     fireEvent.click(screen.getByTestId('delete'));

//     const actions = store.getActions();
//     expect(actions[0]).toEqual(removePet(1));
//   });
// });

describe('view pets with real store', () => {
  afterEach(cleanup);

  it('can show a loading bar and then pets', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ViewPets />
        </Router>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);
  });

  it('allows you to delete a pet', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ViewPets />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('Daisy-delete'));

    expect(screen.queryByText(petsFixture[1].name)).toBeNull();
  });
});
