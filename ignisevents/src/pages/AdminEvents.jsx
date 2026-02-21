import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import ImageUploader from '../components/admin/ImageUploader';
import { Plus, Pencil, Trash2, Star, X, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

const categories = [
  { value: 'wesela', label: 'Wesela' },
  { value: 'eventy_firmowe', label: 'Eventy Firmowe' },
  { value: 'koncerty_gale', label: 'Koncerty i Gale' },
  { value: 'imprezy_prywatne', label: 'Imprezy Prywatne' },
];

const emptyEvent = {
  id: '',
  title: '',
  short_description: '',
  full_description: '',
  category: 'wesela',
  date: '',
  location: '',
  main_image: '',
  gallery: [],
  featured: false,
  guests_count: ''
};

const defaultEvents = [
  {
    id: '1',
    title: 'Bajkowe Wesele w Pałacu',
    category: 'wesela',
    location: 'Pałac w Jabłonnie',
    date: '2024-06-15',
    guests_count: 150,
    short_description: 'Romantyczne wesele w zabytkowym pałacu z przepięknym ogrodem.',
    main_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80'
    ],
    featured: true
  },
  {
    id: '2',
    title: 'Gala Rocznicowa TechCorp',
    category: 'eventy_firmowe',
    location: 'Hotel Marriott Warszawa',
    date: '2024-05-20',
    guests_count: 300,
    short_description: 'Elegancka gala z okazji 25-lecia firmy z programem artystycznym.',
    main_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80'
    ],
    featured: false
  },
];

export default function AdminEvents() {
  const { isAuthorized, checked, setIsAuthorized } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(emptyEvent);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await base44.entities.Event.list();
        const data = response.data || response || [];
        if (data.length > 0) {
          setEvents(data);
        } else {
          for (const event of defaultEvents) {
            await base44.entities.Event.create(event);
          }
          setEvents(defaultEvents);
        }
      } catch (e) {
        console.error('Error loading events:', e);
        setEvents(defaultEvents);
      }
      setIsLoading(false);
    };
    loadEvents();
  }, []);

  const openDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        ...event,
        guests_count: event.guests_count?.toString() || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({
        ...emptyEvent,
        id: Date.now().toString()
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData(emptyEvent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const newEvent = {
      ...formData,
      guests_count: formData.guests_count ? parseInt(formData.guests_count) : null
    };

    try {
      if (editingEvent) {
        await base44.entities.Event.update(editingEvent.id, newEvent);
        setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...newEvent } : ev));
      } else {
        const created = await base44.entities.Event.create(newEvent);
        setEvents([created, ...events]);
      }
      closeDialog();
    } catch (e) {
      console.error('Error saving event:', e);
      alert('Błąd podczas zapisywania: ' + e.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Czy na pewno chcesz usunąć tę realizację?')) {
      try {
        await base44.entities.Event.delete(id);
        setEvents(events.filter(ev => ev.id !== id));
      } catch (e) {
        console.error('Error deleting event:', e);
        alert('Błąd podczas usuwania: ' + e.message);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!checked) return null;
  if (!isAuthorized) return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;

  return (
    <AdminLayout title="Realizacje">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-400">Zarządzaj realizacjami wyświetlanymi na stronie</p>
        <Button onClick={() => openDialog()} className="bg-amber-500 hover:bg-amber-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj realizację
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="bg-slate-900 border-slate-800 overflow-hidden group">
            <div className="relative h-48">
              {event.main_image ? (
                <img src={event.main_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span className="text-gray-500">Brak zdjęcia</span>
                </div>
              )}
              {event.featured && (
                <div className="absolute top-2 left-2 bg-amber-500 text-black px-2 py-1 text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Wyróżnione
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" onClick={() => openDialog(event)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(event.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {event.location}
                  </span>
                )}
                {event.guests_count && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {event.guests_count}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Brak realizacji</p>
          <Button onClick={() => openDialog()} variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
            <Plus className="w-4 h-4 mr-2" /> Dodaj pierwszą realizację
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edytuj realizację' : 'Dodaj realizację'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-300">Tytuł *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white mt-2"
                placeholder="Nazwa realizacji"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Kategoria</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Data</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Lokalizacja</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="np. Warszawa"
                />
              </div>
              <div>
                <Label className="text-gray-300">Liczba gości</Label>
                <Input
                  type="number"
                  value={formData.guests_count}
                  onChange={(e) => handleChange('guests_count', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Krótki opis</Label>
              <Textarea
                value={formData.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={2}
                placeholder="Krótki opis do karty"
              />
            </div>

            <div>
              <Label className="text-gray-300">Pełny opis</Label>
              <Textarea
                value={formData.full_description}
                onChange={(e) => handleChange('full_description', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={4}
                placeholder="Szczegółowy opis realizacji"
              />
            </div>

            <div>
              <Label className="text-gray-300 block mb-2">Zdjęcie główne</Label>
              <ImageUploader
                value={formData.main_image}
                onChange={(url) => handleChange('main_image', url)}
              />
            </div>

            <div>
              <Label className="text-gray-300 block mb-2">Galeria zdjęć</Label>
              <ImageUploader
                value={formData.gallery}
                onChange={(urls) => handleChange('gallery', urls)}
                multiple
                label="Dodaj zdjęcia do galerii"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
              <Label className="text-gray-300">Wyróżniona realizacja (widoczna na stronie głównej)</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                Anuluj
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                disabled={isSaving}
              >
                {isSaving ? 'Zapisywanie...' : (editingEvent ? 'Zapisz zmiany' : 'Dodaj realizację')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
