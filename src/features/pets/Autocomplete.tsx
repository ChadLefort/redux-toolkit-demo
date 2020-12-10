import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { ajax } from 'rxjs/ajax';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  switchMap
  } from 'rxjs/operators';
import { IPet } from 'features/pets/interfaces';

const petSubject$ = new BehaviorSubject('');

type Option = { value: number; label: string };

export const Autocomplete: React.FC = () => {
  const [value, setValue] = React.useState<Option | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Option[]>([]);

  useEffect(() => {
    const subscription = petSubject$
      .pipe(
        debounceTime(500),
        filter((value) => value.length >= 2),
        map((value) => `/pets?q=${value}`),
        switchMap((url) => ajax(url)),
        map(({ response }: { response: IPet[] }) => response.map((pet) => ({ value: pet.id, label: pet.name })))
      )
      .subscribe(
        (suggestions) => setSuggestions(suggestions),
        (error) => console.error(error)
      );

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (_event: React.ChangeEvent<{}>, value: Option | null) => setValue(value);

  const handleInputChange = (_event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);
    petSubject$.next(value);
  };

  return (
    <MuiAutocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={suggestions}
      getOptionLabel={(option) => option.label}
      getOptionSelected={(option, value) => option.value === value.value}
      renderInput={(params) => <TextField {...params} label="Pets" margin="normal" variant="outlined" />}
    />
  );
};
