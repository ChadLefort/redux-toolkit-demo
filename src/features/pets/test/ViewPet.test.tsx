import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import { petsFixture } from '../fixtures';
import { renderWithProviders, screen } from '../../../utils/test-utils';
import { Route } from 'react-router-dom';
import { ViewPet } from '../ViewPet';

const axiosMock = new MockAdapter(axios);

describe('view pet', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(cleanup);

  it('can show a loading bar and then a pet', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    renderWithProviders(<Route path="/:id" component={ViewPet} />, {
      initialEntries: ['/1']
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText(petsFixture[0].name)).toHaveTextContent(petsFixture[0].name);
  });

  it('can show a loading bar and then an error', async () => {
    axiosMock.onGet('/pets').reply(500);

    renderWithProviders(<Route path="/:id" component={ViewPet} />, {
      initialEntries: ['/1']
    });

    expect(screen.getByRole('progressbar')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByTitle('Error')).toBeDefined();
  });
});
