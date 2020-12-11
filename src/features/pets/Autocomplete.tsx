import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
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
import { useHistory } from 'react-router-dom';

const petSubject$ = new BehaviorSubject('');

type Option = { value: number; label: string };

export const Autocomplete: React.FC = () => {
  const history = useHistory();
  const [value, setValue] = React.useState<Option | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Option[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState();

  useEffect(() => {
    const subscription = petSubject$
      .pipe(
        debounceTime(500),
        filter((value) => value.length >= 2),
        map((value) => `/pets?q=${value}`),
        switchMap((url) => {
          setIsLoading(true);
          return ajax(url);
        }),
        map(({ response }: { response: IPet[] }) => {
          setIsLoading(false);
          return response.map((pet) => ({ value: pet.id, label: pet.name }));
        })
      )
      .subscribe(
        (suggestions) => setSuggestions(suggestions),
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      );

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (_event: React.ChangeEvent<{}>, option: Option | null) => {
    setValue(value);
    option && history.push(`/${option.value}`);
  };

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
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Pets..."
          margin="normal"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading && !error ? (
                  <CircularProgress color="inherit" size={20} />
                ) : error ? (
                  <ErrorOutlineIcon fontSize="large" titleAccess="Error" />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
};
