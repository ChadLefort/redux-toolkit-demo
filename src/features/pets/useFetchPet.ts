import { getPet } from './api';
import { useQuery } from 'react-query';

export function useFetchPet(id: string) {
  const { data: pet, isLoading, error } = useQuery(['pet', id], getPet);

  return { pet, isLoading, error };
}
