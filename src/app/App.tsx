import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useState } from 'react';
import {
  AppBar,
  Button,
  createMuiTheme,
  createStyles,
  CssBaseline,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  Theme as MuiTheme,
  ThemeProvider,
  Toolbar
  } from '@material-ui/core';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { grey, red } from '@material-ui/core/colors';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { Routes } from './Routes';

const useStyles = makeStyles((theme: MuiTheme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2)
    },
    nav: {
      flexGrow: 1
    },
    button: {
      padding: theme.spacing(2),
      height: '100%'
    },
    formLabel: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
);

type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

export const App: React.FC = () => {
  const classes = useStyles();
  const queryCache = new QueryCache();
  const [theme, setTheme] = useState<Theme>('dark');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: grey[500]
      },
      secondary: {
        main: red[500]
      },
      type: theme
    }
  });

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar>
                <div className={classes.nav}>
                  <Button
                    classes={{ root: classes.button }}
                    activeStyle={{
                      fontWeight: 'bold',
                      color: 'red'
                    }}
                    color="inherit"
                    component={NavLink}
                    to="/"
                    exact
                  >
                    View Pets
                  </Button>
                  <Button
                    classes={{ root: classes.button }}
                    activeStyle={{
                      fontWeight: 'bold',
                      color: 'red'
                    }}
                    color="inherit"
                    component={NavLink}
                    to="/add"
                  >
                    Add Pets
                  </Button>
                </div>
                <FormControlLabel
                  className={classes.formLabel}
                  control={<Switch checked={theme === 'dark'} onClick={toggleTheme} name="theme" />}
                  label={theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                />
              </Toolbar>
            </AppBar>
            <Grid container className={classes.root}>
              <Grid item xs={12}>
                <Routes />
              </Grid>
            </Grid>
          </ThemeProvider>
        </ThemeContext.Provider>
      </Router>
    </ReactQueryCacheProvider>
  );
};
