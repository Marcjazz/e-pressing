import { Navigate } from 'react-router';
import { Dashboard } from '../pages/Dashboard';
import LogInPage from '../pages/LoginPage';
import OrderFormPage from '../pages/OrderFormPage';
import OrderPage from '../pages/OrderPage';
import OrdersPage from '../pages/OrdersPage';
import Layout from './layout';

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
      { path: 'dashboard', element: <Dashboard /> },
      { path: ':order_number', element: <OrderPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];
