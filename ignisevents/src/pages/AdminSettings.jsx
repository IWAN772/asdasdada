import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const defaultSettings = {
  company_name: 'IgnisEvents',
  company_tagline: 'Tworzymy Niezapomniane Wydarzenia',
  phone: '+48 123 456 789',
  email: 'kontakt@ignisevents.pl',
  address: 'ul. Eventowa 15, 00-001 Warszawa',
  working_hours: 'Pn-Pt: 9:00-18:00, Sob: 10:00-14:00',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  linkedin_url: '',
  about_text: 'IgnisEvents to agencja eventowa z ponad 15-letnim doświadczeniem w organizacji wesel, eventów firmowych, koncertów i imprez prywatnych.',
  meta_description: 'IgnisEvents - Profesjonalna agencja eventowa. Organizujemy wesela, eventy firmowe, koncerty i imprezy prywatne na najwyższym poziomie.'
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  const { data: savedSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => base44.entities.SiteSetting.list(),
    initialData: []
  });

  useEffect(() => {
    if (savedSettings.length > 0) {
      const settingsObj = {};
      savedSettings.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings(prev => ({ ...prev, ...settingsObj }));
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const promises = Object.entries(newSettings).map(async ([key, value]) => {
        const existing = savedSettings.find(s => s.key === key);
        if (existing) {
          return base44.entities.SiteSetting.update(existing.id, { key, value });
        } else {
          return base44.entities.SiteSetting.create({ key, value });
        }
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Ustawienia zostały zapisane');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout title="Ustawienia">
      <div className="max-w-4xl space-y-8">
        {/* Company Info */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              Informacje o firmie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nazwa firmy</Label>
                <Input
                  value={settings.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Slogan</Label>
                <Input
                  value={settings.company_tagline}
                  onChange={(e) => handleChange('company_tagline', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Opis firmy</Label>
              <Textarea
                value={settings.about_text}
                onChange={(e) => handleChange('about_text', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              Dane kontaktowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefon
                </Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Adres
              </Label>
              <Input
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-300">Godziny pracy</Label>
              <Input
                value={settings.working_hours}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Instagram className="w-5 h-5 text-amber-500" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> Facebook
                </Label>
                <Input
                  value={settings.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Instagram className="w-4 h-4" /> Instagram
                </Label>
                <Input
                  value={settings.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> YouTube
                </Label>
                <Input
                  value={settings.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </Label>
                <Input
                  value={settings.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-gray-300">Meta Description</Label>
              <Textarea
                value={settings.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                rows={3}
                placeholder="Opis strony wyświetlany w wynikach wyszukiwania"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-600 text-black"
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}