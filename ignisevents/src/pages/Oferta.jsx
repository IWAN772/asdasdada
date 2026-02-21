import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, Building2, Music, PartyPopper, Check, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import GoldButton from '../components/ui/GoldButton';
import CTASection from '../components/home/CTASection';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const defaultServices = [
  {
    slug: 'wesela',
    icon: Heart,
    name: 'Organizacja Wesel',
    short_description: 'Kompleksowa organizacja wesela marzeń',
    full_description: 'Stworzymy dla Was wesele, które przejdzie do historii. Od pierwszego spotkania do ostatniego tańca - zajmujemy się wszystkim, abyście mogli cieszyć się tym wyjątkowym dniem.',
    features: [
      'Koordynacja całego dnia ślubu i wesela',
      'Dobór i negocjacje z dostawcami',
      'Projektowanie dekoracji i aranżacji',
      'Oprawa muzyczna i artystyczna',
      'Organizacja ceremonii ślubnej',
      'Catering i torty weselne',
      'Fotografia i wideografia',
      'Transport i zakwaterowanie gości'
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    price_from: 'od 15 000 zł'
  },
  {
    slug: 'eventy_firmowe',
    icon: Building2,
    name: 'Eventy Firmowe',
    short_description: 'Profesjonalna oprawa Twojego biznesu',
    full_description: 'Organizujemy konferencje, gale, integracje firmowe i eventy promocyjne. Dbamy o wizerunek Twojej firmy i zapewniamy niezapomniane doświadczenia dla uczestników.',
    features: [
      'Konferencje i szkolenia',
      'Gale i bankiety firmowe',
      'Imprezy integracyjne',
      'Premiery produktów',
      'Eventy promocyjne',
      'Obsługa techniczna',
      'Catering biznesowy',
      'Branding i materiały promocyjne'
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    price_from: 'od 20 000 zł'
  },
  {
    slug: 'koncerty_gale',
    icon: Music,
    name: 'Koncerty i Gale',
    short_description: 'Wielkie wydarzenia na najwyższym poziomie',
    full_description: 'Realizujemy koncerty, festiwale i gale na najwyższym poziomie. Mamy doświadczenie w organizacji wydarzeń dla tysięcy uczestników z pełną oprawą techniczną.',
    features: [
      'Produkcja koncertów',
      'Organizacja festiwali',
      'Gale i ceremonie wręczenia nagród',
      'Obsługa sceny i backstage',
      'Nagłośnienie i oświetlenie',
      'Zarządzanie artystami',
      'Bezpieczeństwo wydarzenia',
      'Marketing i promocja'
    ],
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    price_from: 'od 50 000 zł'
  },
  {
    slug: 'imprezy_prywatne',
    icon: PartyPopper,
    name: 'Imprezy Prywatne',
    short_description: 'Każda okazja zasługuje na wyjątkową oprawę',
    full_description: 'Urodziny, rocznice, przyjęcia okolicznościowe - każde prywatne wydarzenie organizujemy z taką samą starannością i pasją jak największe eventy.',
    features: [
      'Przyjęcia urodzinowe',
      'Rocznice i jubileusze',
      'Chrzciny i komunie',
      'Wieczory panieńskie/kawalerskie',
      'Przyjęcia świąteczne',
      'Garden party',
      'Tematyczne imprezy kostiumowe',
      'Eleganckie kolacje prywatne'
    ],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    price_from: 'od 5 000 zł'
  }
];

export default function Oferta() {
  const [activeService, setActiveService] = useState(null);
  
  const { data: dbServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('order'),
    initialData: []
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setActiveService(serviceParam);
      setTimeout(() => {
        document.getElementById(serviceParam)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, []);

  const services = dbServices.length > 0 ? dbServices : defaultServices;
  const icons = { wesela: Heart, eventy_firmowe: Building2, koncerty_gale: Music, imprezy_prywatne: PartyPopper };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
            alt="Oferta"
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
            Co Oferujemy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            Nasze Usługi
          </motion.h1>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="page-container">
          {services.map((service, index) => {
            const Icon = icons[service.slug] || PartyPopper;
            const isEven = index % 2 === 0;
            
              return (
              <motion.div
                key={service.slug}
                id={service.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center mb-24 last:mb-0 ${
                  activeService === service.slug ? 'ring-2 ring-gold-500 ring-offset-8 ring-offset-white rounded-lg' : ''
                }`}>
              >
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative overflow-hidden group">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {service.price_from && (
                      <div className="absolute bottom-4 left-4 bg-gold-500 text-black px-4 py-2 font-semibold">
                        {service.price_from}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-amber-500/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-black">{service.name}</h2>
                  </div>

                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {service.full_description || service.short_description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {(service.features || []).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                          <Check className="w-5 h-5 text-gold flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                    ))}
                  </div>

                  <Link to={createPageUrl('Contact') + `?service=${service.slug}`}>
                    <GoldButton variant="primary">
                      Zapytaj o wycenę
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </GoldButton>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="page-container">
          <SectionTitle
            subtitle="Proces"
            title="Jak Pracujemy"
          />

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Konsultacja', desc: 'Poznajemy Twoje potrzeby i wizję wydarzenia' },
              { step: '02', title: 'Koncepcja', desc: 'Tworzymy unikalny projekt dopasowany do Ciebie' },
              { step: '03', title: 'Realizacja', desc: 'Koordynujemy wszystkie elementy wydarzenia' },
              { step: '04', title: 'Sukces', desc: 'Tworzenie niezapomnianych wspomnień' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold text-gold/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}