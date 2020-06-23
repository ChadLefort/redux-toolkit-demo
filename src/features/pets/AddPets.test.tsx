import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { actWithReturn, getActionResult, renderWithProviders } from 'utils/test-utils';
import { addPet, initialState } from './slice';
import { AddPets } from './AddPets';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { IPet } from './interfaces';

const axiosMock = new MockAdapter(axios);

describe('add pets', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(cleanup);

  it('should call dispatch pets/addPet action when form is submitted', async () => {
    const newPet: IPet = { id: 1, name: 'Pat', age: '7', type: 'Cat' };

    axiosMock.onPost('/pets').reply(200, newPet);

    const store = await actWithReturn(async () => {
      const { store } = renderWithProviders(<AddPets />, { initialState: { pets: initialState } });

      fireEvent.change(screen.getByTestId('name'), { target: { value: 'Pat' } });
      fireEvent.change(screen.getByTestId('age'), { target: { value: '7' } });
      fireEvent.change(screen.getByTestId('type'), { target: { value: 'Cat' } });
      fireEvent.click(screen.getByText('Submit'));

      return store;
    });

    const { type, payload } = await getActionResult(store.dispatch);

    expect(type).toEqual(addPet.fulfilled.type);
    expect(payload).toEqual(newPet);
  });
});
