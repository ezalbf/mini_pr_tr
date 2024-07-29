// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import TxStool from './screens/TxStool';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <TxStool />
  </React.StrictMode>,
  document.getElementById('root')
);
