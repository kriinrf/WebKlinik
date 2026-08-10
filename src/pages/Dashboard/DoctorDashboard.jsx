import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../../context/AuthContext';
import { Users, ClipboardList } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [serviceNote, setServiceNote] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await api.get('/doctor/visits.php');
      if (response.data.status === 'success') {
        setVisits(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching visits', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/doctor/update_status.php?id=${id}`, { status });
      fetchVisits();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleUpdateNote = async (id) => {
    try {
      await api.put(`/doctor/update_note.php?id=${id}`, { note: serviceNote });
      alert('Catatan berhasil disimpan');
      fetchVisits();
      setSelectedVisit(null);
    } catch (error) {
      console.error('Error updating note', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative">
          <p className="text-teal-100 text-sm font-medium mb-1">Portal Dokter</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            SELAMAT DATANG DOKTER {user?.name ? user.name.toUpperCase() : user?.username?.toUpperCase()}
          </h1>
          <p className="text-teal-100 text-sm mt-2">Kelola pelayanan pasien Anda dengan efisien.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard Dokter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pasien Hari Ini</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{visits.length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pelayanan Hari Ini</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{visit.patient_name} <span className="text-xs text-gray-400">({visit.medical_record_no})</span></p>
                  <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Keluhan:</span> {visit.complaint}</p>
                  {visit.service_note && (
                    <p className="text-sm text-blue-600 mt-1"><span className="font-medium">Catatan:</span> {visit.service_note}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={visit.status}
                    onChange={(e) => handleUpdateStatus(visit.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                  <button 
                    onClick={() => { setSelectedVisit(visit); setServiceNote(visit.service_note || ''); }}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
                  >
                    Catatan
                  </button>
                </div>
              </div>
            ))}
            {visits.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Tidak ada pasien hari ini.</p>
            )}
          </div>
        </div>
      </div>

      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Catatan Pelayanan - {selectedVisit.patient_name}</h3>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32"
              placeholder="Tuliskan catatan pelayanan..."
              value={serviceNote}
              onChange={(e) => setServiceNote(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button 
                onClick={() => handleUpdateNote(selectedVisit.id)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
