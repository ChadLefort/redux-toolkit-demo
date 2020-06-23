import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HooksWrapper } from 'utils/test-utils';
import { petsFixture } from '../fixtures';
import { renderHook } from '@testing-library/react-hooks';
import { useFetchPets } from '../useFetchPets';

const axiosMock = new MockAdapter(axios);

describe('useFetchPets hook', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  it('calls dispatch and retrieves pets', async () => {
    axiosMock.onGet('/pets').reply(200, petsFixture);

    const { result, waitForNextUpdate } = renderHook(() => useFetchPets(), { wrapper: HooksWrapper });

    expect(result.current.isFetching).toBeTruthy();
    expect(result.current.pets).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.isFetching).toBeFalsy();
    expect(Object.values(result.current.pets)).toEqual(petsFixture.sort((a, b) => a.name.localeCompare(b.name)));
  });
});
