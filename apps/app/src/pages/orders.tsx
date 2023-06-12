import { ClothStatus, IOrderDetails } from '@e-pressing/interfaces';
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
import { useNavigate } from 'react-router';
import OrderCard from '../components/orderCard';
import { theme } from '../theme';
import { useMongoDB } from '../providers/mongoDB';
import { changeOrderStatus, getOrders } from '../services/orders.service';
import { toast } from 'react-toastify';

export interface IOrdersProps {
  children?: JSX.Element;
}

export default function Orders(props: IOrdersProps) {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrderDetails[]>([]);

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

  const handleStatusChange = (
    orderNumber: string,
    selected: readonly string[],
    newStatus: ClothStatus
  ) => {
    if (!db) {
      toast.error('Mongo database was not loaded successfully !!!');
      return navigate('/');
    }
    changeOrderStatus(db, { orderIds: selected, status: newStatus })
      .then(() => {
        setOrders((orders) =>
          orders.map((order) =>
            order.order_number === orderNumber
              ? {
                  ...order,
                  cloths: order.cloths.map((cloth) =>
                    selected.includes(cloth.cloth_id)
                      ? { ...cloth, status: newStatus }
                      : cloth
                  ),
                }
              : order
          )
        );
      })
      .catch((error) => toast.error(error));
  };

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
        <Typography variant="h4">All recorded cloths</Typography>
        <Box
          sx={{
            display: 'grid',
            justifySelf: 'end',
            padding: 1,
            gridTemplateColumns: '1fr auto',
          }}
        >
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
          <Button variant="contained" onClick={() => navigate('/-/new')}>
            new order
          </Button>
        </Box>
      ) : (
        orders.map((order, index) => (
          <OrderCard
            handleStatusChange={(status, selected) =>
              handleStatusChange(
                order.order_number,
                selected,
                status === 'PENDING' ? 'WASHED' : 'REMOVED'
              )
            }
            key={index}
            {...order}
          />
        ))
      )}
    </Box>
  );
}
