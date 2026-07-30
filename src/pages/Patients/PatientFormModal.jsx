import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from '../../data/DataContext';

const PatientFormModal = ({ isOpen, onClose, patientToEdit }) => {
  const { addPatient, updatePatient, patients } = useData();
  const [formData, setFormData] = useState({
    noRM: '',
    name: '',
    nik: '',
    gender: '',
    birthDate: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        id: patientToEdit.id,
        noRM: patientToEdit.medical_record_no || patientToEdit.noRM || '',
        name: patientToEdit.name || '',
        nik: patientToEdit.nik || '',
        gender: patientToEdit.gender || '',
        birthDate: patientToEdit.birth_date || patientToEdit.birthDate || '',
        phone: patientToEdit.phone || '',
        address: patientToEdit.address || ''
      });
    } else {
      // Auto generate No RM for new patient
      let nextNum = 1;
      if (patients.length > 0) {
        const nums = patients.map(p => {
          const rm = p.medical_record_no || p.noRM || 'RM0000';
          return parseInt(rm.replace(/\D/g, '')) || 0;
        });
        nextNum = Math.max(...nums) + 1;
      }
      const generatedRM = `RM${nextNum.toString().padStart(4, '0')}`;
      
      setFormData({
        noRM: generatedRM,
        name: '',
        nik: '',
        gender: '',
        birthDate: '',
        phone: '',
        address: ''
      });
    }
    setErrors({});
    setSubmitError('');
  }, [patientToEdit, isOpen, patients]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.nik.trim() || !/^\d{16}$/.test(formData.nik)) newErrors.nik = 'NIK harus 16 digit angka';
    
    if (!formData.noRM.trim()) newErrors.noRM = 'Nomor RM wajib diisi';

    if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir wajib diisi';
    } else {
      const selectedDate = new Date(formData.birthDate);
      const today = new Date();
      if (selectedDate > today) newErrors.birthDate = 'Tanggal lahir tidak boleh melebihi hari ini';
    }

    if (!formData.phone.trim() || !/^\d+$/.test(formData.phone)) newErrors.phone = 'Nomor HP hanya boleh berisi angka';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let result;
      if (patientToEdit) {
        result = await updatePatient(formData);
      } else {
        result = await addPatient(formData);
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
            {patientToEdit ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
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
              <label className="block text-sm font-medium text-gray-700">No Rekam Medis *</label>
              <input
                type="text"
                name="noRM"
                value={formData.noRM}
                onChange={handleChange}
                disabled={!!patientToEdit}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.noRM ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors bg-gray-50`}
              />
              {errors.noRM && <p className="text-sm text-red-500">{errors.noRM}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">NIK (16 digit) *</label>
              <input
                type="text"
                name="nik"
                maxLength={16}
                value={formData.nik}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.nik ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Jenis Kelamin *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors bg-white`}
              >
                <option value="">Pilih...</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tanggal Lahir *</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.birthDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nomor HP *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Alamat *</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none`}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
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

export default PatientFormModal;
