import React from 'react';
import { actWithReturn, renderWithProviders } from 'utils/test-utils';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { EditPet } from './EditPet';
import { RootState } from 'app/store';
import { Route } from 'react-router-dom';
import { updatePet } from './slice';

const state: RootState = {
  pets: {
    ids: [1],
    entities: {
      '1': { id: 1, name: 'Pat', age: 7, type: 'Cat' }
    },
    hasFetched: true,
    isFetching: false,
    error: null
  }
};

describe('edit pet', () => {
  afterEach(cleanup);

  it('should call dispatch pets/updatePet action when form is submitted', async () => {
    const store = await actWithReturn(async () => {
      const { store } = renderWithProviders(<Route path="/edit/:id" component={EditPet} />, state, ['/edit/1']);

      fireEvent.change(screen.getByTestId('age'), { target: { value: 8 } });
      fireEvent.click(screen.getByText('Submit'));

      return store;
    });

    const actions = store.getActions();

    expect(actions[0].type).toEqual(updatePet.type);
    expect(actions[0].payload).toEqual({ id: 1, changes: { id: 1, name: 'Pat', age: '8', type: 'Cat' } });
  });
});
