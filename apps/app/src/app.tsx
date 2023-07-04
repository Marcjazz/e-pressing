import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { routes } from './routes';
import { theme } from './theme';

export function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Flip}
      />
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;
