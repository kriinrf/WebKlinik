import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    phone: '',
    birth_place: '',
    birth_date: '',
    address: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { registerPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // NIK hanya angka, max 16
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    // Phone hanya angka
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi frontend
    if (formData.nik.length !== 16) {
      setError('NIK harus 16 angka');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setIsLoading(true);
    const result = await registerPatient(formData);
    setIsLoading(false);

    if (result.status === 'success') {
      setSuccess(result.data);
    } else {
      setError(result.message || 'Registrasi gagal');
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] shadow-xl border border-white/50 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-100/50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-teal-100/50 blur-2xl"></div>
          
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
            <p className="text-gray-600 mb-6">Akun Anda telah berhasil dibuat.</p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nama:</span>
                <span className="font-medium text-gray-900">{success.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Username:</span>
                <span className="font-mono font-medium text-blue-600">{success.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">No. RM:</span>
                <span className="font-mono font-medium text-gray-900">{success.medical_record_no}</span>
              </div>
            </div>

            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg mb-6">
              ⚠️ Simpan username Anda untuk login: <strong className="font-mono">{success.username}</strong>
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/20"
            >
              Login ke Sistem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-[2rem] shadow-xl border border-white/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-100/50 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-teal-100/50 blur-2xl"></div>

        <div className="relative">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registrasi Pasien</h2>
              <p className="text-sm text-gray-500">Buat akun pasien baru</p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* NIK */}
            <div>
              <label htmlFor="reg-nik" className="block text-sm font-medium text-gray-700 mb-1">
                NIK <span className="text-xs text-gray-400">(16 angka)</span>
              </label>
              <input
                id="reg-nik"
                name="nik"
                type="text"
                required
                className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow ${
                  formData.nik && formData.nik.length !== 16 ? 'ring-amber-400' : 'ring-gray-300'
                }`}
                placeholder="Masukkan 16 digit NIK"
                value={formData.nik}
                onChange={handleChange}
              />
              {formData.nik && formData.nik.length !== 16 && (
                <p className="text-xs text-amber-600 mt-1">{formData.nik.length}/16 digit</p>
              )}
              {formData.nik && formData.nik.length === 16 && (
                <p className="text-xs text-green-600 mt-1">✓ 16 digit</p>
              )}
            </div>

            {/* No Telpon */}
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">No Telepon</label>
              <input
                id="reg-phone"
                name="phone"
                type="text"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                placeholder="Contoh: 08123456789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-birth-place" className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                <input
                  id="reg-birth-place"
                  name="birth_place"
                  type="text"
                  required
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                  placeholder="Kota lahir"
                  value={formData.birth_place}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="reg-birth-date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  id="reg-birth-date"
                  name="birth_date"
                  type="date"
                  required
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                id="reg-address"
                name="address"
                required
                rows={2}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow resize-none"
                placeholder="Masukkan alamat lengkap"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  required
                  className={`block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-shadow ${
                    formData.confirm_password && formData.password !== formData.confirm_password 
                      ? 'ring-red-400' 
                      : 'ring-gray-300'
                  }`}
                  placeholder="Ulangi password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirm_password && formData.password !== formData.confirm_password && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all duration-200 shadow-md shadow-blue-500/20"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mendaftar...
                  </span>
                ) : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Login di sini
              </Link>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Daftar sebagai{' '}
              <Link to="/register/dokter" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                Dokter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
