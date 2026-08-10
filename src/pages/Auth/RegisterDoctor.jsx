import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const POLI_OPTIONS = [
  'Umum',
  'Gigi',
  'Anak',
  'Penyakit Dalam',
  'THT',
  'Mata',
  'Kulit & Kelamin'
];

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    poli: '',
    no_str: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // No STR hanya angka, max 4
    if (name === 'no_str') {
      const numericValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi frontend
    if (formData.no_str.length !== 4) {
      setError('No STR harus 4 angka');
      return;
    }

    if (!formData.poli) {
      setError('Pilih poli terdaftar');
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
    const result = await registerDoctor(formData);
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] shadow-xl border border-white/50 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-100/50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-teal-100/50 blur-2xl"></div>
          
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
            <p className="text-gray-600 mb-6">Akun dokter Anda telah berhasil dibuat.</p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nama:</span>
                <span className="font-medium text-gray-900">{success.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Username:</span>
                <span className="font-mono font-medium text-teal-600">{success.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Poli:</span>
                <span className="font-medium text-gray-900">{success.poli}</span>
              </div>
            </div>

            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg mb-6">
              ⚠️ Simpan username Anda untuk login: <strong className="font-mono">{success.username}</strong>
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 shadow-md shadow-teal-500/20"
            >
              Login ke Sistem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-[2rem] shadow-xl border border-white/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-100/50 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-100/50 blur-2xl"></div>

        <div className="relative">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors mb-6">
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2.5 rounded-xl text-teal-600">
              <Stethoscope size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registrasi Dokter</h2>
              <p className="text-sm text-gray-500">Buat akun dokter baru</p>
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
              <label htmlFor="dr-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                id="dr-name"
                name="name"
                type="text"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow"
                placeholder="Contoh: dr. Ahmad Fauzi"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Poli Terdaftar */}
            <div>
              <label htmlFor="dr-poli" className="block text-sm font-medium text-gray-700 mb-1">Poli Terdaftar</label>
              <select
                id="dr-poli"
                name="poli"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow bg-white cursor-pointer"
                value={formData.poli}
                onChange={handleChange}
              >
                <option value="">-- Pilih Poli --</option>
                {POLI_OPTIONS.map((poli) => (
                  <option key={poli} value={poli}>{poli}</option>
                ))}
              </select>
            </div>

            {/* No STR */}
            <div>
              <label htmlFor="dr-str" className="block text-sm font-medium text-gray-700 mb-1">
                No STR <span className="text-xs text-gray-400">(4 angka)</span>
              </label>
              <input
                id="dr-str"
                name="no_str"
                type="text"
                required
                className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow ${
                  formData.no_str && formData.no_str.length !== 4 ? 'ring-amber-400' : 'ring-gray-300'
                }`}
                placeholder="Masukkan 4 digit No STR"
                value={formData.no_str}
                onChange={handleChange}
              />
              {formData.no_str && formData.no_str.length !== 4 && (
                <p className="text-xs text-amber-600 mt-1">{formData.no_str.length}/4 digit</p>
              )}
              {formData.no_str && formData.no_str.length === 4 && (
                <p className="text-xs text-green-600 mt-1">✓ 4 digit</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="dr-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="dr-email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="dr-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="dr-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow"
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
            <div>
              <label htmlFor="dr-confirm" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  id="dr-confirm"
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  required
                  className={`block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-teal-600 sm:text-sm transition-shadow ${
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
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 transition-all duration-200 shadow-md shadow-teal-500/20"
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
              <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                Login di sini
              </Link>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Daftar sebagai{' '}
              <Link to="/register/pasien" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Pasien
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;
