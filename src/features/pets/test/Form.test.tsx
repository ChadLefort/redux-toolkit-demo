import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen
  } from '@testing-library/react';
import { PetForm } from '../Form';

describe('pets form', () => {
  afterEach(cleanup);

  it('should call onSubmit when form is submitted', async () => {
    const onSubmit = jest.fn();

    await act(async () => {
      render(<PetForm onSubmit={onSubmit} />);

      fireEvent.change(screen.getByTestId('name'), { target: { value: 'Pat' } });
      fireEvent.change(screen.getByTestId('age'), { target: { value: 7 } });
      fireEvent.change(screen.getByTestId('type'), { target: { value: 'Cat' } });
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Pat', age: '7', type: 'Cat' });
  });
});
