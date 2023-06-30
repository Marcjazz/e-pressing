import {
  GroupByType,
  IStatsOverview,
  IStatsSummary,
} from '@e-pressing/interfaces';
import { TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Chart } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useMongoDB } from '../providers/mongoDB';
import { getStatistics } from '../services/orders.service';

export interface IDashboardProps {
  children?: JSX.Element;
}
export function Dashboard(props: IDashboardProps) {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState<GroupByType>('day');
  const [{ pending_orders, removed_orders, washed_orders }, setStatsOverview] =
    useState<IStatsOverview>({
      pending_orders: 0,
      removed_orders: 0,
      washed_orders: 0,
    });
  const [statsSummaries, setStatsSummaries] = useState<IStatsSummary[]>([]);
  useEffect(() => {
    if (!db) {
      toast.error('Mongo database was not loaded successfully !!!');
      return navigate('/');
    }
    getStatistics(db, groupBy)
      .then(({ statsOverview, statsSummaries }) => {
        setStatsOverview(statsOverview);
        setStatsSummaries(statsSummaries);
      })
      .catch(toast.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  const ctx = document.getElementById('my-chart');
  useEffect(() => {
    console.log({ ctx });
    if (ctx)
      new Chart(ctx as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
          labels: ['Pending orders', 'Washed cloths', 'Removed cloths'],
          datasets: [
            {
              hoverOffset: 4,
              label: 'Number of students',
              data: [pending_orders, washed_orders, removed_orders],
              backgroundColor: ['#ed6c02', '#3498db', '#00ba88'],
            },
          ],
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  return (
    <Box>
      <canvas id="my-chart"></canvas>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr auto' }}>
        <Typography variant="h6">Overview</Typography>
        <TextField
          id="group-by"
          name="group_by"
          label="Group by"
          size="small"
          variant="standard"
          select={true}
          value={groupBy}
          defaultValue={'day'}
          onChange={(e) => setGroupBy(e.target.value as GroupByType)}
        >
          <MenuItem value="day">day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </TextField>
      </Box>
      <List>
        {statsSummaries.map(
          ({ for: label, value: { amount, count } }, index) => (
            <>
              <ListItem
                key={index}
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
                  {index === 0 ||
                  amount < statsSummaries[index - 1].value.amount ? (
                    <TrendingUp fontSize="large" color="success" />
                  ) : amount === statsSummaries[index - 1].value.amount ? (
                    <TrendingFlat fontSize="large" color="warning" />
                  ) : (
                    <TrendingDown fontSize="large" color="error" />
                  )}
                </ListItemIcon>
              </ListItem>
              <Divider />
            </>
          )
        )}
      </List>
    </Box>
  );
}
