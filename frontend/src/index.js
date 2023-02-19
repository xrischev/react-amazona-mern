import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HelmetProvider} from 'react-helmet-async'
import {StoreProvider} from "./Store";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <StoreProvider>
          <HelmetProvider>
              <PayPalScriptProvider deferLoading={true}>
                  {/*<PayPalButtons />*/}
                  <App />
              </PayPalScriptProvider>

          </HelmetProvider>
      </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
