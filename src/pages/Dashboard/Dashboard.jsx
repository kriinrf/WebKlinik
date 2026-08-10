import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'dokter') {
    return <DoctorDashboard />;
  } else if (user.role === 'pasien') {
    return <PatientDashboard />;
  }

  return <div>Role tidak dikenali</div>;
};

export default Dashboard;
