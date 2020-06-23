import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import { fetchPets, initialState } from './slice';
import { getActionResult, renderWithProviders, screen } from '../../utils/test-utils';
import { petsFixture } from './fixtures';
import { Route } from 'react-router-dom';
import { ViewPet } from './ViewPet';

const axiosMock = new MockAdapter(axios);

describe('view pet', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(cleanup);

  it('can show a loading bar and then a pet', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    const { store } = renderWithProviders(<Route path="/:id" component={ViewPet} />, {
      initialState: { pets: initialState },
      initialEntries: ['/1']
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);

    const { type } = await getActionResult(store.dispatch);
    expect(type).toEqual(fetchPets.fulfilled.type);
  });
});
