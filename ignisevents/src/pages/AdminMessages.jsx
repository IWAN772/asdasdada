import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import { Trash2, Mail, MailOpen, Archive, Clock, User, Phone, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Local storage key for messages
const MESSAGES_STORAGE_KEY = 'ignis_contact_messages';

const statusLabels = {
  new: { label: 'Nowa', color: 'bg-amber-500' },
  read: { label: 'Przeczytana', color: 'bg-blue-500' },
  replied: { label: 'Odpowiedziano', color: 'bg-green-500' },
  archived: { label: 'Archiwum', color: 'bg-gray-500' },
};

const eventTypeLabels = {
  wesele: 'Wesele',
  event_firmowy: 'Event Firmowy',
  koncert_gala: 'Koncert / Gala',
  impreza_prywatna: 'Impreza Prywatna',
  inne: 'Inne',
};

export default function AdminMessages() {
  const { isAuthorized, checked, setIsAuthorized } = useAdminAuth();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load messages from localStorage
  const loadMessages = () => {
    try {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      // Sort by created_date descending
      data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages from localStorage:', err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    
    // Listen for new messages
    const handleMessagesUpdated = () => {
      loadMessages();
    };
    
    window.addEventListener('ignis-messages-updated', handleMessagesUpdated);
    
    // Also poll periodically in case user sends message from different tab
    const interval = setInterval(loadMessages, 5000);
    
    return () => {
      window.removeEventListener('ignis-messages-updated', handleMessagesUpdated);
      clearInterval(interval);
    };
  }, []);

  const updateMessageStatus = (id, newStatus) => {
    try {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      const updated = data.map(msg => 
        msg.id === id ? { ...msg, status: newStatus } : msg
      );
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
      setMessages(updated);
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const deleteMessage = (id) => {
    try {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      const updated = data.filter(msg => msg.id !== id);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
      setMessages(updated);
      setSelectedMessage(null);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'read');
    }
  };

  const updateStatus = (id, status) => {
    updateMessageStatus(id, status);
  };

  const filteredMessages = filterStatus === 'all' 
    ? messages 
    : messages.filter(m => m.status === filterStatus);

  const newCount = messages.filter(m => m.status === 'new').length;

  if (!checked) return null;
  if (!isAuthorized) return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;

  return (
    <AdminLayout title="Wiadomości">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <p className="text-gray-400">
            {newCount > 0 && <span className="text-amber-500 font-semibold">{newCount} nowych wiadomości</span>}
            {newCount === 0 && 'Brak nowych wiadomości'}
          </p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status 
                ? 'bg-amber-500 text-black hover:bg-amber-600 font-semibold' 
                : 'text-white border-slate-600 hover:border-slate-500 hover:text-amber-500'}
            >
              {status === 'all' ? 'Wszystkie' : statusLabels[status]?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card 
            key={message.id} 
            className={`bg-slate-900 border-slate-700 cursor-pointer hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all ${
              message.status === 'new' ? 'border-l-4 border-l-amber-500' : ''
            }`}
            onClick={() => openMessage(message)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.status === 'new' ? 'bg-amber-500/20' : 'bg-slate-800'
                  }`}>
                    {message.status === 'new' ? (
                      <Mail className="w-5 h-5 text-amber-500" />
                    ) : (
                      <MailOpen className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-semibold">{message.name}</h4>
                      <Badge className={`${statusLabels[message.status]?.color} text-white text-xs`}>
                        {statusLabels[message.status]?.label}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{message.email}</p>
                    <p className="text-gray-300 line-clamp-2">{message.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(message.created_date).toLocaleDateString('pl-PL')}
                  </div>
                  {message.event_type && (
                    <Badge variant="outline" className="mt-2 text-xs border-amber-500/30 text-amber-400">
                      {eventTypeLabels[message.event_type] || message.event_type}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Brak wiadomości</p>
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-slate-950 border-amber-500/50 text-white max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Szczegóły wiadomości</DialogTitle>
            </DialogHeader>

            {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <User className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Imię i nazwisko</p>
                    <p className="text-white">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="text-amber-500 hover:text-amber-400">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Phone className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-gray-400 text-xs">Telefon</p>
                      <a href={`tel:${selectedMessage.phone}`} className="text-amber-400 hover:text-amber-300 font-semibold">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}
                {selectedMessage.event_type && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-gray-400 text-xs">Typ wydarzenia</p>
                      <p className="text-white font-semibold">{eventTypeLabels[selectedMessage.event_type]}</p>
                    </div>
                  </div>
                )}
                {selectedMessage.event_date && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-gray-400 text-xs">Planowana data</p>
                      <p className="text-white font-semibold">{new Date(selectedMessage.event_date).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>
                )}
                {selectedMessage.guests_count && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Users className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-gray-400 text-xs">Liczba gości</p>
                      <p className="text-white font-semibold">{selectedMessage.guests_count}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-gray-500 text-xs mb-2">Wiadomość</p>
                <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-white"
                    onClick={() => updateStatus(selectedMessage.id, 'replied')}
                  >
                    Oznacz jako odpowiedziano
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-white"
                    onClick={() => updateStatus(selectedMessage.id, 'archived')}
                  >
                    <Archive className="w-4 h-4 mr-1" /> Archiwizuj
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Usuń
                </Button>
              </div>
            </div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}