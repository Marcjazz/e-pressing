import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app';
import LanguageContextProvider from './contexts/language/LanguageContextProvider';
import { BrowserRouter } from 'react-router-dom';
import RealmApp from './providers/realm';
import MongoDB from './providers/mongoDB';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <LanguageContextProvider>
        <RealmApp>
          <MongoDB>
            <App />
          </MongoDB>
        </RealmApp>
      </LanguageContextProvider>
    </BrowserRouter>
  </StrictMode>
);
