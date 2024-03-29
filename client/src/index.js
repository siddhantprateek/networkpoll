import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { SlashAuthProvider } from '@slashauth/slashauth-react';

const providerOptions = {
  walletconnect: {
    infuraId: '5f33013cac72474db85f8f603c842d92',
    bridge: 'https://bridge.walletconnect.org',
  },
  coinbasewallet: {
    appName: 'Slashauth Demo',
    infuraId: '5f33013cac72474db85f8f603c842d92',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SlashAuthProvider 
        clientID="z8dE0YKKnTic5cFf" 
        providers={providerOptions}>
        <App />
      </SlashAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
