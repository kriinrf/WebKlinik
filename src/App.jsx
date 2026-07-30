import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Visits from './pages/Visits/Visits';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pasien" element={<Patients />} />
        <Route path="kunjungan" element={<Visits />} />
      </Route>
    </Routes>
  );
}

export default App;
