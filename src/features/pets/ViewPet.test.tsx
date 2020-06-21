import React from 'react';
import { cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import { fetchPets, initialState } from './slice';
import { getActionResult, renderWithProviders, screen } from '../../utils/test-utils';
import { petsFixture } from './fixtures';
import { Route } from 'react-router-dom';
import { ViewPet } from './ViewPet';

describe('view pet', () => {
  afterEach(cleanup);

  it('can show a loading bar and then a pet', async () => {
    const { store } = renderWithProviders(<Route path="/:id" component={ViewPet} />, { pets: initialState }, ['/1']);

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);

    const { type } = await getActionResult(store.dispatch);
    expect(type).toEqual(fetchPets.fulfilled.type);
  });
});
