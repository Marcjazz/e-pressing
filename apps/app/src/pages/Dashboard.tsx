import {
  GroupByType,
  IStatsOverview,
  IStatsSummary,
} from '@e-pressing/interfaces';
import { Box, List, MenuItem, TextField, Typography } from '@mui/material';
import { Chart } from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { StatsCard } from '../components/StatsCard';
import { useMongoDB } from '../providers/mongoDB';
import Layout from '../routes/layout';
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
      toast.error('No active session was found, please sign in !!!');
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
  const [chart, setChart] = useState<Chart<'doughnut', number[], string>>();
  useEffect(() => {
    if (ctx) {
      chart?.destroy();
      const newChart = new Chart(ctx as HTMLCanvasElement, {
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
      setChart(newChart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  return (
    <Layout>
      <Box
        sx={{
          display: 'grid',
          width: '80vw',
          gridTemplate: {
            md: '1fr / auto 1fr',
          },
        }}
      >
        <div>
          <canvas id="my-chart"></canvas>
        </div>
        <Box>
          <Box
            sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr auto' }}
          >
            <Typography variant="h6" marginLeft={2}>
              Overview
            </Typography>
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
            {statsSummaries.map((statsSummary, index) => (
              <StatsCard key={index} {...statsSummary} />
            ))}
          </List>
        </Box>
      </Box>
    </Layout>
  );
}
