import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app';
import LanguageContextProvider from './contexts/language/LanguageContextProvider';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <LanguageContextProvider>
        <App />
      </LanguageContextProvider>
    </BrowserRouter>
  </StrictMode>
);
