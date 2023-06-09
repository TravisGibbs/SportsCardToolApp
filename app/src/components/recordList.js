import React, {useEffect, useMemo, useState} from 'react';
import MaterialReactTable from 'material-react-table';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {capitalizeName} from './view'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const placeholder_url = require('../assets/baseball-card.png');

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

export default function RecordList() {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [formOpen, setFormOpen] = React.useState(false);
  const [currentID, setCurrentID] = React.useState(0);
  const [currentListing, setCurrentListing] = React.useState('');
  const [currentEbayLink, setCurrentEbayLink] = React.useState('');
  const [update, setUpdate] = React.useState(true);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snackSeverity, setSnackSeverity] = React.useState('');

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = React.useState(false);

  const handleSnack = (message, serverity) => {
    setSnackMessage(message);
    setSnackSeverity(serverity);
    setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackMessage('');
    setSnackSeverity('');
    setSnackOpen(false);
  };

  const handleClickOpen = cell => {
    setCurrentID(cell.row.original._id);
    setCurrentListing(cell.row.original.listing);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setCurrentEbayLink('');
    setCurrentID(0);
    setCurrentListing('');
  };

  const handleSubmit = () => {
    const url = new URL(
      '/api/v1/sportscards/upload_image/' + currentID.toString(),
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

    setUpdate(true);
    handleClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      

      const url = new URL(
        '/api/v1/sportscards/search',
        process.env.NODE_ENV === 'production'
          ? 'https://travisapi.pythonanywhere.com'
          : 'http://localhost:5000'
      );

      columnFilters.forEach((filter, _i) =>
        url.searchParams.set(filter['id'], filter['value'])
      );
      url.searchParams.set('page', pagination.pageIndex);

      let sortString = ""
      sorting.forEach(sortTerm => {
        let dir = '1'
        if (sortTerm['desc'] === true) {
          dir = '-1';
        }

        if (sortString.length !== 0) {
          sortString += ","+sortTerm['id']+":"+dir
        } else {
          sortString += sortTerm['id']+":"+dir
        }
      })

      url.searchParams.set('sort', sortString)

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
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    update,
  ]);

  const columns = useMemo(
    () => [
      {
        enableColumnFilter: false,
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
        enableColumnFilter: false,
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
        header: 'Bref IDs',
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
              onClick={() => navigate('view/' + cell.getValue())}
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

  return (
    <div>
      <Dialog open={formOpen} onClose={handleClose}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To upload an image simply search "{currentListing}" on ebay and copy
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
      <MaterialReactTable
        columns={columns}
        data={data}
        getRowId={row => row.phoneNumber}
        initialState={{showColumnFilters: false}}
        manualFiltering
        manualPagination
        manualSorting
        enableGlobalFilter={false}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        muiTableProps={{
          sx: {
            tableLayout: 'fixed',
          },
        }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [],
          showFirstButton: false,
          showLastButton: false,
        }}
        onSortingChange={setSorting}
        rowCount={rowCount}
        state={{
          columnFilters,
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          sorting,
        }}
      />
    </div>
  );
}
