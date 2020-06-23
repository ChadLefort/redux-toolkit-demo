import React from 'react';
import {
  Container,
  createStyles,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Theme
  } from '@material-ui/core';
import { ErrorIcon } from 'common/ErrorIcon';
import { store } from 'app/store';
import { useFetchPets } from './useFetchPets';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2)
    },
    list: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  })
);

export const ViewPet: React.FC = () => {
  const classes = useStyles();
  const { petsSelectors, isFetching, error } = useFetchPets();
  const { id } = useParams<{ id: string }>();
  const pet = petsSelectors.selectById(store.getState(), id);

  return pet && !isFetching && !error ? (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        <ListItem>
          <ListItemText primary="Name" secondary={pet.name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Age" secondary={pet.age} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Type" secondary={pet.type} />
        </ListItem>
      </List>
    </Paper>
  ) : error ? (
    <ErrorIcon />
  ) : (
    <Container>
      <LinearProgress />
    </Container>
  );
};
