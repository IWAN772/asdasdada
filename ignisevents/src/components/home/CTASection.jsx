import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import GoldButton from '../ui/GoldButton';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&q=80"
          alt="Event Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block"
          >
            Zacznijmy Współpracę
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Gotowy na
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500"> Niezapomniany </span>
            Event?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Skontaktuj się z nami i opowiedz o swoich marzeniach. 
            Razem stworzymy wydarzenie, które przejdzie do historii.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link to={createPageUrl('Contact')}>
              <GoldButton size="lg">
                Bezpłatna Konsultacja
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </GoldButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8"
          >
            <a href="tel:+48123456789" className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors">
              <div className="w-12 h-12 border border-amber-500/50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Zadzwoń</div>
                <div className="font-semibold">+48 123 456 789</div>
              </div>
            </a>
            <a href="mailto:kontakt@ignisevents.pl" className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors">
              <div className="w-12 h-12 border border-amber-500/50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Napisz</div>
                <div className="font-semibold">kontakt@ignisevents.pl</div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}