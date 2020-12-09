import React from 'react';
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
import { postPet } from './api';
import { useHistory } from 'react-router-dom';
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

export const AddPets: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const cache = useQueryCache();
  const [addPet] = useMutation(postPet, {
    onSuccess: () => cache.invalidateQueries('pets')
  });

  const onSubmit = (values: IPet) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        await addPet(values);
        history.push('/');
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
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
