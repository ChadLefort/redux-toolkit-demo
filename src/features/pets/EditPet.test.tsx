import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { actWithReturn, getActionResult, renderWithProviders } from 'utils/test-utils';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { EditPet } from './EditPet';
import { IPet } from './interfaces';
import { petsFixture } from './fixtures';
import { RootState } from 'app/store';
import { Route } from 'react-router-dom';
import { updatePet } from './slice';

const axiosMock = new MockAdapter(axios);
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
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.onGet('/pets').reply(200, petsFixture);
  });

  afterEach(cleanup);

  it('should call dispatch pets/updatePet action when form is submitted', async () => {
    const updatedPet: IPet = { id: 1, name: 'Pat', age: '8', type: 'Cat' };

    axiosMock.onPut('/pets/1').reply(200, updatedPet);

    const store = await actWithReturn(async () => {
      const { store } = renderWithProviders(<Route path="/edit/:id" component={EditPet} />, initialState, ['/edit/1']);

      fireEvent.change(screen.getByTestId('age'), { target: { value: '8' } });
      fireEvent.click(screen.getByText('Submit'));

      return store;
    });

    const { type, payload } = await getActionResult<IPet>(store.dispatch);

    expect(type).toEqual(updatePet.fulfilled.type);
    expect(payload).toEqual(updatedPet);
  });
});
