import Layout from './layout';
import OrderFormPage from '../pages/OrderFormPage';
import OrdersPage from '../pages/OrdersPage';
import LogInPage from '../pages/LoginPage';
import OrderPage from '../pages/OrderPage';
import { Navigate } from 'react-router';

export const routes = [
  {
    path: '/',
    element: <LogInPage />,
  },
  {
    path: 'orders',
    element: <Layout />,
    children: [
      { path: '', element: <OrdersPage /> },
      { path: 'new', element: <OrderFormPage /> },
      { path: ':order_number', element: <OrderPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];
