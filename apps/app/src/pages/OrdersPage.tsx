import { ClothStatus, IOrder } from '@e-pressing/interfaces';
import { FilterList } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { OrderCard } from '../components/OrderCard';
import { useMongoDB } from '../providers/mongoDB';
import { getOrders } from '../services/orders.service';
import { theme } from '../theme';

export interface IOrdersPageProps {
  children?: JSX.Element;
}

export default function OrdersPage(props: IOrdersPageProps) {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);

  const [expanded, setExpanded] = useState(false);

  const [status, setStatus] = useState<ClothStatus>();
  const [orderNumber, setOrderNUmber] = useState<string>();

  useEffect(() => {
    if (!db) {
      toast.error('Mongo database was not loaded successfully !!!');
      return navigate('/');
    }
    getOrders(db, { status, order_number: orderNumber })
      .then(setOrders)
      .catch(toast.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orderNumber]);

  return (
    <Box sx={{ minWidth: '50vw', display: 'grid', gridAutoFlow: 'row' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: '1fr auto',
            xs: 'auto',
          },
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <Typography variant="h5">Your Orders</Typography>
          <Tooltip title="Filter list">
            <IconButton
              onClick={() => {
                setExpanded((show) => !show);
                setOrderNUmber(undefined);
                setStatus(undefined);
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
        <Collapse
          timeout="auto"
          unmountOnExit
          in={expanded}
          orientation="vertical"
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
              defaultValue="PENDING"
              onChange={(e) => setStatus(e.target.value as ClothStatus)}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="WASHED">Washed</MenuItem>
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
      </Box>
      {orders.length === 0 ? (
        <Box
          sx={{
            width: '300px',
            minWidth: '60vw',
            display: 'grid',
            gridAutoFlow: 'row',
            gap: theme.spacing(2),
            justifySelf: 'center',
            padding: theme.spacing(2),
          }}
        >
          <Typography variant="h6">No order is registered yet !</Typography>
          <Button variant="contained" onClick={() => navigate('/orders/new')}>
            new order
          </Button>
        </Box>
      ) : (
        <List
          sx={{
            gap: 2,
            width: '100%',
            display: 'grid',
            bgcolor: 'background.paper',
          }}
        >
          {orders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}
        </List>
      )}
    </Box>
  );
}
