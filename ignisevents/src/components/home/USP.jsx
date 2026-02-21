import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Clock, Shield } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const features = [
  {
    icon: Award,
    title: 'Najwyższa Jakość',
    description: 'Współpracujemy tylko z najlepszymi dostawcami i artystami w branży eventowej.'
  },
  {
    icon: Heart,
    title: 'Pasja i Zaangażowanie',
    description: 'Każdy event traktujemy jak własny, wkładając serce w każdy detal.'
  },
  {
    icon: Clock,
    title: 'Punktualność',
    description: 'Precyzyjne planowanie i realizacja zgodna z harmonogramem.'
  },
  {
    icon: Shield,
    title: 'Gwarancja Sukcesu',
    description: '100% satysfakcji klientów. Twoje zadowolenie to nasz priorytet.'
  }
];

export default function USP() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-slate-950">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Dlaczego My"
          title="Wyróżnia Nas Perfekcja"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative p-8 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all duration-500 h-full">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-colors" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-sm flex items-center justify-center mb-6 group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-colors">
                    <feature.icon className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}