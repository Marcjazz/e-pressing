import { ClothStatus, IOrder } from '@e-pressing/interfaces';
import { FilterList } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import OrderCard from '../components/orderCard';
import { theme } from '../theme';

export interface IOrdersProps {
  children?: JSX.Element;
}

export default function Orders(props: IOrdersProps) {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const [expanded, setExpanded] = useState(false);

  const [status, setStatus] = useState<ClothStatus>('PENDING');
  const [orderNumber, setOrderNUmber] = useState<string>('');

  //TODO call api to fetch registered orders with status and orderNumber
  useEffect(() => {
    setOrders([
      {
        cloths: [
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'T-Shirt rouge vif tienté de bleue',
            quantity: 2,
            status: 'PENDING',
            washing_price: 1500,
          },
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'Goodies nike, 37 model A5',
            quantity: 2,
            status: 'WASHED',
            washing_price: 2500,
          },
        ],
        order_id: crypto.randomUUID(),
        order_number: 'PRESA06020',
        status: 'PENDING',
      },
      {
        cloths: [
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'T-Shirt rouge vif tienté de bleue',
            quantity: 2,
            status: 'PENDING',
            washing_price: 1500,
          },
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'Goodies nike, 37 model A5',
            quantity: 2,
            status: 'WASHED',
            washing_price: 2500,
          },
        ],
        order_id: crypto.randomUUID(),
        order_number: 'PRESA060201',
        status: 'WASHED',
      },
      {
        cloths: [
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'T-Shirt rouge vif tienté de bleue',
            quantity: 2,
            status: 'PENDING',
            washing_price: 1500,
          },
          {
            cloth_id: crypto.randomUUID(),
            cloth_name: 'Goodies nike, 37 model A5',
            quantity: 2,
            status: 'WASHED',
            washing_price: 2500,
          },
        ],
        order_id: crypto.randomUUID(),
        order_number: 'PRESA060201',
        status: 'REMOVED',
      },
    ]);
  }, [status, orderNumber]);

  return (
    <Box sx={{ minWidth: '50vw', display: 'grid', gridAutoFlow: 'row' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
        }}
      >
        <Typography variant="h4">All recorded cloths</Typography>
        <Collapse
          timeout="auto"
          unmountOnExit
          in={expanded}
          orientation="horizontal"
        >
          <Box
            sx={{
              display: 'grid',
              gap: theme.spacing(1),
              gridAutoFlow: 'column',
            }}
          >
            <TextField
              select
              fullWidth
              id="status"
              name="status"
              label="Order status"
              size="small"
              variant="standard"
              value={status}
              defaultValue={status}
              onChange={(e) => setStatus(e.target.value as ClothStatus)}
            >
              <MenuItem value="PEDING">Pending</MenuItem>
              <MenuItem value="READY">Ready</MenuItem>
              <MenuItem value="REMOVED">Removed</MenuItem>
            </TextField>
            <TextField
              id="order_number"
              name="order_number"
              label="Order number"
              size="small"
              variant="standard"
              value={orderNumber}
              onChange={(e) => setOrderNUmber(e.target.value)}
            />
          </Box>
        </Collapse>
        <Tooltip title="Filter list">
          <IconButton onClick={() => setExpanded((show) => !show)}>
            <FilterList />
          </IconButton>
        </Tooltip>
      </Box>
      {orders.length === 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'row',
            gap: theme.spacing(2),
            justifySelf: 'center',
            padding: theme.spacing(2),
          }}
        >
          <Typography variant="h6">No order is registered yet !</Typography>
          <Button variant="contained">
            new order
          </Button>
        </Box>
      ) : (
        orders.map((order) => <OrderCard {...order} />)
      )}
    </Box>
  );
}
