import React from 'react';
import { createMemoryHistory } from 'history';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

type Params = {
  initialEntries?: string[];
} & RenderOptions;

export const queryCache = new QueryCache({ defaultConfig: { queries: { retry: 0 } } });

export function renderWithProviders(ui: React.ReactElement, { initialEntries, ...renderOptions }: Params) {
  const history = createMemoryHistory({ initialEntries });
  const Wrapper: React.FC = ({ children }) => (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Router history={history}>{children}</Router>
    </ReactQueryCacheProvider>
  );

  return { ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }), history };
}

export * from '@testing-library/react';
