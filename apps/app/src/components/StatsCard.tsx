import { IStatsSummary } from '@e-pressing/interfaces';
import { TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';
import {
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

export interface IStatsCardProps extends IStatsSummary {
  previousValue?: number;
  children?: JSX.Element;
}
export function StatsCard({
  for: label,
  previousValue,
  value: { amount, count },
}: IStatsCardProps) {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          minWidth: '300px',
        }}
      >
        <ListItemText
          primary={<Typography variant="subtitle2">{label}</Typography>}
          secondary={
            <>
              <Typography variant="body2">
                Number of orders: <b>{count}</b>
              </Typography>
              <Typography variant="body2">
                Generated amount:
                <b>{amount}</b>
              </Typography>
            </>
          }
        />
        <ListItemIcon>
          {!previousValue || amount < previousValue ? (
            <TrendingUp fontSize="large" color="success" />
          ) : amount === previousValue ? (
            <TrendingFlat fontSize="large" color="warning" />
          ) : (
            <TrendingDown fontSize="large" color="error" />
          )}
        </ListItemIcon>
      </ListItem>
      <Divider />
    </>
  );
}
