import React from 'react';
import {
  makeStyles,
  Paper,
  createStyles,
  Theme,
  Container,
  LinearProgress,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { store } from 'app/store';
import { useParams } from 'react-router-dom';
import { useFetchPets } from './useFetchPets';

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
  const { petsSelectors, isFetching } = useFetchPets();
  const { id } = useParams<{ id: string }>();
  const pet = petsSelectors.selectById(store.getState(), id);

  return pet && !isFetching ? (
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
  ) : (
    <Container>
      <LinearProgress />
    </Container>
  );
};
