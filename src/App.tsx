import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Rankings from './pages/Rankings';
import Tournament from './pages/Tournament';
import Register from './pages/Register';
import UserControl from './components/UserControl'; // Importa o componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Rankings />} />
          <Route path="tournament" element={<Tournament />} />
          <Route path="register" element={<Register />} />
          <Route path="user-control" element={<UserControl />} /> {/* Nova rota */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
