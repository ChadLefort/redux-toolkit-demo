import React from 'react';
import { cleanup, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { fetchPets, initialState, removePet } from './slice';
import { getActionResult, renderWithProviders, screen } from '../../utils/test-utils';
import { petsFixture } from './fixtures';
import { ViewPets } from './ViewPets';

describe('view pets with real store', () => {
  afterEach(cleanup);

  it('can show a loading bar and then pets', async () => {
    const { store } = renderWithProviders(<ViewPets />, { pets: initialState });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);

    const { type } = await getActionResult(store.dispatch);
    expect(type).toEqual(fetchPets.fulfilled.type);
  });

  it('allows you to delete a pet', async () => {
    const { store } = renderWithProviders(<ViewPets />, { pets: initialState });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    fireEvent.click(screen.getByTestId('Daisy-delete'));

    expect(screen.queryByText(petsFixture[1].name)).toBeNull();
    expect(store.dispatch).toHaveBeenCalledWith(removePet(2));
  });
});
