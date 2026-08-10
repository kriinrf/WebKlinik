import React, { useState } from 'react';
import { Users, ClipboardList, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../../data/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { patients, visits } = useData();
  const [filter, setFilter] = useState('perbulan');

  // Process data for charts
  const processChartData = () => {
    const today = new Date();
    const data = [];

    if (filter === 'perhari') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
        
        const count = visits.filter(v => (v.visit_date || v.date) === dateStr).length;
        data.push({ name: dayName, kunjungan: count });
      }
    } else if (filter === 'perminggu') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const endDay = new Date(today);
        endDay.setDate(today.getDate() - (i * 7));
        const startDay = new Date(endDay);
        startDay.setDate(endDay.getDate() - 6);
        
        const count = visits.filter(v => {
          const vDate = new Date(v.visit_date || v.date);
          vDate.setHours(0, 0, 0, 0);
          startDay.setHours(0, 0, 0, 0);
          endDay.setHours(23, 59, 59, 999);
          return vDate >= startDay && vDate <= endDay;
        }).length;
        
        const label = `${startDay.getDate()}/${startDay.getMonth()+1} - ${endDay.getDate()}/${endDay.getMonth()+1}`;
        data.push({ name: label, kunjungan: count });
      }
    } else if (filter === 'perbulan') {
      // Months of current year
      const currentYear = today.getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      months.forEach((month, index) => {
        const count = visits.filter(v => {
          const vDate = new Date(v.visit_date || v.date);
          return vDate.getFullYear() === currentYear && vDate.getMonth() === index;
        }).length;
        
        // Show up to current month
        if (index <= today.getMonth()) {
          data.push({ name: month, kunjungan: count });
        }
      });
    } else if (filter === 'pertahun') {
      // Last 5 years
      const currentYear = today.getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        const count = visits.filter(v => new Date(v.visit_date || v.date).getFullYear() === year).length;
        data.push({ name: year.toString(), kunjungan: count });
      }
    }
    return data;
  };

  const chartData = processChartData();

  // Get 5 latest visits
  const latestVisits = [...visits]
    .sort((a, b) => new Date(b.visit_date || b.date) - new Date(a.visit_date || a.date))
    .slice(0, 5)
    .map(visit => {
      // API JOIN provides patient_name; fallback to lookup
      const patientName = visit.patient_name || (() => {
        const patient = patients.find(p => p.id == visit.patient_id);
        return patient ? patient.name : 'Unknown';
      })();
      return { ...visit, patientName };
    });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative">
          <p className="text-purple-200 text-sm font-medium mb-1">Panel Administrasi</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            SELAMAT DATANG ADMIN
          </h1>
          <p className="text-purple-200 text-sm mt-2">Kelola seluruh data klinik dari satu tempat.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pasien</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{patients.length}</h3>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-2 font-medium">
              <TrendingUp size={16} />
              <span>Diperbarui hari ini</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
            <ClipboardList size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Kunjungan</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{visits.length}</h3>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-2 font-medium">
              <TrendingUp size={16} />
              <span>Diperbarui hari ini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Grafik Kunjungan</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 px-3 py-2 outline-none transition-colors cursor-pointer"
            >
              <option value="perhari">Per Hari (7 Hari Terakhir)</option>
              <option value="perminggu">Per Minggu (4 Minggu Terakhir)</option>
              <option value="perbulan">Per Bulan (Tahun Ini)</option>
              <option value="pertahun">Per Tahun (5 Tahun Terakhir)</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [value, 'Kunjungan']}
                />
                <Bar dataKey="kunjungan" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Visits */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">5 Kunjungan Terakhir</h2>
          <div className="space-y-4">
            {latestVisits.map((visit) => (
              <div key={visit.id} className="flex items-start justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900">{visit.patientName}</p>
                  <p className="text-xs text-gray-500 mt-1">{visit.complaint} • {visit.doctor_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(visit.visit_date || visit.date).toLocaleDateString('id-ID')}</p>
                </div>
                <StatusBadge status={visit.status} />
              </div>
            ))}
            {latestVisits.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada kunjungan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
