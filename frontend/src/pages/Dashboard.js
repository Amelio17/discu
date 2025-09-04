import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { Person, Email, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Vérifier s'il y a un message dans l'état de navigation
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.type || 'success');
      setShowMessage(true);
    }
  }, [location]);

  if (!user) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseMessage} severity={messageType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Bienvenue, {user.name} !
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Carte d'informations utilisateur */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5" component="h2">
                  {user.name}
                </Typography>
                <Chip
                  label="Utilisateur actif"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    <strong>Email :</strong> {user.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    <strong>Membre depuis :</strong> {formatDate(user.created_at)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Carte de statistiques */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" component="div">
                      1
                    </Typography>
                    <Typography color="text.secondary">
                      Compte actif
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CalendarToday sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h4" component="div">
                      {new Date().getDate()}
                    </Typography>
                    <Typography color="text.secondary">
                      Jours connecté
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Carte d'actions rapides */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions rapides
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">Modifier le profil (geste fosiny)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">Changer le mot de passe (geste fosiny)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">Paramètres (geste fosiny)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">Aide (geste fosiny)</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
