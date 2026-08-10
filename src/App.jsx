import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Visits from './pages/Visits/Visits';
import Login from './pages/Auth/Login';
import RegisterPatient from './pages/Auth/RegisterPatient';
import RegisterDoctor from './pages/Auth/RegisterDoctor';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register/pasien" element={<RegisterPatient />} />
      <Route path="/register/dokter" element={<RegisterDoctor />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="pasien" element={
          <ProtectedRoute allowedRoles={['admin', 'dokter']}>
            <Patients />
          </ProtectedRoute>
        } />
        <Route path="kunjungan" element={
          <ProtectedRoute allowedRoles={['admin', 'dokter']}>
            <Visits />
          </ProtectedRoute>
        } />
        <Route path="profil" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
