import { IOrder } from '@e-pressing/interfaces';
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '../theme';
import { Done, DoneAll, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export interface IOrderCardProps extends IOrder {
  children?: JSX.Element;
}
export function OrderCard({
  client_fullname,
  client_phone_number,
  number_of_cloths,
  order_number,
  reception_date,
  status,
}: IOrderCardProps) {
  const navigate = useNavigate();

  return (
    <Paper onClick={() => navigate(`/orders/${order_number}`)}>
      <ListItem alignItems="flex-start" sx={{ gap: theme.spacing(1) }}>
        <ListItemIcon sx={{ display: 'grid' }}>
          <Box style={{ justifySelf: 'center' }}>
            <Tooltip title={status}>
              {status === 'PENDING' ? (
                <Schedule fontSize="large" sx={{ color: '#ed6c02' }} />
              ) : status === 'WASHED' ? (
                <Done sx={{ color: '#3498db' }} />
              ) : (
                <DoneAll sx={{ color: '#00ba88' }} />
              )}
            </Tooltip>
          </Box>
          <Typography variant="caption">
            {status === 'REMOVED' ? 'GIVE OUT' : status}
          </Typography>
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="h6">{order_number}</Typography>}
          secondary={
            <>
              <Box>
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
              </Box>
              <Box>
                <b>Client:</b>
                {` ${client_fullname}, ${client_phone_number}`}
              </Box>
            </>
          }
        />
      </ListItem>
    </Paper>
  );
}
