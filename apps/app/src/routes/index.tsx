import Layout from './layout';
import NewOrder from '../pages/new-order';
import Orders from '../pages/orders';
import LogIn from '../pages/login';

export const routes = [
  {
    path: '/',
    element: <LogIn />,
  },
  {
    path: '/-',
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
