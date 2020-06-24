import { PayloadAction, SerializedError } from '@reduxjs/toolkit';

export type State = {
  hasFetched: boolean;
  isFetching: boolean;
  error: SerializedError | null;
};

export const isFetching = <T extends State>(state: T) => {
  state.isFetching = true;
  state.error = null;
};

export const error = <T>(
  state: State,
  action: PayloadAction<
    unknown,
    string,
    { arg: T; requestId: string; aborted: boolean; condition: boolean },
    SerializedError
  >
) => {
  state.isFetching = false;
  state.error = action.error;
};
