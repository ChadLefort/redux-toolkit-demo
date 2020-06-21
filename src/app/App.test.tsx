import React from 'react';
import { App } from './App';
import { cleanup, screen } from '@testing-library/react';
import { initialState } from 'features/pets/slice';
import { renderWithProviders } from 'utils/test-utils';

describe('app', () => {
  afterEach(cleanup);

  it('should render the app', async () => {
    renderWithProviders(<App />, { pets: initialState });

    expect(screen.getByRole('progressbar')).toBeDefined();
  });
});
