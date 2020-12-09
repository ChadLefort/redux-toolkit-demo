import axios from 'axios';
import { IPet } from './interfaces';

export const getPets = async () => {
  const { data } = await axios.get<IPet[]>('/pets');
  return data;
};

export const getPet = async (key: string, id: number) => {
  const { data } = await axios.get<IPet>(`/pets/${id}`);
  return data;
};

export const postPet = async (pet: IPet) => {
  const { data } = await axios.post<IPet>('/pets', pet);
  return data;
};

export const putPet = async (pet: IPet) => {
  const { data } = await axios.put<IPet>(`/pets/${pet.id}`, pet);
  return data;
};

export const deletePet = async (id: number) => {
  await axios.delete(`/pets/${id}`);
  return id;
};
