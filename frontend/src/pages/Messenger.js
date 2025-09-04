import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Button,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import messengerService from '../services/messengerService';

const Messenger = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [openNewChat, setOpenNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await messengerService.getConversations();
      setConversations(response.conversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await messengerService.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await messengerService.getMessages(conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await messengerService.sendMessage({
        content: newMessage,
        conversation_id: selectedConversation.id,
      });
      
      setMessages([...messages, response.message]);
      setNewMessage('');
      
      // Mettre à jour la conversation dans la liste
      const updatedConversations = conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: response.message }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const handleNewChat = async () => {
    if (!selectedUser) return;

    try {
      const response = await messengerService.createConversation(selectedUser);
      setConversations([response.conversation, ...conversations]);
      setSelectedConversation(response.conversation);
      setOpenNewChat(false);
      setSelectedUser('');
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'Aucun message';
    
    const lastMessage = conversation.lastMessage;
    const isFromMe = lastMessage.user_id === user.id;
    const prefix = isFromMe ? 'Vous: ' : '';
    
    return prefix + lastMessage.content.substring(0, 30) + (lastMessage.content.length > 30 ? '...' : '');
  };

  // Filtrer les conversations basées sur la recherche
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      conversation.display_name.toLowerCase().includes(searchLower) ||
      (conversation.lastMessage?.content?.toLowerCase().includes(searchLower))
    );
  });

  // Filtrer les utilisateurs pour la nouvelle conversation
  const filteredUsers = users.filter(userItem => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      userItem.name.toLowerCase().includes(searchLower) ||
      userItem.email.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">Chargement de la messagerie...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ height: '80vh', display: 'flex' }}>
        {/* Liste des conversations */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Messages</Typography>
              <IconButton onClick={() => setOpenNewChat(true)}>
                <AddIcon />
              </IconButton>
            </Box>
            
            {/* Barre de recherche */}
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher des conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <List sx={{ height: 'calc(80vh - 120px)', overflow: 'auto' }}>
            {filteredConversations.map((conversation) => (
              <ListItemButton
                key={conversation.id}
                selected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={conversation.unread_count} color="primary">
                    <Avatar>
                      {conversation.other_user?.name?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.display_name}
                  secondary={formatLastMessage(conversation)}
                  primaryTypographyProps={{ fontWeight: conversation.unread_count > 0 ? 'bold' : 'normal' }}
                />
              </ListItemButton>
            ))}
            
            {filteredConversations.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        {/* Zone de chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              {/* En-tête de la conversation */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>
                    {selectedConversation.other_user?.name?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedConversation.display_name}
                  </Typography>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.user_id === user.id ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        backgroundColor: message.user_id === user.id ? 'primary.main' : 'grey.100',
                        color: message.user_id === user.id ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          textAlign: message.user_id === user.id ? 'right' : 'left',
                        }}
                      >
                        {formatTime(message.created_at)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Zone de saisie */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    size="small"
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sélectionnez une conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ou créez une nouvelle conversation pour commencer à discuter
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Dialog pour nouvelle conversation */}
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvelle conversation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Utilisateur</InputLabel>
            <Select
              value={selectedUser}
              label="Utilisateur"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {filteredUsers.map((userItem) => (
                <MenuItem key={userItem.id} value={userItem.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {userItem.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{userItem.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userItem.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChat(false)}>Annuler</Button>
          <Button onClick={handleNewChat} variant="contained" disabled={!selectedUser}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Messenger;
