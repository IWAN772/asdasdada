import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { useAdminAuth } from '../components/admin/useAdminAuth';
import ImageUploader from '../components/admin/ImageUploader';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const categories = [
  { value: 'wesela', label: 'Wesela' },
  { value: 'eventy_firmowe', label: 'Eventy Firmowe' },
  { value: 'koncerty_gale', label: 'Koncerty i Gale' },
  { value: 'imprezy_prywatne', label: 'Imprezy Prywatne' },
  { value: 'inne', label: 'Inne' },
];

export default function AdminGallery() {
  const { isAuthorized, checked, setIsAuthorized } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'wesela',
    order: 0
  });
  const [filterCategory, setFilterCategory] = useState('all');

  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const LOCAL_KEY = 'local_gallery_images';

      const getLocal = () => {
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          console.warn('Failed to read local gallery images:', e);
          return [];
        }
      };

      try {
        const remote = await base44.entities.GalleryImage.list('order');
        // Merge local images that are not present remotely
        const local = getLocal();
        const remoteIds = new Set((remote || []).map(r => r.id));
        const merged = [ ...(remote || []), ...local.filter(l => !remoteIds.has(l.id)) ];
        return merged;
      } catch (err) {
        console.warn('Error loading gallery images from Base44, using local cache:', err);
        return getLocal();
      }
    },
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GalleryImage.create(data),
    onMutate: (variables) => {
      console.log('Creating GalleryImage with payload:', variables);
    },
    onError: (err, variables) => {
      console.error('Failed to create gallery image (saving locally):', err, variables);
      try {
        const LOCAL_KEY = 'local_gallery_images';
        const raw = localStorage.getItem(LOCAL_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const localItem = {
          id: `local-${Date.now()}`,
          title: variables.title || '',
          image_url: variables.image_url || '',
          category: variables.category || 'inne',
          order: variables.order || 0,
          _local: true
        };
        list.unshift(localItem);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
        queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
        alert('Nie udało się zapisać na serwerze; wpis został zapisany lokalnie i pokaże się w panelu.');
      } catch (saveErr) {
        console.error('Failed to save gallery item locally:', saveErr);
        alert('Nie udało się zapisać wpisu galerii: ' + (err.message || err));
      }
    },
    onSuccess: (data, variables) => {
      console.log('GalleryImage created:', data);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      closeDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const LOCAL_KEY = 'local_gallery_images';
      if (typeof id === 'string' && id.startsWith('local-')) {
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          const list = raw ? JSON.parse(raw) : [];
          const filtered = list.filter(i => i.id !== id);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
          return { success: true, local: true };
        } catch (e) {
          console.error('Failed to delete local gallery item:', e);
          throw e;
        }
      }

      // Remote delete
      return base44.entities.GalleryImage.delete(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-gallery'] })
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ title: '', image_url: '', category: 'wesela', order: 0 });
  };

  // convert dataURL -> Blob
  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(',');
    const meta = parts[0];
    const base64 = parts[1];
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  };

  const uploadDataUrlToBase44 = async (dataUrl, filename = 'upload.png') => {
    const appId = import.meta.env.VITE_BASE44_APP_ID;
    const apiKey = import.meta.env.VITE_BASE44_ACCESS_TOKEN;
    const blob = dataURLToBlob(dataUrl);
    const form = new FormData();
    form.append('file', blob, filename);

    const res = await fetch(`https://app.base44.com/api/apps/${appId}/files`, {
      method: 'POST',
      headers: {
        api_key: apiKey
      },
      body: form
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`File upload failed: ${res.status} ${err}`);
    }

    const json = await res.json();
    // support several possible response shapes
    return json.file_url || json.url || json.data?.file_url || json.data?.url || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = { ...formData };

      if (payload.image_url && payload.image_url.startsWith('data:')) {
        // Try uploading data URL to Base44; if it fails (e.g. 404 endpoint),
        // fall back to sending the data URL inline in the entity so it still shows.
        try {
          const uploadedUrl = await uploadDataUrlToBase44(payload.image_url);
          if (uploadedUrl) {
            payload.image_url = uploadedUrl;
          } else {
            console.warn('Upload returned no URL, falling back to inline data URL.');
          }
        } catch (uploadErr) {
          console.warn('Upload to Base44 failed, falling back to inline data URL:', uploadErr);
          // keep payload.image_url as data URL so the preview and entity will still work
          // Inform user that we used an inline fallback
          alert('Upload pliku nie powiódł się; obraz zostanie zapisany inline (data-URL).');
        }
      }

      createMutation.mutate(payload);
    } catch (err) {
      console.error('Failed to add gallery image:', err);
      alert('Błąd dodawania zdjęcia: ' + err.message);
    }
  };

  const filteredImages = filterCategory === 'all' 
    ? images 
    : images.filter(img => img.category === filterCategory);

  if (!checked) return null;
  if (!isAuthorized) return <AdminLogin onSuccess={() => setIsAuthorized(true)} />;

  return (
    <AdminLayout title="Galeria">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <p className="text-gray-400">Zarządzaj galerią zdjęć</p>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filtruj" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white">Wszystkie</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj zdjęcie
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="relative group aspect-square">
            <img 
              src={image.image_url} 
              alt={image.title || ''} 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button 
                size="icon" 
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteMutation.mutate(image.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent rounded-b-lg">
                <p className="text-white text-xs truncate">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Brak zdjęć w galerii</p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
            <Plus className="w-4 h-4 mr-2" /> Dodaj pierwsze zdjęcie
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Dodaj zdjęcie do galerii</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-300 block mb-2">Zdjęcie *</Label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
            </div>

            <div>
              <Label className="text-gray-300">Tytuł (opcjonalnie)</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                placeholder="Opis zdjęcia"
              />
            </div>

            <div>
              <Label className="text-gray-300">Kategoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
              >
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

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1 text-white border-slate-600 hover:border-amber-500 hover:text-amber-500">
                Anuluj
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                disabled={!formData.image_url || createMutation.isPending}
              >
                Dodaj zdjęcie
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}