import {
  ClothStatus,
  ICreateCloth,
  IOrderDetails,
} from '@e-pressing/interfaces';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { theme } from '../theme';
import OrderCardItem from './orderCardItem';

interface EnhancedTableToolbarProps {
  numSelected: number;
  order_number: string;
  status: ClothStatus;
  handleDelivery: () => void;
}

function EnhancedTableToolbar({
  numSelected,
  order_number,
  status,

  handleDelivery,
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
          sx={{ flex: '1' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: 1 }}
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
      {status !== 'REMOVED' && (
        <Button
          sx={{
            marginLeft: theme.spacing(2),
          }}
          onClick={handleDelivery}
          variant="contained"
          size="small"
          disabled={numSelected === 0}
        >
          {status === 'PENDING' ? 'update to washed' : 'update to revomed'}
        </Button>
      )}
    </Toolbar>
  );
}

type KeyOfData = keyof ICreateCloth | 'total' | 'cloth_status';
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
      id: 'cloth_status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
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

export interface IOrderCardItemProps extends IOrderDetails {
  children?: JSX.Element;
  handleStatusChange: (
    status: ClothStatus,
    selected: readonly string[]
  ) => void;
}

export default function OrderCard({
  cloths,
  order_number,
  handleStatusChange,
}: IOrderCardItemProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [selectedGroupStatus, setSelectedGroupStatus] = useState<ClothStatus>();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.checked &&
      cloths.reduce(
        (bool, _) =>
          bool && cloths.reduce((b, __) => b && _.status === __.status, true),
        true
      )
    ) {
      const newSelected = cloths.map((n) => n.cloth_id);
      setSelectedGroupStatus(cloths[0].status);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (event: React.MouseEvent<unknown>, cloth_id: string) => {
    const selectedIndex = selected.indexOf(cloth_id);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      const cloth = cloths.find((_) => _.cloth_id === cloth_id);
      if (cloth && cloth.status !== 'REMOVED' && selected.length === 0) {
        setSelectedGroupStatus(cloth?.status);
        newSelected = newSelected.concat(selected, cloth_id);
      } else if (cloth?.status === selectedGroupStatus)
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
          handleDelivery={() => {
            handleStatusChange(selectedGroupStatus as ClothStatus, selected);
            setSelectedGroupStatus(undefined);
            setSelected([]);
          }}
          numSelected={selected.length}
          order_number={order_number}
          status={
            selectedGroupStatus ?? cloths.find((_) => _.status === 'PENDING')
              ? 'PENDING'
              : cloths.find((_) => _.status === 'WASHED')
              ? 'WASHED'
              : 'REMOVED'
          }
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
                    handleClick={handleSelect}
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
          <Typography variant="h6">
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
