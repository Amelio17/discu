import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Forum as ForumIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import discussionService from '../services/discussionService';

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general',
  });

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      const response = await discussionService.getDiscussions();
      setDiscussions(response.discussions.data);
    } catch (error) {
      console.error('Erreur lors du chargement des discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async () => {
    try {
      await discussionService.createDiscussion(newDiscussion);
      setOpenDialog(false);
      setNewDiscussion({ title: '', content: '', category: 'general' });
      loadDiscussions();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'primary',
      tech: 'secondary',
      help: 'success',
      offtopic: 'warning',
    };
    return colors[category] || 'default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'Général',
      tech: 'Technologie',
      help: 'Aide',
      offtopic: 'Hors sujet',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">Chargement des discussions...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" component="h1">
            Discussions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nouvelle discussion
          </Button>
        </Box>

        <Grid container spacing={3}>
          {discussions.map((discussion) => (
            <Grid item xs={12} key={discussion.id}>
              <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {discussion.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {discussion.content.substring(0, 150)}...
                      </Typography>
                    </Box>
                    <Chip
                      label={getCategoryLabel(discussion.category)}
                      color={getCategoryColor(discussion.category)}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {discussion.user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {discussion.user.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ForumIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {discussion.comments_count || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {discussion.views_count}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(discussion.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {discussions.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ForumIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune discussion pour le moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Soyez le premier à créer une discussion !
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Dialog pour créer une nouvelle discussion */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle discussion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre"
            fullWidth
            variant="outlined"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={newDiscussion.category}
              label="Catégorie"
              onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
            >
              <MenuItem value="general">Général</MenuItem>
              <MenuItem value="tech">Technologie</MenuItem>
              <MenuItem value="help">Aide</MenuItem>
              <MenuItem value="offtopic">Hors sujet</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Contenu"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateDiscussion} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Discussions;
