import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { patientsApi, visitsApi } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch all data on mount ---
  const fetchPatients = useCallback(async () => {
    try {
      const res = await patientsApi.getAll();
      if (res.data.status === 'success') {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Gagal memuat data pasien');
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await visitsApi.getAll();
      if (res.data.status === 'success') {
        setVisits(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
      setError('Gagal memuat data kunjungan');
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchPatients(), fetchVisits()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchPatients, fetchVisits]);

  // --- Patients CRUD ---
  const addPatient = async (patient) => {
    try {
      const payload = {
        medical_record_no: patient.noRM,
        nik: patient.nik,
        name: patient.name,
        gender: patient.gender,
        birth_date: patient.birthDate,
        phone: patient.phone,
        address: patient.address,
      };
      const res = await patientsApi.create(payload);
      if (res.data.status === 'success') {
        await fetchPatients();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menambahkan pasien';
      return { success: false, message: msg };
    }
  };

  const updatePatient = async (patient) => {
    try {
      const payload = {
        medical_record_no: patient.noRM || patient.medical_record_no,
        nik: patient.nik,
        name: patient.name,
        gender: patient.gender,
        birth_date: patient.birthDate || patient.birth_date,
        phone: patient.phone,
        address: patient.address,
      };
      const res = await patientsApi.update(patient.id, payload);
      if (res.data.status === 'success') {
        await fetchPatients();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui pasien';
      return { success: false, message: msg };
    }
  };

  const deletePatient = async (id) => {
    try {
      const res = await patientsApi.delete(id);
      if (res.data.status === 'success') {
        await Promise.all([fetchPatients(), fetchVisits()]);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus pasien';
      return { success: false, message: msg };
    }
  };

  // --- Visits CRUD ---
  const addVisit = async (visit) => {
    try {
      const payload = {
        patient_id: parseInt(visit.patientId || visit.patient_id),
        visit_date: visit.date || visit.visit_date,
        complaint: visit.complaint,
        doctor: visit.doctor,
        status: visit.status,
        note: visit.note || null,
      };
      const res = await visitsApi.create(payload);
      if (res.data.status === 'success') {
        await fetchVisits();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menambahkan kunjungan';
      return { success: false, message: msg };
    }
  };

  const updateVisit = async (visit) => {
    try {
      const payload = {
        patient_id: parseInt(visit.patientId || visit.patient_id),
        visit_date: visit.date || visit.visit_date,
        complaint: visit.complaint,
        doctor: visit.doctor,
        status: visit.status,
        note: visit.note || null,
      };
      const res = await visitsApi.update(visit.id, payload);
      if (res.data.status === 'success') {
        await fetchVisits();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui kunjungan';
      return { success: false, message: msg };
    }
  };

  const deleteVisit = async (id) => {
    try {
      const res = await visitsApi.delete(id);
      if (res.data.status === 'success') {
        await fetchVisits();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus kunjungan';
      return { success: false, message: msg };
    }
  };

  const value = {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    visits,
    addVisit,
    updateVisit,
    deleteVisit,
    loading,
    error,
    refreshPatients: fetchPatients,
    refreshVisits: fetchVisits,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
