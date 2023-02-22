import React from 'react';
import ReactDOM from 'react-dom/client';
import './bibliotecas/bootstrap';
import './bibliotecas/fontawesome';
import './bibliotecas/moment';
import './bibliotecas/cross-domain-storage';
import 'antd/dist/antd.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
