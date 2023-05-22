import {
    makeStyles,
  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    backgroundImg: {
        backgroundBlendMode: "saturation",
        backgroundImage: "linear-gradient(black, black), url(https://www.invaluable.com/blog/wp-content/uploads/sites/77/2018/04/invaluable-baseball-card-value-hero-v2.jpg)",
        height: "100%",
        filter: "blur(10px)",
        webkitFilter: "blur(10px)",
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
    }
  }));

export default function Home() {
    const classes = useStyles();

    return (
      <div className={classes.fullHeight}>
        <div className={classes.backgroundImg}>
        </div>
        <div className={classes.menu}>
          <p>SportsCardTool</p>
        </div>
      </div>
    )
}