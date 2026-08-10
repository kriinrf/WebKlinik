import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Stethoscope, Shield, Eye, EyeOff, Save, KeyRound, Edit2, X } from 'lucide-react';

const POLI_OPTIONS = [
  'Umum', 'Gigi', 'Anak', 'Penyakit Dalam', 'THT', 'Mata', 'Kulit & Kelamin'
];

const Profile = () => {
  const { user, changePassword, updateProfile, refreshUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'pasien' && user.profile) {
        setProfileData({
          name: user.profile.name || '',
          nik: user.profile.nik || '',
          phone: user.profile.phone || '',
          birth_place: user.profile.birth_place || '',
          birth_date: user.profile.birth_date || '',
          address: user.profile.address || '',
          email: user.profile.email || ''
        });
      } else if (user.role === 'dokter' && user.profile) {
        setProfileData({
          name: user.profile.name || '',
          poli: user.profile.poli || '',
          no_str: user.profile.no_str || '',
          email: user.profile.email || ''
        });
      } else if (user.role === 'admin') {
        setProfileData({
          username: user.username || ''
        });
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nik') {
      setProfileData({ ...profileData, [name]: value.replace(/\D/g, '').slice(0, 16) });
      return;
    }
    if (name === 'no_str') {
      setProfileData({ ...profileData, [name]: value.replace(/\D/g, '').slice(0, 4) });
      return;
    }
    if (name === 'phone') {
      setProfileData({ ...profileData, [name]: value.replace(/\D/g, '') });
      return;
    }
    
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setLoading(true);
    
    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.status === 'success') {
      setProfileMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setIsEditingProfile(false);
      await refreshUser();
    } else {
      setProfileMessage({ type: 'error', text: result.message || 'Gagal memperbarui profil' });
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.new_password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok' });
      return;
    }

    setLoading(true);
    const result = await changePassword(
      passwordData.old_password,
      passwordData.new_password,
      passwordData.confirm_password
    );
    setLoading(false);

    if (result.status === 'success') {
      setPasswordMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setIsChangingPassword(false);
    } else {
      setPasswordMessage({ type: 'error', text: result.message || 'Gagal mengubah password' });
    }
  };

  if (!user) return null;

  const getRoleIcon = () => {
    if (user.role === 'pasien') return <User size={40} />;
    if (user.role === 'dokter') return <Stethoscope size={40} />;
    return <Shield size={40} />;
  };

  const getRoleColor = () => {
    if (user.role === 'pasien') return 'blue';
    if (user.role === 'dokter') return 'teal';
    return 'purple';
  };

  const color = getRoleColor();
  const colorMap = {
    blue: {
      bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', 
      shadow: 'shadow-blue-500/20', ring: 'focus:ring-blue-600', light: 'bg-blue-50'
    },
    teal: {
      bg: 'bg-teal-100', text: 'text-teal-600', btn: 'bg-teal-600 hover:bg-teal-700', 
      shadow: 'shadow-teal-500/20', ring: 'focus:ring-teal-600', light: 'bg-teal-50'
    },
    purple: {
      bg: 'bg-purple-100', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', 
      shadow: 'shadow-purple-500/20', ring: 'focus:ring-purple-600', light: 'bg-purple-50'
    }
  };
  const c = colorMap[color];

  const renderProfileFields = () => {
    if (user.role === 'pasien' && user.profile) {
      const p = user.profile;
      return [
        { label: 'Nama Lengkap', value: p.name },
        { label: 'NIK', value: p.nik },
        { label: 'No. Rekam Medis', value: p.medical_record_no },
        { label: 'No. Telepon', value: p.phone || '-' },
        { label: 'Tempat Lahir', value: p.birth_place || '-' },
        { label: 'Tanggal Lahir', value: p.birth_date ? new Date(p.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
        { label: 'Jenis Kelamin', value: p.gender === 'L' ? 'Laki-laki' : 'Perempuan' },
        { label: 'Alamat', value: p.address || '-' },
        { label: 'Email', value: p.email || '-' },
        { label: 'Username', value: p.username || user.username }
      ];
    }
    if (user.role === 'dokter' && user.profile) {
      const d = user.profile;
      return [
        { label: 'Nama Lengkap', value: d.name },
        { label: 'Poli', value: d.poli },
        { label: 'No STR', value: d.no_str },
        { label: 'Email', value: d.email || '-' },
        { label: 'Username', value: user.username }
      ];
    }
    // Admin
    return [
      { label: 'Username', value: user.username },
      { label: 'Role', value: 'Administrator' }
    ];
  };

  const renderEditForm = () => {
    if (user.role === 'pasien') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input name="name" value={profileData.name || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK <span className="text-xs text-gray-400">(16 angka)</span></label>
            <input name="nik" value={profileData.nik || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input name="phone" value={profileData.phone || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
              <input name="birth_place" value={profileData.birth_place || ''} onChange={handleProfileChange} required
                className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <input name="birth_date" type="date" value={profileData.birth_date || ''} onChange={handleProfileChange} required
                className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea name="address" value={profileData.address || ''} onChange={handleProfileChange} required rows={2}
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={profileData.email || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm" />
          </div>
        </>
      );
    }
    if (user.role === 'dokter') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input name="name" value={profileData.name || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poli Terdaftar</label>
            <select name="poli" value={profileData.poli || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm bg-white">
              <option value="">-- Pilih Poli --</option>
              {POLI_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No STR <span className="text-xs text-gray-400">(4 angka)</span></label>
            <input name="no_str" value={profileData.no_str || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={profileData.email || ''} onChange={handleProfileChange} required
              className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm" />
          </div>
        </>
      );
    }
    // Admin
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input name="username" value={profileData.username || ''} onChange={handleProfileChange} required
          className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profil Saya</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <div className="flex flex-col items-center mb-6">
            <div className={`${c.bg} p-4 rounded-full ${c.text} mb-3`}>
              {getRoleIcon()}
            </div>
            <h3 className="font-bold text-xl text-gray-900">{user.name || user.username}</h3>
            <span className={`text-xs font-medium px-3 py-1 rounded-full mt-2 capitalize ${c.light} ${c.text}`}>
              {user.role}
            </span>
            {user.profile?.medical_record_no && (
              <p className="text-sm text-gray-500 mt-1">{user.profile.medical_record_no}</p>
            )}
          </div>

          {/* Profile Info (read-only) */}
          {!isEditingProfile && (
            <div className="space-y-3 text-sm">
              {renderProfileFields().map((field, idx) => (
                <div key={idx}>
                  <span className="text-gray-500 block text-xs">{field.label}</span>
                  <span className="font-medium text-gray-900">{field.value}</span>
                </div>
              ))}
              <button
                onClick={() => { setIsEditingProfile(true); setProfileMessage({ type: '', text: '' }); }}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium ${c.btn} text-white transition-all duration-200 shadow-md ${c.shadow}`}
              >
                <Edit2 size={16} />
                Edit Profil
              </button>
            </div>
          )}

          {/* Profile Edit Form */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileMessage.text && (
                <div className={`p-3 rounded-lg text-sm text-center ${profileMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {profileMessage.text}
                </div>
              )}
              {renderEditForm()}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <X size={16} /> Batal
                </button>
                <button type="submit" disabled={loading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white ${c.btn} transition-all duration-200 shadow-md ${c.shadow} disabled:opacity-50 flex items-center justify-center gap-1`}>
                  <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password & Security */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound size={20} className={c.text} />
            <h2 className="text-lg font-semibold text-gray-900">Keamanan Akun</h2>
          </div>

          {profileMessage.text && !isEditingProfile && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${profileMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {profileMessage.text}
            </div>
          )}

          {passwordMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {passwordMessage.text}
            </div>
          )}

          {!isChangingPassword ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500 mt-1">Terakhir diubah: -</p>
                  </div>
                  <button
                    onClick={() => { setIsChangingPassword(true); setPasswordMessage({ type: '', text: '' }); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${c.btn} text-white transition-all duration-200 shadow-md ${c.shadow}`}
                  >
                    Ubah Password
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">Informasi Akun</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Username</span>
                    <span className="font-mono font-medium text-gray-900">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className={`font-medium capitalize ${c.text}`}>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* Password Lama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                <div className="relative">
                  <input
                    name="old_password"
                    type={showOldPassword ? "text" : "password"}
                    required
                    className="w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                    placeholder="Masukkan password lama"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                  />
                  <button type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    name="new_password"
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                    placeholder="Minimal 6 karakter"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                  />
                  <button type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                      passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password 
                        ? 'ring-red-400' : 'ring-gray-300'
                    }`}
                    placeholder="Ulangi password baru"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                  />
                  <button type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password && (
                  <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({ old_password: '', new_password: '', confirm_password: '' }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <X size={16} /> Batal
                </button>
                <button type="submit" disabled={loading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white ${c.btn} transition-all duration-200 shadow-md ${c.shadow} disabled:opacity-50 flex items-center justify-center gap-1`}>
                  <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
