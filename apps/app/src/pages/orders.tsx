import { IOrder } from '@e-pressing/interfaces';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import OrderCard from '../components/orderCard';

export interface IOrdersProps {
  children?: JSX.Element;
}

export default function Orders(props: IOrdersProps) {
  const [orders, setOrders] = useState<IOrder[]>([]);

  //TODO call api to fetch registered orders
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
            status: 'READY',
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
            status: 'READY',
            washing_price: 2500,
          },
        ],
        order_id: crypto.randomUUID(),
        order_number: 'PRESA060201',
        status: 'READY',
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
            status: 'READY',
            washing_price: 2500,
          },
        ],
        order_id: crypto.randomUUID(),
        order_number: 'PRESA060201',
        status: 'REMOVED',
      },
    ]);
  }, []);

  return (
    <Box>
      <Typography variant="h4">All recorded cloths</Typography>
      {orders.map((order) => (
        <OrderCard {...order} />
      ))}
    </Box>
  );
}
