import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create Axios instance with credentials
export const api = axios.create({
  baseURL: 'https://kliniksejahterah.gt.tc/backend/api',
  withCredentials: true
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    api.get('/auth/profile.php')
      .then(response => {
        if (response.data.status === 'success') {
          setUser(response.data.data);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login.php', { username, password });
      if (response.data.status === 'success') {
        setUser(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout.php');
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const registerPatient = async (data) => {
    try {
      const response = await api.post('/auth/register_patient.php', data);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return { status: 'error', message: 'Terjadi kesalahan saat registrasi' };
    }
  };

  const registerDoctor = async (data) => {
    try {
      const response = await api.post('/auth/register_doctor.php', data);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return { status: 'error', message: 'Terjadi kesalahan saat registrasi' };
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.put('/auth/change_password.php', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return { status: 'error', message: 'Terjadi kesalahan saat mengubah password' };
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/update_profile.php', data);
      if (response.data.status === 'success' && response.data.data) {
        setUser(response.data.data);
      }
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return { status: 'error', message: 'Terjadi kesalahan saat memperbarui profil' };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/profile.php');
      if (response.data.status === 'success') {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Refresh user error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, registerPatient, registerDoctor, changePassword, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
