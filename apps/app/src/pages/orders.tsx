import { Box } from '@mui/material';

export interface IOrdersProps {
  children?: JSX.Element;
}

export default function Orders(orders: IOrdersProps) {
  return <Box>All recorded orders</Box>;
}
