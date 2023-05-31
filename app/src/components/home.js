import {
  Button,
    makeStyles,
    Typography
  } from '@material-ui/core';
import Grid from '@mui/material/Grid';
import {useNavigate} from 'react-router-dom';


const useStyles = makeStyles(() => ({
    backgroundImg: {
        margin: '1%',
        backgroundBlendMode: "saturation",
        backgroundImage: "linear-gradient(black, black), url(https://www.invaluable.com/blog/wp-content/uploads/sites/77/2018/04/invaluable-baseball-card-value-hero-v2.jpg)",
        height: "100%",
        filter: "blur(10px) brightness(.5)",
        webkitFilter: "blur(10px) brightness(.5)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    },
    pageHeight: {
      height: "80%"
    },
    menu: {
      top: "20%",
      width: "70%",
      marginLeft: "10%",
      position: "absolute"
    },
    largeText: {
      fontSize: "8vw",
      color: "#7cb69d"
    },
    mediumText: {
      fontSize: "2.5vw",
      color: "#7cb69d",
      marginLeft: "5%"
    },
    smallText: {
      fontSize: "1vw",
      color:"#FFFFFF"
    },
    buttonBackground: {
      backgroundColor: "#FFFFFF !important"
    }
  }));

export default function Home() {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
      <div className={classes.pageHeight}>
        <div className={classes.backgroundImg}>
        </div>
        <div className={classes.menu}>
          <Typography className={classes.largeText}>SportsCardTool</Typography>
          <Typography className={classes.mediumText}>The Future of the Hobby Starts Here</Typography>
          <br/>
          <br/>
          <Grid container rowSpacing={5} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button onClick={() => navigate('cards/')} className={classes.buttonBackground} variant="contained">
                Explore Card Database
              </Button>
            </Grid>            
            <Grid item xs={12} sm={6}>
              <Button className={classes.buttonBackground} variant="contained" disabled={true}>
                Explore Release Database (coming soon)
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    )
}