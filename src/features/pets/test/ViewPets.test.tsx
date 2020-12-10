import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { cleanup, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { petsFixture } from '../fixtures';
import { queryCache, renderWithProviders } from 'utils/test-utils';
import { ViewPets } from '../ViewPets';

const axiosMock = new MockAdapter(axios);

describe('view pets', () => {
  beforeEach(() => {
    axiosMock.reset();
    queryCache.clear();
  });

  afterEach(cleanup);

  it('can show a loading bar and then pets', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    renderWithProviders(<ViewPets />, { initialEntries: ['/'] });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);
  });

  it('can show a loading bar and an error icon', async () => {
    axiosMock.onGet('/pets').reply(500);

    renderWithProviders(<ViewPets />, { initialEntries: ['/'] });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByTitle('Error')).toBeDefined();
  });
});
