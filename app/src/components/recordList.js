import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

 
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
          ? 'http://travisapi.pythonanywhere.com'
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
        Cell: ({ cell }) => <img alt="Card Front" src={cell.getValue()} />,
      },
      {
        accessorKey: 'name',
        header: 'Name',
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
          return <Button onClick={()=> navigate('edit/'+cell.getValue())} variant="contained">Edit</Button>
        },
        size: 20,
        enableColumnFilter: false,
        enableSorting: false
      }
    ],
    [navigate],
  );

  return (
   <div>
     <h3>Record List</h3>
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
   </div>
 );
}