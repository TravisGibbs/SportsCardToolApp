import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
} from "@material-ui/core";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const placeholder_url = require('../assets/baseball-card.png');


const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "blue",
    fontSize: "10px",
    "&:hover": {
      color: "blue",
      borderBottom: "1px solid blue",
    },
  },
  image: {
    width: "50%",
    marginLeft: "25%"
  },
  button: {
    width: "50%",
    marginLeft: "25% !important"
  }
}));
 
export default function RecordList() {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [formOpen, setFormOpen] = React.useState(false);
  const [currentID, setCurrentID] = React.useState(0)
  const [currentListing, setCurrentListing] = React.useState("")
  const [currentEbayLink, setCurrentEbayLink] = React.useState("")
  const [update, setUpdate] = React.useState(true)
  const [snackMessage, setSnackMessage] =  React.useState("")
  const [snackSeverity, setSnackSeverity] =  React.useState("")

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
    setSnackMessage(message)
    setSnackSeverity(serverity)
    setSnackOpen(true)
  }


  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackMessage("")
    setSnackSeverity("")
    setSnackOpen(false);
  };

  const handleClickOpen = (cell) => {
    console.log("open")
    setCurrentID(cell.row.original._id)
    setCurrentListing(cell.row.original.listing)
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setCurrentEbayLink("")
    setCurrentID(0)
    setCurrentListing("")
  };

  const handleSubmit = () => {
    const url = new URL(
      '/api/v1/sportscards/upload_image/'+currentID.toString(),
      process.env.NODE_ENV === 'production'
        ? 'https://travisapi.pythonanywhere.com'
        : 'http://localhost:5000',
    );

    url.searchParams.set("listing", currentEbayLink.toString())

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(url.href, requestOptions)
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            handleSnack("Image accepted, thank you for contributing!", 'success')
          } else {
            handleSnack("Image declined, make sure to use an unmodified ebay link or see FAQ.", 'error')
          }
        })

    setUpdate(true)
    handleClose()
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
          : 'http://localhost:5000',
      );

      columnFilters.forEach((filter, _i) => url.searchParams.set(filter['id'], filter['value']));
      url.searchParams.set("page", pagination.pageIndex)

      if (sorting.length > 0){
        const sort_term = sorting[0]
        let dir = "1"

        if (sort_term["desc"] === true) {
          dir = "-1"
        }

        url.searchParams.set("sort", sort_term["id"]+":"+dir)
      }

      try {
        const response = await fetch(url.href);
        const json = await response.json();
        const cards = json['cards']
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
      setUpdate(false)
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
        accessorKey: 'front_img',
        header: 'Image',
        size: 80,
        Cell: ({ cell }) => {
          const link = cell.getValue()
          if (link) {
            return <img className={classes.image} alt="Card Front" src={cell.getValue()} />
          } else {
            return <div><img className={classes.image} alt="Card Front" src={placeholder_url} /><br /><Button className={classes.button} onClick={() => {handleClickOpen(cell)}} variant="contained">Add Photo</Button></div>
          }
      },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 60
      },
      {
        accessorKey: 'year',
        header: 'Year',
        size: 60
      },
      {
        accessorKey: 'team',
        header: 'Team',
        size: 60
      },
      {
        accessorKey: 'listing',
        header: 'Listing',
      },
      {
        accessorKey: 'serial',
        header: "Numbered",
        Cell: ({ cell }) => {
        const cellValue = cell.getValue()
        if (cellValue === 0) {
          return "false"
        } else {
          return cellValue
        }
        },
        size: 60,
      },
      {
        accessorKey: 'rc',
        header: 'Rookie',
        size: 60,
        Cell: ({ cell }) => cell.getValue().toString(),
      },
      {
        accessorKey: '_id',
        header: 'View',
        Cell: ({ cell }) => {
          return <Button disabled={true} onClick={()=> navigate('view/'+cell.getValue())} variant="contained">View</Button>
        },
        size: 20,
        enableColumnFilter: false,
        enableSorting: false
      }
    ],
    [navigate, classes],
  );

  return (
   <div>
    <Dialog open={formOpen} onClose={handleClose}>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To upload an image simply search "{currentListing}" on ebay and copy the link to the listing into the field below!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Ebay Listing Link"
          type="link"
          fullWidth
          variant="standard"
          onChange={(e) => {console.log(e.target.value); setCurrentEbayLink(e.target.value)}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={snackOpen} autoHideDuration={4000} onClose={handleSnackClose}>
      <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
        {snackMessage}
      </Alert>
    </Snackbar>
     <MaterialReactTable
      columns={columns}
      data={data}
      getRowId={(row) => row.phoneNumber}
      initialState={{ showColumnFilters: true }}
      manualFiltering
      manualPagination
      manualSorting
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
    <div>
      <Link to="https://www.flaticon.com/free-icons/baseball-card" className={classes.link}>Baseball card icons created by Freepik - Flaticon<br/></Link>
      <Link to="https://www.flaticon.com/free-icons/flash-cards" className={classes.link}>Flash cards icons created by manshagraphics - Flaticon</Link>
    </div>
  </div>
 );
}