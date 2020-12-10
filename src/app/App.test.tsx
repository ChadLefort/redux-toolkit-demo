import React from 'react';
import { App } from './App';
import { cleanup, render, screen } from '@testing-library/react';
import { queryCache } from 'utils/test-utils';

describe('app', () => {
  beforeEach(() => queryCache.clear());

  afterEach(cleanup);

  it('should render the app', async () => {
    render(<App />);

    expect(screen.getByRole('progressbar')).toBeDefined();
  });
});
