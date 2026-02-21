import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-gray-100">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-6">
              <span className="text-black">IGNIS</span>
              <span className="text-gradient ml-2">EVENTS</span>
            </div>
            <p className="text-gray-600 mb-6">
              Tworzymy niezapomniane wydarzenia od ponad 15 lat. 
              Twoje marzenia, nasza pasja.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-bold mb-6 uppercase tracking-wider">Nawigacja</h3>
            <ul className="space-y-3">
              {[
                { name: 'Strona Główna', page: 'Home' },
                { name: 'O Nas', page: 'ONas' },
                { name: 'Oferta', page: 'Oferta' },
                { name: 'Realizacje', page: 'Realizacje' },
                { name: 'Galeria', page: 'Galeria' },
                { name: 'Kontakt', page: 'Contact' },
                { name: 'Kod Źródłowy', page: 'KodZrodlowy' },
              ].map((link) => (
                <li key={link.page}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="text-gray-600 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-bold mb-6 uppercase tracking-wider">Usługi</h3>
            <ul className="space-y-3">
              {[
                'Organizacja Wesel',
                'Eventy Firmowe',
                'Koncerty i Gale',
                'Imprezy Prywatne',
                'Catering',
                'Dekoracje'
              ].map((service) => (
                <li key={service}>
                  <Link
                    to={createPageUrl('Oferta')}
                    className="text-gray-600 hover:text-gold transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-black font-bold mb-6 uppercase tracking-wider">Kontakt</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+48123456789" className="flex items-center gap-3 text-gray-600 hover:text-gold transition-colors">
                  <Phone className="w-5 h-5 text-gold" />
                  +48 123 456 789
                </a>
              </li>
              <li>
                <a href="mailto:kontakt@elitevents.pl" className="flex items-center gap-3 text-gray-600 hover:text-gold transition-colors">
                  <Mail className="w-5 h-5 text-gold" />
                  kontakt@ignisevents.pl
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <span>ul. Eventowa 15<br />00-001 Warszawa</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 IgnisEvents. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gold transition-colors">Polityka Prywatności</a>
            <a href="#" className="hover:text-gold transition-colors">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}