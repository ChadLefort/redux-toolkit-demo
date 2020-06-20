import React from 'react';
import { act, render } from '@testing-library/react';
import { configureStore, Dispatch } from '@reduxjs/toolkit';
import { MemoryRouter as Router } from 'react-router-dom';
import { petsReducer } from 'features/pets/slice';
import { Provider } from 'react-redux';
import { RootState } from 'app/helpers';
import { store as origStore } from 'app/store';
import '@testing-library/jest-dom/extend-expect';

jest.mock('app/store', () => ({
  store: jest.fn()
}));

function configureTestStore(initialState: Partial<RootState> = {}) {
  const store = configureStore({ reducer: { pets: petsReducer }, preloadedState: initialState });
  const origDispatch = store.dispatch as jest.Mock;

  store.dispatch = jest.fn(origDispatch);
  origStore.getState = () => store.getState();

  return store;
}

export function renderWithProviders(
  ui: React.ReactElement,
  initialState: Partial<RootState>,
  initialEntries?: string[],
  store = configureTestStore(initialState),
  rtlRender = render
) {
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <Router initialEntries={initialEntries}>{children}</Router>
    </Provider>
  );

  return { ...rtlRender(ui, { wrapper: Wrapper }), store };
}

export async function actWithReturn<T = typeof origStore>(callback: Function) {
  let ret;

  await act(async () => {
    ret = await callback();
  });

  return (ret as unknown) as T;
}

export async function getActionResult<T = any>(dispatch: Dispatch) {
  const mockDispatch = dispatch as jest.Mock;
  return (await mockDispatch.mock.results[0].value) as { type: string; payload: T };
}

export * from '@testing-library/react';
