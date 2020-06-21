import * as Yup from 'yup';
import React from 'react';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  MenuItem,
  Theme
  } from '@material-ui/core';
import { Form } from 'react-final-form';
import { IPet } from './interfaces';
import { makeValidate, Select, TextField } from 'mui-rff';

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

const schema = Yup.object().shape({
  name: Yup.string().required('Name is a required field.'),
  age: Yup.string().required('Age is a required field.'),
  type: Yup.string().required('Type is a required field.')
});

const validate = makeValidate(schema);

type Props = {
  initialValues?: IPet;
  onSubmit: (values: IPet) => Promise<void>;
};

export const PetForm: React.FC<Props> = ({ onSubmit, initialValues }) => {
  const classes = useStyles();

  return (
    <Form<IPet> onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {({ handleSubmit, invalid }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                type="text"
                required
                inputProps={{ 'data-testid': 'name' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Age"
                name="age"
                type="number"
                required
                inputProps={{ 'data-testid': 'age' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Select variant="outlined" name="type" label="Type" required inputProps={{ 'data-testid': 'type' }}>
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Button
                classes={{ root: classes.button }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={invalid}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Form>
  );
};
