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
import { putPet } from './api';
import { useFetchPet } from './useFetchPet';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQueryCache } from 'react-query';

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
  const history = useHistory();
  const cache = useQueryCache();
  const { id } = useParams<{ id: string }>();
  const { pet, isLoading, error } = useFetchPet(id);
  const [updatePet] = useMutation(putPet, {
    onSuccess: () => cache.invalidateQueries('pets')
  });

  const onSubmit = (values: IPet) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        await updatePet(values);
        history.push('/');
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

  return pet && !isLoading && !error ? (
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
