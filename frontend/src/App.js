import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Discussions from './pages/Discussions';
import Messenger from './pages/Messenger';
import Navbar from './components/Navbar';

function App() {
  const { user, message, messageType, showMessage } = useAuth();

  const handleCloseMessage = () => {
    showMessage('', 'success');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {user && <Navbar />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/discussions" 
            element={user ? <Discussions /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/messenger" 
            element={user ? <Messenger /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </Container>

      {/* Message global */}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseMessage} severity={messageType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
