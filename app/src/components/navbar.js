import React from 'react';
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import DrawerComponent from './drawer';
import {useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  img: {
    width: '25% !important',
    
  },
  navBar: {
    backgroundColor: "#7cb69d !important"
  },
  navlinks: {
    marginLeft: theme.spacing(10),
    display: 'flex',
  },
  logo: {
    flexGrow: '1',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '20px',
    marginLeft: theme.spacing(5),
    '&:hover': {
      color: 'yellow',
      borderBottom: '1px solid white',
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar className={classes.navBar} position="static">
      <CssBaseline />
      <Toolbar  color='primary'>
        <Typography variant="h4" className={classes.logo}>
          SportsCardTool
        </Typography>
        {isMobile ? (
          <DrawerComponent />
        ) : (
          <div className={classes.navlinks}>
            <Link to="/" className={classes.link}>
              Home
            </Link>
            <Link
              to="https://github.com/TravisGibbs/SportsCardToolLib"
              className={classes.link}
            >
              GitHub
            </Link>
          </div>
        )}
      </Toolbar>
      <img className={classes.img} alt="Custom badge" src="https://img.shields.io/endpoint?style=flat-square&url=https%3A%2F%2Ftravisapi.pythonanywhere.com%2Fapi%2Fv1%2Fsportscards%2Fyears_available_badge"></img>

    </AppBar>
  );
}
export default Navbar;
