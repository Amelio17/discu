import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      showMessage('Connexion réussie !');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      showMessage(errorMessage, 'error');
      throw error;
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await authService.register(name, email, password, password_confirmation);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      showMessage('Inscription réussie ! Bienvenue !');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
      showMessage(errorMessage, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      showMessage('Déconnexion réussie !');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    message,
    messageType,
    showMessage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
