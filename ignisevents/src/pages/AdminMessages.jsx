import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import { Trash2, Mail, MailOpen, Archive, Clock, User, Phone, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      try {
        console.log('Fetching messages from ContactMessage...');
        const appId = import.meta.env.VITE_BASE44_APP_ID;
        const apiKey = import.meta.env.VITE_BASE44_ACCESS_TOKEN;
        console.log('Using appId:', appId?.substring(0, 8) + '...');
        console.log('Using apiKey:', apiKey?.substring(0, 8) + '...');
        
        // Use direct HTTP request instead of Base44 SDK
        const response = await fetch(
          `https://app.base44.com/api/apps/${appId}/entities/ContactMessage?sort=-created_date`,
          {
            method: 'GET',
            headers: {
              'api_key': apiKey,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error ${response.status}: ${errorData.message || 'Unknown error'}`);
        }
        
        const result = await response.json();
        console.log('Messages fetched successfully:', result);
        return result.data || result;
      } catch (err) {
        console.error('Error fetching messages:', {
          message: err.message,
          fullError: err
        });
        throw err;
      }
    },
    initialData: [],
    retry: 1
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContactMessage.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      setSelectedMessage(null);
    }
  });

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      updateMutation.mutate({ id: message.id, data: { status: 'read' } });
    }
  };

  const updateStatus = (id, status) => {
    updateMutation.mutate({ id, data: { status } });
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

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500 mb-4 p-4">
          <div className="text-red-400 text-sm">
            <p className="font-semibold">Błąd ładowania wiadomości:</p>
            <p>{error.message}</p>
            {error.response?.data && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer">Szczegóły błędu</summary>
                <pre className="mt-2 bg-black/50 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(error.response.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Card>
      )}

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
                  onClick={() => deleteMutation.mutate(selectedMessage.id)}
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