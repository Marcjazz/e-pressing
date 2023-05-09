import Layout from '../pages/layout';

export const routes = [
  // {
  //   path: '/',
  //   element: <AuthPage />,
  // },
  {
    path: '',
    element: <Layout />,
    // children: [{ path: 'schools', element: <Schools /> }],
  },
  //   {
  //     path: '*',
  //     element: <Navigate to="/" />,
  //   },
];
