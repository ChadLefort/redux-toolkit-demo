import React from 'react';
import { actWithReturn, renderWithProviders } from 'utils/test-utils';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { EditPet } from './EditPet';
import { RootState } from 'app/helpers';
import { Route } from 'react-router-dom';
import { updatePet } from './slice';

const initialState: Partial<RootState> = {
  pets: {
    ids: [1],
    entities: {
      '1': { id: 1, name: 'Pat', age: '7', type: 'Cat' }
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
      const { store } = renderWithProviders(<Route path="/edit/:id" component={EditPet} />, initialState, ['/edit/1']);

      fireEvent.change(screen.getByTestId('age'), { target: { value: 8 } });
      fireEvent.click(screen.getByText('Submit'));

      return store;
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      updatePet({ id: 1, changes: { id: 1, name: 'Pat', age: '8', type: 'Cat' } })
    );
  });
});
