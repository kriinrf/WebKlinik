import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../data/DataContext';
import { useAuth } from '../../context/AuthContext';
import VisitFormModal from './VisitFormModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import StatusBadge from '../../components/StatusBadge';

const Visits = () => {
  const { visits, patients, deleteVisit } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enrich visits with patient data for display and search
  // API already returns patient_name and medical_record_no via JOIN
  const enrichedVisits = visits.map(visit => {
    // If API provides patient_name (from JOIN), use it; otherwise fallback
    const patientName = visit.patient_name || (() => {
      const patient = patients.find(p => p.id == visit.patient_id);
      return patient ? patient.name : 'Unknown';
    })();
    const patientRM = visit.medical_record_no || (() => {
      const patient = patients.find(p => p.id == visit.patient_id);
      return patient ? patient.medical_record_no : '-';
    })();
    return {
      ...visit,
      patientName,
      patientRM
    };
  });

  // Filter based on search
  const filteredVisits = enrichedVisits.filter(visit => 
    (visit.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visit.complaint || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visit.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visit.patientRM || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.visit_date || b.date) - new Date(a.visit_date || a.date)); // Sort latest first

  // Pagination logic
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setSelectedVisit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (visit) => {
    // We only pass the original visit data to the form, not the enriched data
    const originalVisit = visits.find(v => v.id === visit.id);
    setSelectedVisit(originalVisit);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (visit) => {
    setSelectedVisit(visit);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVisit) {
      deleteVisit(selectedVisit.id);
      setIsDeleteOpen(false);
      setSelectedVisit(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Kunjungan</h1>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama pasien, keluhan, atau dokter..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors bg-gray-50/50"
          />
        </div>
        
        {user?.role !== 'pasien' && (
          <button 
            onClick={handleAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            <span>Tambah Kunjungan</span>
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Pasien</th>
                <th className="px-6 py-4 font-semibold">Keluhan</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Dokter</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                {user?.role !== 'pasien' && (
                  <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVisits.length > 0 ? (
                paginatedVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(visit.visit_date || visit.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{visit.patientName}</div>
                      <div className="text-sm text-gray-500">{visit.patientRM}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{visit.complaint}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{visit.doctor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={visit.status} />
                    </td>
                    {user?.role !== 'pasien' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(visit)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(visit)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data kunjungan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-gray-900">{startIndex + 1}</span> - <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, filteredVisits.length)}</span> dari <span className="font-medium text-gray-900">{filteredVisits.length}</span> kunjungan
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <VisitFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        visitToEdit={selectedVisit} 
      />
      
      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Kunjungan"
        message="Apakah Anda yakin ingin menghapus data kunjungan ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
};

export default Visits;
