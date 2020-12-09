import React from 'react';
import { App } from './App';
import { cleanup, render, screen } from '@testing-library/react';

describe('app', () => {
  afterEach(cleanup);

  it('should render the app', async () => {
    render(<App />);

    expect(screen.getByRole('progressbar')).toBeDefined();
  });
});
