import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Building2, Music, PartyPopper, ArrowRight } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const services = [
  {
    icon: Heart,
    title: 'Wesela',
    slug: 'wesela',
    description: 'Magiczny dzień, który zapamiętacie na zawsze. Kompleksowa organizacja wesela marzeń.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80'
  },
  {
    icon: Building2,
    title: 'Eventy Firmowe',
    slug: 'eventy_firmowe',
    description: 'Konferencje, integracje, gale firmowe. Profesjonalna oprawa Twojego biznesu.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'
  },
  {
    icon: Music,
    title: 'Koncerty i Gale',
    slug: 'koncerty_gale',
    description: 'Wielkie wydarzenia, które porywają tłumy. Od planowania po realizację.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80'
  },
  {
    icon: PartyPopper,
    title: 'Imprezy Prywatne',
    slug: 'imprezy_prywatne',
    description: 'Urodziny, rocznice, przyjęcia. Każda okazja zasługuje na wyjątkową oprawę.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'
  }
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <SectionTitle
          subtitle="Oferta"
          title="Nasze Usługi"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                to={createPageUrl('Oferta') + `?service=${service.slug}`}
                className="group flex flex-col md:flex-row bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all duration-500 overflow-hidden h-full"
              >
                {/* Image */}
                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80" />
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="flex items-center text-amber-500 font-semibold group-hover:gap-3 transition-all">
                    Dowiedz się więcej
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}