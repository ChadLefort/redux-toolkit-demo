import React from 'react';
import { actWithReturn, renderWithProviders } from 'utils/test-utils';
import { addPet, initialState } from './slice';
import { AddPets } from './AddPets';
import { cleanup, fireEvent, screen } from '@testing-library/react';

describe('add pets', () => {
  afterEach(cleanup);

  it('should call dispatch pets/addPet action when form is submitted', async () => {
    const store = await actWithReturn(async () => {
      const { store } = renderWithProviders(<AddPets />, { pets: initialState });

      fireEvent.change(screen.getByTestId('name'), { target: { value: 'Pat' } });
      fireEvent.change(screen.getByTestId('age'), { target: { value: 7 } });
      fireEvent.change(screen.getByTestId('type'), { target: { value: 'Cat' } });
      fireEvent.click(screen.getByText('Submit'));

      return store;
    });

    const actions = store.getActions();

    expect(actions[0].type).toEqual(addPet.type);
    expect(actions[0].payload).toEqual({ id: 1, name: 'Pat', age: '7', type: 'Cat' });
  });
});
