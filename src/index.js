import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './Login'; // Trang đăng nhập
import Manager from './Manager/home/home'; // Trang quản lý
import Inspector from './Inspector/home/home'
import Worker from './Worker/home/home'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/manager" element={<Manager />} />
        <Route path="/inspector" element={<Inspector />} />
        <Route path="/worker" element={<Worker />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
