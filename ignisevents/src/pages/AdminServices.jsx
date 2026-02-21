import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import ImageUploader from '../components/admin/ImageUploader';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const slugOptions = [
  { value: 'wesela', label: 'Wesela' },
  { value: 'eventy_firmowe', label: 'Eventy Firmowe' },
  { value: 'koncerty_gale', label: 'Koncerty i Gale' },
  { value: 'imprezy_prywatne', label: 'Imprezy Prywatne' },
];

const emptyService = {
  name: '',
  slug: 'wesela',
  short_description: '',
  full_description: '',
  features: [],
  image: '',
  price_from: '',
  order: 0
};

export default function AdminServices() {
  const { isAuthorized, checked, setIsAuthorized } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyService);
  const [featuresText, setFeaturesText] = useState('');

  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => base44.entities.Service.list('order'),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] })
  });

  const openDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setFeaturesText((item.features || []).join('\n'));
    } else {
      setEditingItem(null);
      setFormData(emptyService);
      setFeaturesText('');
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(emptyService);
    setFeaturesText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: featuresText.split('\n').filter(f => f.trim())
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!checked) return null;
  if (!isAuthorized) return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;

  return (
    <AdminLayout title="Usługi">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-400">Zarządzaj usługami wyświetlanymi na stronie</p>
        <Button onClick={() => openDialog()} className="bg-amber-500 hover:bg-amber-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj usługę
        </Button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((item) => (
          <Card key={item.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
                
                {item.image ? (
                  <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                ) : (
                  <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Brak zdjęcia</span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{item.short_description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-amber-500">{slugOptions.find(s => s.value === item.slug)?.label}</span>
                    {item.price_from && <span className="text-gray-400">{item.price_from}</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500" onClick={() => openDialog(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => deleteMutation.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Brak usług</p>
          <Button onClick={() => openDialog()} variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
            <Plus className="w-4 h-4 mr-2" /> Dodaj pierwszą usługę
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edytuj usługę' : 'Dodaj usługę'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nazwa usługi *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="np. Organizacja Wesel"
                />
              </div>
              <div>
                <Label className="text-gray-300">Kategoria</Label>
                <Select value={formData.slug} onValueChange={(v) => handleChange('slug', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {slugOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Krótki opis</Label>
              <Input
                value={formData.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
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
                placeholder="Szczegółowy opis usługi"
              />
            </div>

            <div>
              <Label className="text-gray-300">Cechy usługi (każda w nowej linii)</Label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={6}
                placeholder="Koordynacja całego dnia&#10;Dobór dostawców&#10;Projektowanie dekoracji"
              />
            </div>

            <div>
              <Label className="text-gray-300">Cena od</Label>
              <Input
                value={formData.price_from}
                onChange={(e) => handleChange('price_from', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                placeholder="od 15 000 zł"
              />
            </div>

            <div>
              <Label className="text-gray-300 block mb-2">Zdjęcie</Label>
              <ImageUploader
                value={formData.image}
                onChange={(url) => handleChange('image', url)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1 text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
                Anuluj
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingItem ? 'Zapisz zmiany' : 'Dodaj usługę'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}