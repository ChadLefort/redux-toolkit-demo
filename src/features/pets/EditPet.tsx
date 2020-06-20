import React from 'react';
import {
  Container,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Theme,
  Typography
  } from '@material-ui/core';
import { IPet } from './interfaces';
import { PetForm } from './Form';
import { store } from 'app/store';
import { updatePet } from './slice';
import { useAppDispatch } from 'app/helpers';
import { useFetchPets } from './useFetchPets';
import { useHistory, useParams } from 'react-router-dom';

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

export const EditPet: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { petsSelectors, isFetching } = useFetchPets();
  const { id } = useParams<{ id: string }>();
  const pet = petsSelectors.selectById(store.getState(), id);

  const onSubmit = (values: IPet) =>
    new Promise<void>((resolve) => {
      dispatch(updatePet({ id: values.id, changes: values }));
      history.push('/');
      resolve();
    });

  return pet && !isFetching ? (
    <Paper className={classes.paper}>
      <Grid container justify="center" spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2">
            Edit Pet
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <PetForm initialValues={pet} onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </Paper>
  ) : (
    <Container>
      <LinearProgress />
    </Container>
  );
};
