import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin'; 
import { 
  Calendar, 
  Image, 
  MessageSquare, 
  Star,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { STORED_KEY, EXPECTED } from '@/lib/adminAuth';

const EVENTS_STORAGE_KEY = 'ignis_events';
const MESSAGES_STORAGE_KEY = 'ignis_messages';
const TESTIMONIALS_STORAGE_KEY = 'ignis_testimonials';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORED_KEY);
    if (stored === EXPECTED) {
      setIsAuthorized(true);
    }
    setChecked(true);

    // Load data from localStorage
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) setMessages(JSON.parse(storedMessages));

      const storedTestimonials = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
      
      // Gallery - load from session storage if available
      const storedGallery = sessionStorage.getItem('ignis_gallery');
      if (storedGallery) setGallery(JSON.parse(storedGallery));
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  const newMessages = messages.filter(m => m.status === 'new').length;

  const stats = [
    { 
      icon: Calendar, 
      label: 'Realizacje', 
      value: events.length, 
      color: 'bg-blue-500',
      link: 'AdminEvents'
    },
    { 
      icon: Image, 
      label: 'Zdjęcia', 
      value: gallery.length, 
      color: 'bg-green-500',
      link: 'AdminGallery'
    },
    { 
      icon: MessageSquare, 
      label: 'Wiadomości', 
      value: messages.length, 
      badge: newMessages,
      color: 'bg-purple-500',
      link: 'AdminMessages'
    },
    { 
      icon: Star, 
      label: 'Opinie', 
      value: testimonials.length, 
      color: 'bg-amber-500',
      link: 'AdminTestimonials'
    },
  ];

  if (!checked) return null;
  if (!isAuthorized) {
    return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <AdminLayout title="Panel Administracyjny">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={createPageUrl(stat.link)}>
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-lg flex items-center justify-center relative`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    {stat.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Ostatnie wiadomości</CardTitle>
            <Link to={createPageUrl('AdminMessages')} className="text-amber-500 text-sm hover:text-amber-400 flex items-center gap-1">
              Zobacz wszystkie <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Brak wiadomości</p>
            ) : (
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${message.status === 'new' ? 'bg-amber-500' : 'bg-gray-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{message.name}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(message.created_date || message.date).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Ostatnie realizacje</CardTitle>
            <Link to={createPageUrl('AdminEvents')} className="text-amber-500 text-sm hover:text-amber-400 flex items-center gap-1">
              Zobacz wszystkie <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Brak realizacji</p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                    {event.main_image ? (
                      <img src={event.main_image} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-gray-500 text-sm">{event.location}</p>
                    </div>
                    {event.featured && (
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
