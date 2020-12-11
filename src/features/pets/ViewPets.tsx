import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { Autocomplete } from 'features/pets/Autocomplete';
import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  IconButton,
  LinearProgress,
  Link as MuiLink,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography
  } from '@material-ui/core';
import { deletePet, getPets } from './api';
import { ErrorIcon } from 'common/ErrorIcon';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryCache } from 'react-query';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650
    },
    paper: {
      padding: theme.spacing(2)
    },
    item: {
      display: 'flex',
      justifyContent: 'center'
    }
  })
);

export const ViewPets: React.FC = () => {
  const classes = useStyles();
  const cache = useQueryCache();
  const { data: pets, isLoading, error } = useQuery('pets', getPets);
  const [removePet] = useMutation(deletePet, {
    onSuccess: () => cache.invalidateQueries('pets')
  });

  return (
    <React.Fragment>
      <Box pb={2}>
        <Autocomplete />
      </Box>

      {pets?.length && !isLoading && !error ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell component="th" scope="row">
                    <MuiLink component={Link} to={`/${pet.id}`}>
                      {pet.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{pet.type}</TableCell>
                  <TableCell align="right">{pet.age}</TableCell>
                  <TableCell align="right">
                    <IconButton component={Link} to={`edit/${pet.id}`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton data-testid={`${pet.name}-delete`} onClick={() => removePet(pet.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : pets?.length === 0 && !isLoading && !error ? (
        <Paper className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={12} classes={{ root: classes.item }}>
              <Typography>No pets found. Please add one.</Typography>
            </Grid>
            <Grid item xs={12} classes={{ root: classes.item }}>
              <Button color="inherit" component={Link} to="/add">
                Add Pets
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ) : error ? (
        <ErrorIcon />
      ) : (
        <Container>
          <LinearProgress />
        </Container>
      )}
    </React.Fragment>
  );
};
