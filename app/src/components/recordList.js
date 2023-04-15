import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
} from "@material-ui/core";

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
  }
}));
 
export default function RecordList() {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);


  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const classes = useStyles();
  const navigate = useNavigate();

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
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'front_img',
        header: 'Image',
        Cell: ({ cell }) => {
          const link = cell.getValue()
          if (link) {
            return <img className={classes.image} alt="Card Front" src={cell.getValue()} />
          } else {
            return <img className={classes.image} alt="Card Front" src={placeholder_url} />
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
        header: 'Edit',
        Cell: ({ cell }) => {
          return <Button disabled={true} onClick={()=> navigate('edit/'+cell.getValue())} variant="contained">Edit</Button>
        },
        size: 20,
        enableColumnFilter: false,
        enableSorting: false
      }
    ],
    [navigate, classes.image],
  );

  return (
   <div>
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