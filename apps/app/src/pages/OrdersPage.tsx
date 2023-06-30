import { ClothStatus, IOrder } from '@e-pressing/interfaces';
import { Done, DoneAll, FilterList, Schedule } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
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
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {orders.map(
            (
              {
                client_fullname,
                client_phone_number,
                number_of_cloths,
                order_number,
                reception_date,
                status,
              },
              index
            ) => (
              <Paper onClick={() => navigate(`/orders/${order_number}`)}>
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  sx={{ gap: theme.spacing(1) }}
                >
                  <ListItemIcon sx={{ display: 'grid' }}>
                    <div style={{ justifySelf: 'center' }}>
                      <Tooltip title={status}>
                        {status === 'PENDING' ? (
                          <Schedule
                            fontSize="large"
                            sx={{ color: '#ed6c02' }}
                          />
                        ) : status === 'WASHED' ? (
                          <Done sx={{ color: '#00ba88' }} />
                        ) : (
                          <DoneAll sx={{ color: '#3498db' }} />
                        )}
                      </Tooltip>
                    </div>
                    <Typography variant="caption">{status}</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{order_number}</Typography>
                    }
                    secondary={
                      <>
                        <div>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body1"
                            color="text.primary"
                          >
                            {`${number_of_cloths} items, `}
                          </Typography>
                          <b>Due date:</b>
                          {` ${new Date(reception_date).toDateString()}, `}
                        </div>
                        <div>
                          <b>Client:</b>
                          {` ${client_fullname}, ${client_phone_number}`}
                        </div>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            )
          )}
        </List>
      )}
    </Box>
  );
}
