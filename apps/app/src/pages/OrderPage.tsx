import { ClothStatus, IOrderDetails } from '@e-pressing/interfaces';
import { Done, DoneAll, Schedule } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import OrderItem from '../components/OrderItem';
import { useMongoDB } from '../providers/mongoDB';
import { changeOrderStatus, getOrder } from '../services/orders.service';
import { theme } from '../theme';

export interface IOrderPageProps {
  children?: JSX.Element;
}

export default function OrderPage(props: IOrderPageProps) {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const { order_number } = useParams();

  const [
    { cloths, reception_date, client_fullname, client_phone_number },
    setOrder,
  ] = useState<IOrderDetails>({
    reception_date: new Date().toLocaleDateString(),
    client_phone_number: '',
    client_fullname: '',
    order_number: '',
    cloths: [],
  });

  useEffect(() => {
    if (!db) {
      toast.error('No active session was found, please sign in !!!');
      return navigate('/');
    }
    if (order_number)
      getOrder(db, order_number)
        .then((order) => (order ? setOrder(order) : null))
        .catch(toast.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_number]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (selected: string[], newStatus: ClothStatus) => {
    if (!db) {
      toast.error('No active session was found, please sign in !!!');
      return navigate('/');
    }
    if (order_number) {
      setIsSubmitting(true);
      changeOrderStatus(db, {
        clothIds: selected,
        status: newStatus,
        order_number,
      })
        .then(() => {
          setOrder((order) => ({
            ...order,
            cloths: order.cloths.map((cloth) =>
              selected.includes(cloth.cloth_id)
                ? { ...cloth, status: newStatus }
                : cloth
            ),
          }));
        })
        .catch((error) => toast.error(error))
        .finally(() => setIsSubmitting(false));
    }
  };
  const status = cloths.find((_) => _.status === 'PENDING')
    ? 'PENDING'
    : cloths.find((_) => _.status === 'WASHED')
    ? 'WASHED'
    : 'REMOVED';

  const [expandedNumber, setExpandedumber] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (clothId: string) => {
    const isSelected = selected.includes(clothId);
    if (isSelected) {
      setSelected(selected.filter((_) => _ !== clothId));
    } else {
      setSelected([...selected, clothId]);
    }
  };

  return (
    <Box
      sx={{
        minWidth: '300px',
        width: '50vw',
        display: 'grid',
        height: '80vh',
        gridTemplateRows: 'auto 1fr auto',
        gap: theme.spacing(1),
      }}
    >
      <Box alignItems="flex-start" sx={{ gap: theme.spacing(1) }}>
        <Box sx={{ display: 'grid', textAlign: 'center' }}>
          <div style={{ justifySelf: 'center' }}>
            <Tooltip title={status}>
              {status === 'PENDING' ? (
                <Schedule sx={{ color: '#ed6c02', fontSize: '50px' }} />
              ) : status === 'WASHED' ? (
                <Done sx={{ color: '#3498db', fontSize: '50px' }} />
              ) : (
                <DoneAll sx={{ color: '#00ba88', fontSize: '50px' }} />
              )}
            </Tooltip>
          </div>
          <Typography variant="caption">{status}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{order_number}</Typography>
          <Typography variant="body2">
            {` ${client_fullname}, ${client_phone_number}`}
          </Typography>
          <Typography variant="body2" color="text.primary">
            <b>Due date:</b>
            {` ${new Date(reception_date).toDateString()}`}
          </Typography>
        </Box>
      </Box>
      <div>
        {cloths.map((order, index) => (
          <OrderItem
            key={index}
            {...order}
            selected={selected}
            handleSelect={handleSelect}
            handleExpandedNumber={(expanded) =>
              setExpandedumber((count) => (expanded ? ++count : --count))
            }
            handleStatusChange={(clothId, newStatus) =>
              handleStatusChange([clothId], newStatus)
            }
          />
        ))}
      </div>
      {order_number && expandedNumber === 0 && (
        <Button
          variant="contained"
          size="small"
          sx={{ width: '50%', justifySelf: 'center' }}
          disabled={isSubmitting || selected.length === 0}
          onClick={() =>
            handleStatusChange(
              selected,
              status === 'PENDING' ? 'WASHED' : 'REMOVED'
            )
          }
        >
          {isSubmitting && <CircularProgress />}
          {status === 'PENDING' ? 'WASHED' : 'REMOVED'}
        </Button>
      )}
    </Box>
  );
}
