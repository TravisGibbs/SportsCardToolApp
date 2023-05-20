import {useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core';
import {
    makeStyles,
  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    backgroundImg: {
        backgroundImg: "url(https://www.invaluable.com/blog/wp-content/uploads/sites/77/2018/04/invaluable-baseball-card-value-hero-v2.jpg)",
        height: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      
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

export default function Home() {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className={classes.backgroundImg}>test</div>
    )
}