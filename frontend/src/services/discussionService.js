import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuration axios avec intercepteur pour ajouter le token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const discussionService = {
  // Récupérer toutes les discussions
  async getDiscussions() {
    const response = await api.get('/discussions');
    return response.data;
  },

  // Récupérer une discussion spécifique
  async getDiscussion(id) {
    const response = await api.get(`/discussions/${id}`);
    return response.data;
  },

  // Créer une nouvelle discussion
  async createDiscussion(discussionData) {
    const response = await api.post('/discussions', discussionData);
    return response.data;
  },

  // Mettre à jour une discussion
  async updateDiscussion(id, discussionData) {
    const response = await api.put(`/discussions/${id}`, discussionData);
    return response.data;
  },

  // Supprimer une discussion
  async deleteDiscussion(id) {
    const response = await api.delete(`/discussions/${id}`);
    return response.data;
  },

  // Ajouter un commentaire
  async addComment(commentData) {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Mettre à jour un commentaire
  async updateComment(id, commentData) {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Supprimer un commentaire
  async deleteComment(id) {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Marquer un commentaire comme solution
  async markAsSolution(id) {
    const response = await api.post(`/comments/${id}/mark-solution`);
    return response.data;
  },
};

export default discussionService;
