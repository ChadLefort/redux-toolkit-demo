import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { cleanup, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { fetchPets, initialState, removePet } from './slice';
import { getActionResult, renderWithProviders, screen } from '../../utils/test-utils';
import { IPet } from './interfaces';
import { petsFixture } from './fixtures';
import { ViewPets } from './ViewPets';

const axiosMock = new MockAdapter(axios);

describe('view pets', () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.onGet('/pets').reply(200, petsFixture);
  });

  afterEach(cleanup);

  it('can show a loading bar and then pets', async () => {
    const { store } = renderWithProviders(<ViewPets />, { pets: initialState });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);

    const { type } = await getActionResult<IPet[]>(store.dispatch);
    expect(type).toEqual(fetchPets.fulfilled.type);
  });

  it('allows you to delete a pet', async () => {
    axiosMock.onDelete(`/pets/${petsFixture[1].id}`).reply(200);

    const { store } = renderWithProviders(<ViewPets />, { pets: initialState });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    fireEvent.click(screen.getByTestId(`${petsFixture[1].name}-delete`));

    expect(screen.queryByText(petsFixture[1].name)).toBeNull();

    const { type } = await getActionResult(store.dispatch, 1);
    expect(type).toEqual(removePet.fulfilled.type);
  });
});
