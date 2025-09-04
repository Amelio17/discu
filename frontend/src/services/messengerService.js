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

const messengerService = {
  // Récupérer toutes les conversations
  async getConversations() {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Créer une nouvelle conversation
  async createConversation(userId) {
    const response = await api.post('/conversations', { user_id: userId });
    return response.data;
  },

  // Récupérer une conversation spécifique
  async getConversation(id) {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  // Récupérer les messages d'une conversation
  async getMessages(conversationId) {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Envoyer un message
  async sendMessage(messageData) {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Marquer les messages comme lus
  async markAsRead(conversationId) {
    const response = await api.post(`/conversations/${conversationId}/mark-read`);
    return response.data;
  },

  // Récupérer la liste des utilisateurs
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },
};

export default messengerService;
