import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import GoldButton from '../components/ui/GoldButton';

const eventTypes = [
  { value: 'wesele', label: 'Wesele' },
  { value: 'event_firmowy', label: 'Event Firmowy' },
  { value: 'koncert_gala', label: 'Koncert / Gala' },
  { value: 'impreza_prywatna', label: 'Impreza Prywatna' },
  { value: 'inne', label: 'Inne' },
];

// Local storage key for messages
const MESSAGES_STORAGE_KEY = 'ignis_contact_messages';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    guests_count: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (service) {
      const typeMap = {
        wesela: 'wesele',
        eventy_firmowe: 'event_firmowy',
        koncerty_gale: 'koncert_gala',
        imprezy_prywatne: 'impreza_prywatna'
      };
      setFormData(prev => ({ ...prev, event_type: typeMap[service] || '' }));
    }
  }, []);

  const saveMessageToLocalStorage = (data) => {
    try {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const messages = raw ? JSON.parse(raw) : [];
      
      const newMessage = {
        id: Date.now().toString(),
        ...data,
        status: 'new',
        created_date: new Date().toISOString()
      };
      
      messages.unshift(newMessage);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      
      // Dispatch custom event to notify admin panel
      window.dispatchEvent(new Event('ignis-messages-updated'));
      
      return true;
    } catch (err) {
      console.error('Error saving message to localStorage:', err);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const messageData = {
      ...formData,
      guests_count: formData.guests_count ? parseInt(formData.guests_count) : null
    };
    
    // Save to localStorage
    const success = saveMessageToLocalStorage(messageData);
    
    setIsSaving(false);
    
    if (success) {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        guests_count: '',
        message: ''
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Kontakt"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block"
          >
            Skontaktuj się
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            Porozmawiajmy
          </motion.h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-black mb-8">
                Rozpocznijmy Współpracę
              </h2>
              <p className="text-gray-600 mb-12 text-lg">
                Opowiedz nam o swoich marzeniach. Niezależnie od tego, czy planujesz 
                wesele, event firmowy czy prywatne przyjęcie - jesteśmy tu, aby pomóc.
              </p>

              <div className="space-y-8">
                <a href="tel:+48123456789" className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold mb-1">Telefon</h3>
                    <p className="text-gray-600 group-hover:text-gold transition-colors">+48 123 456 789</p>
                    <p className="text-gray-500 text-sm mt-1">Pn-Pt: 9:00-18:00</p>
                  </div>
                </a>

                <a href="mailto:kontakt@ignisevents.pl" className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold mb-1">Email</h3>
                    <p className="text-gray-700 group-hover:text-amber-500 transition-colors">kontakt@ignisevents.pl</p>
                    <p className="text-gray-500 text-sm mt-1">Odpowiadamy w 24h</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold mb-1">Adres</h3>
                    <p className="text-gray-700">ul. Eventowa 15</p>
                    <p className="text-gray-700">00-001 Warszawa</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold mb-1">Godziny pracy</h3>
                    <p className="text-gray-700">Poniedziałek - Piątek: 9:00 - 18:00</p>
                    <p className="text-gray-700">Sobota: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12 h-[300px] bg-white card relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.364553449741!2d21.012228315798085!3d52.22967407975888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc8c92692e49%3A0xc2e97552f015f1a5!2sPa%C5%82ac%20Kultury%20i%20Nauki!5e0!3m2!1spl!2spl!4v1647789456789!5m2!1spl!2spl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card">
                <h2 className="text-2xl font-bold text-black mb-8">Wyślij Zapytanie</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-black mb-3"
                    >
                      Dziękujemy!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-700 text-lg mb-8"
                    >
                      Twoja wiadomość została wysłana pomyślnie.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-600 text-sm mb-8"
                    >
                      Skontaktujemy się z Tobą w ciągu 24 godzin.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex gap-4 justify-center"
                    >
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all transform hover:scale-105"
                      >
                        Wyślij kolejną wiadomość
                      </button>
                      <a
                        href={createPageUrl('Home')}
                        className="px-8 py-3 bg-black/10 text-black font-semibold rounded-lg border border-gray-300 hover:bg-black/5 transition-all"
                      >
                        Wróć na stronę główną
                      </a>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 mb-2 block">Imię i nazwisko *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                          className="bg-white border-gray-200 text-black focus:border-gold"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 mb-2 block">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                          className="bg-white border-gray-200 text-black focus:border-gold"
                          placeholder="jan@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 mb-2 block">Telefon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="bg-white border-gray-200 text-black focus:border-gold"
                          placeholder="+48 123 456 789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_type" className="text-gray-700 mb-2 block">Typ wydarzenia</Label>
                        <Select value={formData.event_type} onValueChange={(value) => handleChange('event_type', value)}>
                          <SelectTrigger className="bg-white border-gray-200 text-black">
                            <SelectValue placeholder="Wybierz typ" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="text-black hover:bg-gray-50">
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="event_date" className="text-gray-700 mb-2 block">Planowana data</Label>
                        <Input
                          id="event_date"
                          type="date"
                          value={formData.event_date}
                          onChange={(e) => handleChange('event_date', e.target.value)}
                          className="bg-white border-gray-200 text-black focus:border-gold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guests_count" className="text-gray-700 mb-2 block">Liczba gości</Label>
                        <Input
                          id="guests_count"
                          type="number"
                          value={formData.guests_count}
                          onChange={(e) => handleChange('guests_count', e.target.value)}
                          className="bg-white border-gray-200 text-black focus:border-gold"
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-700 mb-2 block">Wiadomość *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        required
                        rows={5}
                        className="bg-white border-gray-200 text-black focus:border-gold resize-none"
                        placeholder="Opowiedz nam o swoich planach i oczekiwaniach..."
                      />
                    </div>

                    <GoldButton type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        'Wysyłanie...'
                      ) : (
                        <>
                          Wyślij Wiadomość
                          <Send className="w-5 h-5 ml-2 inline" />
                        </>
                      )}
                    </GoldButton>

                    <p className="text-gray-500 text-sm text-center">
                      * Pola wymagane. Odpowiadamy w ciągu 24 godzin.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}