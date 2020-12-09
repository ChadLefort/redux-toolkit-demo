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
import { ErrorIcon } from 'common/ErrorIcon';
import { IPet } from './interfaces';
import { PetForm } from './Form';
import { petsSelectors, updatePet } from './slice';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
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
  const { isFetching, error } = useFetchPets();
  const { id } = useParams<{ id: string }>();
  const pet = useTypedSelector((state) => petsSelectors.selectById(state, id));

  const onSubmit = (values: IPet) =>
    new Promise<void>((resolve, reject) => {
      try {
        dispatch(updatePet(values));
        history.push('/');
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

  return pet && !isFetching && !error ? (
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
  ) : error ? (
    <ErrorIcon />
  ) : (
    <Container>
      <LinearProgress />
    </Container>
  );
};
