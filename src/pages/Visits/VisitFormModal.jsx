import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from '../../data/DataContext';

const VisitFormModal = ({ isOpen, onClose, visitToEdit }) => {
  const { addVisit, updateVisit, patients } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    patientId: '',
    complaint: '',
    doctor: '',
    status: 'Menunggu',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (visitToEdit) {
      setFormData({
        id: visitToEdit.id,
        date: visitToEdit.visit_date || visitToEdit.date || '',
        patientId: visitToEdit.patient_id || visitToEdit.patientId || '',
        complaint: visitToEdit.complaint || '',
        doctor: visitToEdit.doctor || '',
        status: visitToEdit.status || 'Menunggu',
        note: visitToEdit.note || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        patientId: '',
        complaint: '',
        doctor: '',
        status: 'Menunggu',
        note: ''
      });
    }
    setErrors({});
    setSubmitError('');
  }, [visitToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Tanggal kunjungan wajib diisi';
    if (!formData.patientId) newErrors.patientId = 'Pasien wajib dipilih';
    if (!formData.complaint.trim()) newErrors.complaint = 'Keluhan wajib diisi';
    if (!formData.doctor.trim()) newErrors.doctor = 'Dokter wajib diisi';
    if (!formData.status) newErrors.status = 'Status wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let result;
      if (visitToEdit) {
        result = await updateVisit(formData);
      } else {
        result = await addVisit(formData);
      }

      if (result && result.success === false) {
        setSubmitError(result.message || 'Terjadi kesalahan');
      } else {
        onClose();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setSubmitError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {visitToEdit ? 'Edit Data Kunjungan' : 'Tambah Kunjungan Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tanggal Kunjungan *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pasien *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.patientId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors bg-white`}
              >
                <option value="">Pilih pasien...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.medical_record_no || p.noRM} - {p.name}
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-sm text-red-500">{errors.patientId}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Keluhan *</label>
              <textarea
                name="complaint"
                rows={3}
                value={formData.complaint}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.complaint ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none`}
              />
              {errors.complaint && <p className="text-sm text-red-500">{errors.complaint}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dokter *</label>
              <input
                type="text"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.doctor ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.doctor && <p className="text-sm text-red-500">{errors.doctor}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors bg-white`}
              >
                <option value="Menunggu">🔴 Menunggu</option>
                <option value="Diproses">🟡 Diproses</option>
                <option value="Selesai">🟢 Selesai</option>
              </select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Catatan (opsional)</label>
              <textarea
                name="note"
                rows={2}
                value={formData.note}
                onChange={handleChange}
                placeholder="Catatan tambahan..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitFormModal;
