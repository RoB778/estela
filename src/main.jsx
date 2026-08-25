import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ArticuloDetalle from './ArticuloDetalle.jsx'
import './index.css'
import { inject } from '@vercel/analytics';

inject();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App initialPagina="sommelier" />} />
        <Route path="/guia" element={<App initialPagina="guia" />} />
        <Route path="/comunidad" element={<App initialPagina="comunidad" />} />
        <Route path="/guia/:slug" element={<ArticuloDetalle />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
