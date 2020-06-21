import React from 'react';
import { addPet, petsAdapter } from './slice';
import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography
  } from '@material-ui/core';
import { IPet } from './interfaces';
import { PetForm } from './Form';
import { RootState, store } from 'app/store';
import { useAppDispatch } from 'app/reducer';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(2, 0)
    }
  })
);

export const AddPets: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const petsSelectors = petsAdapter.getSelectors<RootState>((state) => state.pets);
  const pets = petsSelectors.selectTotal(store.getState());

  const onSubmit = (values: IPet) =>
    new Promise<void>((resolve) => {
      dispatch(addPet({ ...values, id: pets + 1 }));
      history.push('/');
      resolve();
    });

  return (
    <Paper className={classes.paper}>
      <Grid container justify="center" spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2">
            Add Pet
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <PetForm onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </Paper>
  );
};
