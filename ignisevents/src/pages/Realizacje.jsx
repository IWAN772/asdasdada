import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CTASection from '../components/home/CTASection';
import useEntranceAnimation from '@/lib/useEntranceAnimation';

const categoryLabels = {
  all: 'Wszystkie',
  wesela: 'Wesela',
  eventy_firmowe: 'Eventy Firmowe',
  koncerty_gale: 'Koncerty i Gale',
  imprezy_prywatne: 'Imprezy Prywatne',
};

// Default events as fallback
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
    ]
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
    ]
  },
  {
    id: '3',
    title: 'Koncert Noworoczny 2024',
    category: 'koncerty_gale',
    location: 'Filharmonia Narodowa',
    date: '2024-01-01',
    guests_count: 500,
    short_description: 'Spektakularny koncert z udziałem gwiazd polskiej sceny muzycznej.',
    main_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'
    ]
  },
  {
    id: '4',
    title: '50. Urodziny z Klasą',
    category: 'imprezy_prywatne',
    location: 'Villa Nova Gdańsk',
    date: '2024-04-10',
    guests_count: 80,
    short_description: 'Eleganckie przyjęcie urodzinowe w stylu Great Gatsby.',
    main_image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'
    ]
  },
  {
    id: '5',
    title: 'Romantyczny Ślub w Górach',
    category: 'wesela',
    location: 'Zakopane',
    date: '2024-08-22',
    guests_count: 100,
    short_description: 'Kameralne wesele z widokiem na Tatry.',
    main_image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    gallery: []
  },
  {
    id: '6',
    title: 'Konferencja IT Summit',
    category: 'eventy_firmowe',
    location: 'ICE Kraków',
    date: '2024-09-15',
    guests_count: 1000,
    short_description: 'Międzynarodowa konferencja technologiczna z 50 prelegentami.',
    main_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    gallery: []
  },
];

export default function Realizacje() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [events, setEvents] = useState(defaultEvents);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  
  useEntranceAnimation(containerRef);

  // Load events from Base44 or use defaults
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Dynamic import to handle Base44 errors
        const { base44 } = await import('@/api/base44Client');
        
        if (base44) {
          const result = await base44.entities.Event.list({ limit: 100 });
          if (result && result.items && result.items.length > 0) {
            setEvents(result.items);
          }
        }
      } catch (error) {
        console.log('Using default events (Base44 not available)');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to not block initial render
    setTimeout(() => {
      loadEvents();
    }, 100);
  }, []);

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(e => e.category === activeCategory);

  const openLightbox = (event, index = 0) => {
    setSelectedEvent(event);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedEvent(null);
    setLightboxIndex(0);
  };

  const nextImage = () => {
    if (selectedEvent?.gallery?.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % selectedEvent.gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedEvent?.gallery?.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + selectedEvent.gallery.length) % selectedEvent.gallery.length);
    }
  };

  return (
    <div ref={containerRef} className="bg-brand-bg text-black">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&q=80"
            alt="Realizacje"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 page-container">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block stagger-child"
          >
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white stagger-child"
          >
            Nasze Realizacje
          </motion.h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-slate-200">
        <div className="page-container">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 text-sm uppercase tracking-wider font-medium transition-all ${
                  activeCategory === key
                    ? 'bg-amber-500 text-black'
                    : 'border border-slate-700 text-gray-400 hover:border-amber-500 hover:text-amber-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group cursor-pointer stagger-child"
                  onClick={() => openLightbox(event)}
                >
                  <div className="relative h-[350px] overflow-hidden">
                    <img
                      src={event.main_image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-90" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-black text-xs font-semibold uppercase tracking-wider">
                        {categoryLabels[event.category] || event.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {event.short_description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            {event.location}
                          </div>
                        )}
                        {event.guests_count && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-amber-500" />
                            {event.guests_count} gości
                          </div>
                        )}
                        {event.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            {new Date(event.date).toLocaleDateString('pl-PL')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-amber-500/16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold">Zobacz więcej</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredEvents.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Brak realizacji w tej kategorii.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-amber-500 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={selectedEvent.gallery?.[lightboxIndex] || selectedEvent.main_image}
                  alt={selectedEvent.title}
                  className="w-full h-[70vh] object-contain"
                />
                
                {selectedEvent.gallery?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center rounded-md shadow-lg transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center rounded-md shadow-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-400">{selectedEvent.short_description}</p>
                
                {selectedEvent.gallery?.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {selectedEvent.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setLightboxIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === lightboxIndex ? 'w-8 bg-amber-500 rounded-full' : 'w-3 bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </div>
  );
}
