import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import {
  cleanup,
  fireEvent,
  screen,
  waitForElementToBeRemoved
  } from '@testing-library/react';
import { petsFixture } from '../fixtures';
import { renderWithProviders } from 'utils/test-utils';
import { ViewPets } from '../ViewPets';

const axiosMock = new MockAdapter(axios);

describe('view pets', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(cleanup);

  it('can show a loading bar and then pets', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    renderWithProviders(<ViewPets />, { initialEntries: ['/'] });

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

  it('allows you to delete a pet', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);
    axiosMock.onDelete(`/pets/${petsFixture[1].id}`).reply(200);

    renderWithProviders(<ViewPets />, { initialEntries: ['/'] });

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    fireEvent.click(screen.getByTestId(`${petsFixture[1].name}-delete`));

    expect(screen.queryByText(petsFixture[1].name)).toBeNull();
  });
});
