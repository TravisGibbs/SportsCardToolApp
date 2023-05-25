import {
    makeStyles,
    Typography
  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
    fullHeight: {
      height: "100%"
    },
    menu: {
      top: "20%",
      left: "10%",
      position: "absolute"
    },
    largeText: {
      fontSize: "5vw",
      color: "#7cb69d"
    }
  }));

export default function Home() {
    const classes = useStyles();

    return (
      <div className={classes.fullHeight}>
        <div className={classes.backgroundImg}>
        </div>
        <div className={classes.menu}>
          <Typography className={classes.largeText}>SportsCardTool</Typography>
        </div>
      </div>
    )
}