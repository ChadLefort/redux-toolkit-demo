import configureStore, { MockStore } from 'redux-mock-store';
import React from 'react';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { act, render } from '@testing-library/react';
import { Action } from 'redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { RenderResult } from '@testing-library/react';
import {
  RootState,
  store as oldStore,
  useAppDispatch,
  useTypedSelector
  } from 'app/store';
import '@testing-library/jest-dom/extend-expect';

// jest.mock('app/store', () => ({
//   store: jest.fn(),
//   useAppDispatch: jest.fn(),
//   useTypedSelector: jest.fn()
// }));

// export const renderWithProviders = (
//   ui: React.ReactElement,
//   initialState: Partial<RootState>,
//   initialEntries?: string[],
//   initialStore?: any,
//   renderFn = render
// ) => {
//   const mockStore = configureStore<Partial<RootState>, ThunkDispatch<Partial<RootState>, unknown, Action<string>>>([
//     thunk
//   ]);
//   const store = initialStore || mockStore(initialState);

//   beforeEach(() => {
//     store.clearActions();
//   });

//   oldStore.getState = () => store.getState();

//   const mockUseSelector = useTypedSelector as jest.Mock;
//   const mockUseDispatch = useAppDispatch as jest.Mock;

//   mockUseDispatch.mockImplementation(() => store.dispatch);
//   mockUseSelector.mockImplementation((callback) => callback(store.getState()));

//   const testingNode: RenderResult & {
//     store: MockStore<Partial<RootState>>;
//     rerenderWithProviders?: (ui: React.ReactElement, newState: Partial<RootState>) => RenderResult;
//     rerender?: (ui: React.ReactElement) => any;
//   } = {
//     ...renderFn(
//       <Provider store={store}>
//         <Router initialEntries={initialEntries}>{ui}</Router>
//       </Provider>
//     ),
//     store
//   };

//   testingNode.rerenderWithProviders = (ui: React.ReactElement, newState: Partial<RootState>) =>
//     renderWithProviders(ui, newState, initialEntries, store, testingNode.rerender);

//   return testingNode;
// };

export async function actWithReturn<T = MockStore>(callback: Function) {
  let ret;

  await act(async () => {
    ret = await callback();
  });

  return (ret as unknown) as T;
}

export * from '@testing-library/react';
