import { CssBaseline, ThemeProvider } from '@mui/material';
import { IntlProvider } from 'react-intl';
import { useRoutes } from 'react-router';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from './contexts/language/LanguageContextProvider';
import enMessages from './languages/en-us';
import frMessages from './languages/fr';
import { routes } from './routes';
import { theme } from './theme';

export function App() {
  const routing = useRoutes(routes);
  const { activeLanguage } = useLanguage();
  const activeMessages = activeLanguage === 'Fr' ? frMessages : enMessages;

  return (
    <IntlProvider
      messages={activeMessages}
      locale={activeLanguage}
      defaultLocale="Fr"
    >
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
    </IntlProvider>
  );
}

export default App;
