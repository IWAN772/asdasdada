import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import GoldButton from '../ui/GoldButton';

const navLinks = [
  { name: 'Strona Główna', page: 'Home' },
  { name: 'O Nas', page: 'ONas' },
  { name: 'Oferta', page: 'Oferta' },
  { name: 'Realizacje', page: 'Realizacje' },
  { name: 'Galeria', page: 'Galeria' },
  { name: 'Kontakt', page: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/75 backdrop-blur-md border-b border-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="text-2xl lg:text-3xl font-extrabold text-white">
                <span>IGNIS</span>
                <span className="text-gradient ml-2">EVENTS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`nav-link nav-animate nav-hover-pop ${
                    location.pathname.includes(link.page) || (link.page === 'Home' && location.pathname === '/')
                      ? 'text-gold-gradient'
                      : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="tel:+48123456789" className="flex items-center gap-2 text-white/90 hover:text-gold transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+48 123 456 789</span>
              </a>
              <Link to={createPageUrl('Contact')}>
                <GoldButton size="sm" variant="primary">Zamów Event</GoldButton>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 bg-black/20 rounded-md"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/96 pt-24 px-6">
                <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                      <Link
                        to={createPageUrl(link.page)}
                        className={`block text-2xl font-semibold py-4 border-b border-black/20 ${
                          location.pathname.includes(link.page)
                            ? 'text-gold-gradient'
                            : 'text-white/90'
                        }`}
                      >
                        {link.name}
                      </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Link to={createPageUrl('Contact')}>
                    <GoldButton className="w-full" size="lg">Zamów Event</GoldButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}