import React from 'react';
import ReactDOM from 'react-dom/client';   // ✅ Use only this import
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);  // ✅ createRoot expects only container

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
