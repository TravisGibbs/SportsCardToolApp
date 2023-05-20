import React from 'react';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GlobalStyles from '@mui/material/GlobalStyles';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';

import Navbar from './components/navbar';
import RecordList from './components/recordList';
import Edit from './components/edit';
import View from './components/view';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './components/home';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#7cb69d',
    },
    secondary: {
      main: '#294936',
    },
  },
});


const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: 'blue',
    fontSize: '10px',
    '&:hover': {
      color: 'blue',
      borderBottom: '1px solid blue',
    },
  },
  image: {
    width: '50%',
    marginLeft: '25%',
  },
  button: {
    width: '50%',
    marginLeft: '25% !important',
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyles
          styles={{
            '*::-webkit-scrollbar': {
              width: '0.4em',
            },
            '*::-webkit-scrollbar-track': {
              '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
              outline: '1px solid slategrey',
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/cards" element={<RecordList />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/view/:id" element={<View />} />
        </Routes>
        <div>
          <Link to="https://www.baseball-reference.com/" className={classes.link}>
            Debut Years and Short Names Obtained with the help of Baseball
            Reference and StatHead
          </Link>
          <br />
          <Link
            to="https://www.flaticon.com/free-icons/baseball-card"
            className={classes.link}
          >
            Baseball card icons created by Freepik - Flaticon
            <br />
          </Link>
          <Link
            to="https://www.flaticon.com/free-icons/flash-cards"
            className={classes.link}
          >
            Flash cards icons created by manshagraphics - Flaticon
          </Link>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
