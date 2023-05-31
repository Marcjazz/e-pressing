import Layout from './layout';
import NewOrder from '../pages/new-order';
import Orders from '../pages/orders';

export const routes = [
  // {
  //   path: '/',
  //   element: <AuthPage />,
  // },
  {
    path: '',
    element: <Layout />,
    children: [
      { path: 'new', element: <NewOrder /> },
      { path: 'orders', element: <Orders /> },
    ],
  },
  //   {
  //     path: '*',
  //     element: <Navigate to="/" />,
  //   },
];
