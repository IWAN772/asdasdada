import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import CTASection from '../components/home/CTASection';

const categoryLabels = {
  all: 'Wszystkie',
  wesela: 'Wesela',
  eventy_firmowe: 'Eventy Firmowe',
  koncerty_gale: 'Koncerty i Gale',
  imprezy_prywatne: 'Imprezy Prywatne',
  inne: 'Inne',
};

const defaultImages = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', category: 'wesela', title: 'Wesele w pałacu' },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', category: 'wesela', title: 'Dekoracje weselne' },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', category: 'eventy_firmowe', title: 'Konferencja' },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', category: 'eventy_firmowe', title: 'Gala firmowa' },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80', category: 'koncerty_gale', title: 'Koncert' },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', category: 'koncerty_gale', title: 'Festiwal' },
  { id: '7', image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', category: 'imprezy_prywatne', title: 'Przyjęcie urodzinowe' },
  { id: '8', image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', category: 'wesela', title: 'Ceremonia ślubna' },
  { id: '9', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', category: 'inne', title: 'Event specjalny' },
  { id: '10', image_url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80', category: 'koncerty_gale', title: 'Występ artystyczny' },
  { id: '11', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', category: 'eventy_firmowe', title: 'Bankiet' },
  { id: '12', image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', category: 'wesela', title: 'Wesele w górach' },
];

export default function Galeria() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { data: images } = useQuery({
    queryKey: ['gallery-images'],
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
        const local = getLocal();
        const remoteIds = new Set((remote || []).map(r => r.id));
        const merged = [ ...(remote || []), ...local.filter(l => !remoteIds.has(l.id)) ];
        return merged;
      } catch (err) {
        console.warn('Failed loading gallery from Base44, using local images:', err);
        return getLocal();
      }
    },
    initialData: []
  });

  const displayImages = images.length > 0 ? images : defaultImages;
  const filteredImages = activeCategory === 'all' 
    ? displayImages 
    : displayImages.filter(img => img.category === activeCategory);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
            alt="Galeria"
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
            Inspiracje
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            Galeria Zdjęć
          </motion.h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-gray-100">
        <div className="page-container">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 text-sm uppercase tracking-wider font-medium transition-all ${
                  activeCategory === key
                    ? 'bg-gold-500 text-black'
                    : 'border border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="page-container">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid group cursor-pointer relative overflow-hidden"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || 'Gallery image'}
                    className="w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">{image.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Brak zdjęć w tej kategorii.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={filteredImages[selectedIndex]?.image_url}
                  alt={filteredImages[selectedIndex]?.title || 'Gallery image'}
                  className="w-full max-h-[80vh] object-contain"
                />
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-gold text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-gold text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-white font-medium">{filteredImages[selectedIndex]?.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </div>
  );
}