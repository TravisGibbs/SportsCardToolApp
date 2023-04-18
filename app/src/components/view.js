import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const placeholder_url = require('../assets/baseball-card.png');

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
      width: '80%',
      marginLeft: "10%",
      marginTop: "10%",
      objectFit: "contain",
      height: '80%'
    },
    button: {
      width: '50%',
      marginLeft: '25% !important',
    },
  }));

export default function View() {
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snackSeverity, setSnackSeverity] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [currentEbayLink, setCurrentEbayLink] = React.useState('');
  const [form, setForm] = useState({
    auto: '',
    back_img: '',
    front_img: null,
    group: '',
    listing: '',
    mem: '',
    name: '',
    number: '',
    price: '',
    rc: '',
    serial: '',
    set: '',
    team: '',
    year: '',
  });
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();

  const handleSnack = (message, serverity) => {
    setSnackMessage(message);
    setSnackSeverity(serverity);
    setSnackOpen(true);
  };

  const handleClickOpen = () => {
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setCurrentEbayLink('');
  };

  const handleSnackClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackMessage('');
    setSnackSeverity('');
    setSnackOpen(false);
  };

  const handleSubmit = () => {
    const url = new URL(
      '/api/v1/sportscards/upload_image/' + params.id.toString(),
      process.env.NODE_ENV === 'production'
        ? 'https://travisapi.pythonanywhere.com'
        : 'http://localhost:5000'
    );

    url.searchParams.set('listing', currentEbayLink.toString());

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    };

    fetch(url.href, requestOptions).then(response => {
      if (response.status === 200) {
        handleSnack('Image accepted, thank you for contributing!', 'success');
      } else {
        handleSnack(
          'Image declined, make sure to use an unmodified ebay link or see FAQ.',
          'error'
        );
      }
    });

    handleClose();
  };

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(
        `http://localhost:5000/api/v1/sportscards/id/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const json_res = await response.json();
      if (!json_res) {
        window.alert(`Record with id ${id} not found`);
        navigate('/');
        return;
      }

      const record = json_res['card'];
      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm(prev => {
      return {...prev, ...value};
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      auto: form.auto,
      back_img: form.back_img,
      front_img: form.front_img,
      group: form.group,
      listing: form.listing,
      mem: form.mem,
      name: form.name,
      number: form.number,
      price: form.price,
      rc: form.rc,
      serial: form.serial,
      set: form.set,
      team: form.team,
      year: form.year,
    };

    // This will send a post request to update the data in the database.
    await fetch(
      `http://localhost:5000/api/v1/sportscards/update/${params.id.toString()}`,
      {
        method: 'POST',
        body: JSON.stringify(editedPerson),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    navigate('/');
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
    <Dialog open={formOpen} onClose={handleClose}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload an image simply search "{form.listing}" on ebay and copy
            the link to the listing into the field below!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ebay Listing Link"
            type="link"
            fullWidth
            variant="standard"
            onChange={e => {
              setCurrentEbayLink(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity}
          sx={{width: '100%'}}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    <br/>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={10}>
            <Card sx={{  height: 300 }}>
                <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {form.name}
                </Typography>
                <Typography variant="h5" component="div">
                    {form.listing}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {form.team}
                </Typography>
                <Typography variant="body2">
                    {form.set}
                </Typography>
                </CardContent>
                <CardActions>
                <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Grid>
        <Grid xs={2}>
            <Card sx={{  height: 300 }}>
            {form.front_img != null ? <img
                className={classes.image}
                alt="Card Front"
                src={form.front_img}
              /> :<div>
              <img
                className={classes.image}
                alt="Card Front"
                src={placeholder_url}
              />
              <br />
              <Button
                className={classes.button}
                onClick={() => {
                  handleClickOpen();
                }}
                variant="contained"
              >
                Add Photo
              </Button>
            </div> }
            </Card>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}
