import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { User, Activity, Edit2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ phone: '', address: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get('/patient/profile.php');
      if (profileRes.data.status === 'success') {
        setProfile(profileRes.data.data);
        setEditData({ phone: profileRes.data.data.phone, address: profileRes.data.data.address });
      }
      
      const historyRes = await api.get('/patient/history.php');
      if (historyRes.data.status === 'success') {
        setHistory(historyRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/patient/update_profile.php', editData);
      alert('Profil berhasil diperbarui');
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profil tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium mb-1">Portal Pasien</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            SELAMAT DATANG {profile ? profile.name?.toUpperCase() : ''}
          </h1>
          <p className="text-blue-100 text-sm mt-2">Kelola kesehatan Anda dengan mudah melalui portal ini.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard Pasien</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profil Saya</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-blue-600"
            >
              <Edit2 size={18} />
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-3">
              <User size={40} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.medical_record_no}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">No. HP</label>
                <input 
                  type="text" 
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
                <textarea 
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg">Simpan</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">NIK</span>
                <span className="font-medium">{profile.nik}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Tanggal Lahir</span>
                <span className="font-medium">{new Date(profile.birth_date).toLocaleDateString('id-ID')}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Jenis Kelamin</span>
                <span className="font-medium">{profile.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">No. HP</span>
                <span className="font-medium">{profile.phone || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Alamat</span>
                <span className="font-medium">{profile.address || '-'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-teal-600" />
            Riwayat Kunjungan
          </h2>
          
          <div className="space-y-4">
            {history.map((visit) => (
              <div key={visit.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md mb-2 inline-block">
                      {new Date(visit.visit_date).toLocaleDateString('id-ID')}
                    </span>
                    <h3 className="font-medium text-gray-900 text-sm mt-1">{visit.complaint}</h3>
                  </div>
                  <StatusBadge status={visit.status} />
                </div>
                
                <div className="mt-3 bg-slate-50 p-3 rounded-lg flex flex-col gap-2">
                  <div className="text-sm flex justify-between">
                    <span className="text-gray-500">Dokter:</span>
                    <span className="font-medium">{visit.doctor_name}</span>
                  </div>
                  {visit.service_note && (
                    <div className="text-sm flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-gray-500">Catatan:</span>
                      <span className="font-medium text-blue-700 text-right">{visit.service_note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada riwayat kunjungan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
