import React from 'react';
import { petsFixture } from './fixtures';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { store } from 'app/store';
import { useFetchPets } from './useFetchPets';

describe('useFetchPets hook', () => {
  it('calls dispatch and retrieves pets', async () => {
    const wrapper: React.FC = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result, waitForNextUpdate } = renderHook(() => useFetchPets(), { wrapper });

    expect(result.current.isFetching).toBeTruthy();
    expect(result.current.pets).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.isFetching).toBeFalsy();
    expect(Object.values(result.current.pets)).toEqual(petsFixture.sort((a, b) => a.name.localeCompare(b.name)));
  });
});
