import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import GoldButton from '../ui/GoldButton';

const defaultEvents = [
  {
    id: 1,
    title: 'Wesele Anny i Marka',
    category: 'wesela',
    location: 'Pałac w Jabłonnie',
    guests_count: 150,
    main_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  },
  {
    id: 2,
    title: 'Gala Firmowa XYZ Corp',
    category: 'eventy_firmowe',
    location: 'Hotel Marriott Warszawa',
    guests_count: 300,
    main_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 3,
    title: 'Koncert Noworoczny',
    category: 'koncerty_gale',
    location: 'Filharmonia Narodowa',
    guests_count: 500,
    main_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  },
];

const categoryLabels = {
  wesela: 'Wesele',
  eventy_firmowe: 'Event Firmowy',
  koncerty_gale: 'Koncert / Gala',
  imprezy_prywatne: 'Impreza Prywatna',
};

export default function FeaturedEvents({ events = defaultEvents }) {
  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Portfolio"
          title="Nasze Realizacje"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.slice(0, 3).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden"
            >
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={event.main_image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-amber-500 text-black text-xs font-semibold uppercase tracking-wider">
                    {categoryLabels[event.category] || event.category}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-amber-500" />
                      {event.guests_count} gości
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to={createPageUrl('Realizacje')}>
            <GoldButton variant="outline">
              Zobacz Wszystkie Realizacje
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </GoldButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}