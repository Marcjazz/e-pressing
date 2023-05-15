import Layout from '../pages/layout';
import Order from '../pages/order';

export const routes = [
  // {
  //   path: '/',
  //   element: <AuthPage />,
  // },
  {
    path: '',
    element: <Layout />,
    children: [{ path: 'record', element: <Order /> }],
  },
  //   {
  //     path: '*',
  //     element: <Navigate to="/" />,
  //   },
];
