import { configureStore } from '@reduxjs/toolkit';
import { petsReducer } from 'features/pets/slice';

export const reducer = {
  pets: petsReducer
};

export const store = configureStore({ reducer });
