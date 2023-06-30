import Layout from './layout';
import OrderFormPage from '../pages/OrderFormPage';
import OrderPage from '../pages/OrderPage';
import LogInPage from '../pages/LoginPage';

export const routes = [
  {
    path: '/',
    element: <LogInPage />,
  },
  {
    path: '/-',
    element: <Layout />,
    children: [
      { path: 'new', element: <OrderFormPage /> },
      { path: 'orders', element: <OrderPage /> },
    ],
  },
  //   {
  //     path: '*',
  //     element: <Navigate to="/" />,
  //   },
];
