import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import ImageUploader from '../components/admin/ImageUploader';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

// Local storage key
const TESTIMONIALS_STORAGE_KEY = 'ignis_testimonials';

const defaultTestimonials = [
  {
    id: '1',
    author: 'Anna i Piotr',
    content: 'Dziękujemy całemu zespołowi Ignis Events za niesamowite wesele! Profesjonalizm, kreatywność i zaangażowanie przeszły nasze oczekiwania. Każdy detal był dopracowany, a my mogliśmy cieszyć się tym wyjątkowym dniem bez stresu.',
    rating: 5,
    event_type: 'Wesele',
    avatar: '',
    featured: true,
    created_date: '2024-01-15'
  },
  {
    id: '2',
    author: 'Katarzyna Nowak',
    content: 'Firma eventowa na najwyższym poziomie. Organizowaliśmy z nimi galę firmową i wszystko przebiegło perfekcyjnie. Profesjonalna obsługa, świetna komunikacja i niezapomniane wrażenia dla gości.',
    rating: 5,
    event_type: 'Event Firmowy',
    avatar: '',
    featured: true,
    created_date: '2024-02-20'
  },
  {
    id: '3',
    author: 'Marcin i Tomasz',
    content: 'Najlepsza organizacja imprezy prywatnej jaką mogliśmy sobie wymarzyć. Zespół Ignis Events stworzył niepowtarzalną atmosferę na naszej rocznicy. Polecamy każdemu kto szuka profesjonalistów!',
    rating: 5,
    event_type: 'Impreza Prywatna',
    avatar: '',
    featured: false,
    created_date: '2024-03-10'
  }
];

const emptyTestimonial = {
  author: '',
  content: '',
  rating: 5,
  event_type: '',
  avatar: '',
  featured: false
};

export default function AdminTestimonials() {
  const { isAuthorized, checked, setIsAuthorized } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [testimonials, setTestimonials] = useState([]);

  // Load testimonials from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
    if (stored) {
      try {
        setTestimonials(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading testimonials:', e);
        setTestimonials(defaultTestimonials);
        localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(defaultTestimonials));
      }
    } else {
      setTestimonials(defaultTestimonials);
      localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(defaultTestimonials));
    }
  }, []);

  const saveTestimonials = (newTestimonials) => {
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(newTestimonials));
    setTestimonials(newTestimonials);
  };

  const openDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(emptyTestimonial);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyTestimonial);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      created_date: editingItem ? editingItem.created_date : new Date().toISOString()
    };

    if (editingItem) {
      const updated = testimonials.map(t => t.id === editingItem.id ? data : t);
      saveTestimonials(updated);
    } else {
      saveTestimonials([...testimonials, data]);
    }
    closeDialog();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id) => {
    if (confirm('Czy na pewno chcesz usunąć tę opinię?')) {
      const updated = testimonials.filter(t => t.id !== id);
      saveTestimonials(updated);
    }
  };

  if (!checked) return null;
  if (!isAuthorized) return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;

  return (
    <AdminLayout title="Opinie klientów">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-400">Zarządzaj opiniami wyświetlanymi na stronie</p>
        <Button onClick={() => openDialog()} className="bg-amber-500 hover:bg-amber-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj opinię
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <Card key={item.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-500 font-bold text-lg">
                        {item.author?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{item.author}</h4>
                    <p className="text-gray-500 text-sm">{item.event_type}</p>
                  </div>
                </div>
                {item.featured && (
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                )}
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < item.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`} 
                  />
                ))}
              </div>

              <p className="text-gray-400 text-sm line-clamp-3 mb-4">"{item.content}"</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500" onClick={() => openDialog(item)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edytuj
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Brak opinii</p>
          <Button onClick={() => openDialog()} variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
            <Plus className="w-4 h-4 mr-2" /> Dodaj pierwszą opinię
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edytuj opinię' : 'Dodaj opinię'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-300">Autor *</Label>
              <Input
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white mt-2"
                placeholder="Imię i nazwisko"
              />
            </div>

            <div>
              <Label className="text-gray-300">Typ wydarzenia</Label>
              <Input
                value={formData.event_type}
                onChange={(e) => handleChange('event_type', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                placeholder="np. Wesele, Gala Firmowa"
              />
            </div>

            <div>
              <Label className="text-gray-300">Treść opinii *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={4}
                placeholder="Treść opinii..."
              />
            </div>

            <div>
              <Label className="text-gray-300">Ocena</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleChange('rating', rating)}
                    className="p-1"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        rating <= formData.rating 
                          ? 'text-amber-500 fill-amber-500' 
                          : 'text-gray-600 hover:text-amber-500/50'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300 block mb-2">Zdjęcie autora (opcjonalnie)</Label>
              <ImageUploader
                value={formData.avatar}
                onChange={(url) => handleChange('avatar', url)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
              <Label className="text-gray-300">Wyróżniona opinia (widoczna na stronie głównej)</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1 text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
                Anuluj
              </Button>
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                {editingItem ? 'Zapisz zmiany' : 'Dodaj opinię'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
