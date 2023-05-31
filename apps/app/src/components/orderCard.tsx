import { ClothStatus, ICreateCloth, IOrder } from '@e-pressing/interfaces';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import { useMemo, useState } from 'react';
import OrderCardItem from './orderCardItem';
import { theme } from '../theme';

interface EnhancedTableToolbarProps {
  numSelected: number;
  order_number: string;
  status: ClothStatus;
}

function EnhancedTableToolbar({
  numSelected,
  order_number,
  status,
}: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {order_number}
        </Typography>
      )}
      <Chip
        label={status}
        color={
          status === 'PENDING'
            ? 'warning'
            : status === 'REMOVED'
            ? 'success'
            : 'info'
        }
      />
      <Tooltip title="Delete">
        <IconButton>
          <Delete />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

type KeyOfData = keyof ICreateCloth | 'total';
interface HeadCell {
  disablePadding: boolean;
  id: KeyOfData;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numSelected: number;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;
  const headCells: readonly HeadCell[] = [
    {
      id: 'cloth_name',
      numeric: false,
      disablePadding: true,
      label: 'Item description',
    },
    {
      id: 'washing_price',
      numeric: true,
      disablePadding: false,
      label: 'Unit price',
    },
    {
      id: 'quantity',
      numeric: true,
      disablePadding: false,
      label: 'Quantity',
    },
    {
      id: 'total',
      numeric: true,
      disablePadding: false,
      label: 'Total',
    },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export interface IOrderCardItemProps extends IOrder {
  children?: JSX.Element;
}

export default function OrderCard({
  cloths,
  order_number,
  status,
}: IOrderCardItemProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cloths.map((n) => n.cloth_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, cloth_id: string) => {
    const selectedIndex = selected.indexOf(cloth_id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, cloth_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (cloth_id: string) => selected.indexOf(cloth_id) !== -1;

  const visibleRows = useMemo(
    () => cloths.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [cloths, page, rowsPerPage]
  );
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cloths.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          order_number={order_number}
          status={status}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={cloths.length}
            />
            <TableBody>
              {visibleRows.map((cloth, index) => {
                const isItemSelected = isSelected(cloth.cloth_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <OrderCardItem
                    {...cloth}
                    labelId={labelId}
                    handleClick={handleClick}
                    isItemSelected={isItemSelected}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gridAutoFlow: 'column',
            paddingLeft: theme.spacing(2),
          }}
        >
          <Typography variant='h6'>
            {`Total: ${cloths.reduce(
              (total, { quantity, washing_price }) =>
                total + quantity * washing_price,
              0
            )}`}
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cloths.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
}
