import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/scss/global.scss';
import AppShell from './components/appShell/appShell';
import PageTransition from './components/pageTransition/pageTransition';
import AppRoutes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
const routerBasename =
  process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : undefined;

root.render(
  <React.StrictMode>
    <BrowserRouter basename={routerBasename}>
      <PageTransition>
        {(transitionLocation) => (
          <AppShell themeLocation={transitionLocation}>
            <AppRoutes location={transitionLocation} />
          </AppShell>
        )}
      </PageTransition>
    </BrowserRouter>
  </React.StrictMode>
);
