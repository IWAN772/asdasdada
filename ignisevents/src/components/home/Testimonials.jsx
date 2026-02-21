import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const defaultTestimonials = [
  {
    id: 1,
    author: 'Anna i Marek Kowalscy',
    content: 'Nasze wesele było absolutnie magiczne! Zespół zadbał o każdy detal, od dekoracji po oprawę muzyczną. Goście do dziś wspominają tę niezapomnianą noc.',
    rating: 5,
    event_type: 'Wesele',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: 2,
    author: 'Jan Nowak, CEO TechCorp',
    content: 'Profesjonalizm na najwyższym poziomie. Gala firmowa przeszła nasze najśmielsze oczekiwania. Polecamy każdej firmie!',
    rating: 5,
    event_type: 'Gala Firmowa',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
  },
  {
    id: 3,
    author: 'Maria Wiśniewska',
    content: 'Urodziny mojego męża były niesamowite! Wszystko dopięte na ostatni guzik, goście zachwyceni. Dziękuję za spełnienie marzeń!',
    rating: 5,
    event_type: 'Impreza Urodzinowa',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
  },
];

export default function Testimonials({ testimonials = defaultTestimonials }) {
  const [current, setCurrent] = useState(0);
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const next = () => setCurrent((prev) => (prev + 1) % displayTestimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <SectionTitle
          subtitle="Opinie"
          title="Co Mówią Nasi Klienci"
        />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-amber-500/20" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < displayTestimonials[current].rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 italic">
                  "{displayTestimonials[current].content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={displayTestimonials[current].avatar}
                    alt={displayTestimonials[current].author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <div className="font-bold text-white">
                      {displayTestimonials[current].author}
                    </div>
                    <div className="text-amber-500 text-sm">
                      {displayTestimonials[current].event_type}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-white hover:text-amber-500 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === current
                        ? 'w-8 bg-amber-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 border border-slate-700 hover:border-amber-500 flex items-center justify-center text-white hover:text-amber-500 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}