import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
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
import MaterialReactTable from 'material-react-table';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Sales from './sales';
const placeholder_url = require('../assets/baseball-card.png');

export function capitalizeName(string) {
  let final_str = ""
  string.split(" ").forEach(string => {
    final_str = final_str.concat(string.charAt(0).toUpperCase() + string.slice(1) + " ");
  })

  return final_str.slice(null ,final_str.length-1)
} 


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
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
    width: '80%',
    marginLeft: '10%',
    marginTop: '10%',
    objectFit: 'contain',
    height: '80%',
  },
  button: {
    width: '80%',
    marginLeft: '10% !important',
  },
}));

export default function View() {
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [update, setUpdate] = React.useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [snackSeverity, setSnackSeverity] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [currentEbayLink, setCurrentEbayLink] = React.useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    auto: '',
    back_img: '',
    front_img: null,
    group: '',
    listing: '',
    mem: '',
    players: [],
    manager: false,
    error: false,
    number: '',
    price: '',
    rc: '',
    serial: '',
    set: '',
    set_alt: '',
    team: '',
    year: '',
  });
  const params = useParams();

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

  const name_list = [];
  for (const player of form.players) {
    name_list.push(capitalizeName(player.name));
  }
  const name_str = name_list.join(", ")

  const handleSnackClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackMessage('');
    setSnackSeverity('');
    setSnackOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (form.players.length < 1) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
        const url = new URL(
          '/api/v1/sportscards/search',
          process.env.NODE_ENV === 'production'
            ? 'https://travisapi.pythonanywhere.com'
            : 'http://localhost:5000'
        );
        if (form.players.length > 1) {
          const shortNameList = []
          form.players.forEach((player) => {
            shortNameList.push(player.short_name)
          })
    
          url.searchParams.set('players', shortNameList.join(","));
        }
        else {
          console.log("only one player")
          url.searchParams.set('players', players[0].short_name);
        }
        
        url.searchParams.set('page', pagination.pageIndex);
  
        if (sorting.length > 0) {
          const sort_term = sorting[0];
          let dir = '1';
  
          if (sort_term['desc'] === true) {
            dir = '-1';
          }
  
          url.searchParams.set('sort', sort_term['id'] + ':' + dir);
        }
  
        try {
          const response = await fetch(url.href);
          const json = await response.json();
          const cards = json['cards'];
          setData(cards);
          setRowCount(json['total_results']);
        } catch (error) {
          setIsError(true);
          console.error(error);
          return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
        setUpdate(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, sorting, update, form]);

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
    async function fetchCurrentEntry() {
      const id = params.id.toString();
      const url = new URL(
        '/api/v1/sportscards',
        process.env.NODE_ENV === 'production'
          ? 'https://travisapi.pythonanywhere.com'
          : 'http://localhost:5000'
      );
      const response = await fetch(url + `/id/${params.id.toString()}`);

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

    fetchCurrentEntry();

    return;
  }, [params.id, navigate]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'front_img',
        header: 'Image',
        size: 150,
        minSize: 150,
        Cell: ({cell}) => {
          const link = cell.getValue();
          if (link) {
            return (
              <img
                className={classes.image}
                alt="Card Front"
                src={cell.getValue()}
              />
            );
          } else {
            return (
              <div>
                <img
                  className={classes.image}
                  alt="Card Front"
                  src={placeholder_url}
                />
                <br />
                <Button
                  color='secondary'
                  className={classes.button}
                  onClick={() => {
                    handleClickOpen(cell);
                  }}
                  variant="contained"
                >
                  Add Photo
                </Button>
              </div>
            );
          }
        },
      },
      {
        accessorKey: 'players',
        header: 'Names',
        size: 150,
        minSize: 150,
        Cell: ({cell}) => {
          const names = [];
          for (const player of cell.getValue()) {
            names.push(<p>{capitalizeName(player.name)}</p>);
          }
          return <div>{names}</div>;
        },
      },
      {
        accessorKey: 'players',
        header: 'Bref Link',
        size: 150,
        minSize: 150,
        Cell: ({cell}) => {
          const links = [];
          for (const player of cell.getValue()) {
            if (player.short_name) {
              const href =
                'https://www.baseball-reference.com/players/' +
                player.short_name[0] +
                '/' +
                player.short_name +
                '.shtml';
              links.push(<p><a href={href}>{player.short_name}</a></p>);
            }
          }
          return <div>{links}</div>;
        },
      },
      {
        accessorKey: 'year',
        header: 'Year',
        size: 120,
        minSize: 120,
        Cell: ({cell}) => <p>{cell.getValue()}</p>,
      },
      {
        accessorKey: 'team',
        header: 'Team',
        size: 120,
        minSize: 120,
        Cell: ({cell}) => <p>{cell.getValue()}</p>,
      },
      {
        accessorKey: 'listing',
        header: 'Listing',
        size: 150,
        minSize: 150,
        Cell: ({cell}) => <p>{cell.getValue()}</p>,
      },
      {
        accessorKey: 'serial',
        header: 'Numbered',
        Cell: ({cell}) => {
          const cellValue = cell.getValue();
          if (cellValue === 0) {
            return "Standard";
          } else {
            return cellValue;
          }
        },
        size: 150,
        minSize: 150,
      },
      {
        accessorKey: 'rc',
        header: 'Rookie',
        size: 150,
        minSize: 150,
        Cell: ({cell}) => cell.getValue().toString(),
      },
      {
        accessorKey: '_id',
        header: 'View',
        Cell: ({cell}) => {
          return (
            <Button
              color='secondary'
              onClick={() => navigate('/view/' + cell.getValue())}
              variant="contained"
            >
              View
            </Button>
          );
        },
        size: 150,
        minSize: 150,
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [navigate, classes]
  );

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
          <Button color='secondary' onClick={handleClose}>Cancel</Button>
          <Button color='secondary' onClick={handleSubmit}>Submit</Button>
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
      <br />
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2} disableEqualOverflow={true}>
          <Grid xs={10}>
            <Card>
              <CardContent>
                <Typography
                  sx={{fontSize: 14}}
                  color="text.secondary"
                  gutterBottom
                >
                  {name_str}
                </Typography>
                <Typography variant="h5" component="div">
                  {form.listing}
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                  {form.team}
                </Typography>
                <Typography variant="body2">Set: {form.set_alt}</Typography>
                <p>{form.rc && 'Rookie Card'}</p>
                <p>
                  {form.serial === 0
                    ? 'Print Count: standard'
                    : 'Print Count: ' + form.serial}
                </p>
                <p>{form.error && 'Error Card'}</p>
                <p>{form.auto && 'Autographed Card'}</p>
                <p>{form.mem && 'Memorabilia Card'}</p>
                <p>{form.post_career && 'Post-Career Release'}</p>
                <p>{form.pre_major && 'Pre-Debut Release'}</p>
                <p>{form.debut && 'Debut Year Card'}</p>
                <p>{form.manager && 'Manager Card'}</p>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={2}>
            <Card sx={{height: 300}}>
              {form.front_img != null ? (
                <img
                  className={classes.image}
                  alt="Card Front"
                  src={form.front_img}
                />
              ) : (
                <div>
                  <img
                    className={classes.image}
                    alt="Card Front"
                    src={placeholder_url}
                  />
                  <br />
                  <Button
                    color='secondary'
                    className={classes.button}
                    onClick={() => {
                      handleClickOpen();
                    }}
                    variant="contained"
                  >
                    Add Photo
                  </Button>
                </div>
              )}
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card sx={{height: 800, overflow: "scroll"}}>
              <Grid container spacing={2} disableEqualOverflow={true}>
                <Grid xs={2}>
                  <Tooltip
                    placement="top"
                    sx={{padding: 0}}
                    title={
                      <p>
                        Data sourced from{' '}
                        <a style={{color: 'inherit'}} href="130point.com">
                          130point
                        </a>
                      </p>
                    }
                  >
                    <IconButton>
                      <QuestionMarkIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid xs={10}>
                  <h1 style={{margin: 0}}>Recent {name_str} Sales </h1>
                </Grid>
              </Grid>
              <Sales names={name_list} set_alt={form.set_alt} />
            </Card>
          </Grid>
          <Grid xs={8}>
            <Card  sx={{height: 800, overflow: "scroll"}}>
              <h1 style={{marginLeft: 10}}>Other {name_str} Cards</h1>
              <MaterialReactTable
                columns={columns}
                data={data}
                getRowId={row => row.phoneNumber}
                manualPagination
                enableGlobalFilter={false}
                enableFilterMatchHighlighting={false}
                enableGlobalFilterModes={false}
                enableColumnFilters={false}
                enableFilters={false}
                enableColumnActions={false}
                muiToolbarAlertBannerProps={
                  isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                      }
                    : undefined
                }
                onPaginationChange={setPagination}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [],
                  showFirstButton: false,
                  showLastButton: false,
                }}
                onSortingChange={setSorting}
                rowCount={rowCount}
                state={{
                  isLoading,
                  pagination,
                  showAlertBanner: isError,
                  showProgressBars: isRefetching,
                  sorting,
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
