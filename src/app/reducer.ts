import { AppDispatch, RootState } from './store';
import { petsReducer } from 'features/pets/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  pets: petsReducer
};
