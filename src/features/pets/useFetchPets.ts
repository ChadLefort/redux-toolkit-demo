import { fetchPets, petsAdapter } from './slice';
import { RootState, store } from 'app/store';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useEffect } from 'react';

export function useFetchPets() {
  const dispatch = useAppDispatch();
  const { hasFetched, isFetching, error } = useTypedSelector((state) => state.pets);
  const petsSelectors = petsAdapter.getSelectors<RootState>((state) => state.pets);
  const pets = petsSelectors.selectAll(store.getState());

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchPets());
    }
  }, [dispatch, hasFetched]);

  return { pets, isFetching, error, petsSelectors };
}
